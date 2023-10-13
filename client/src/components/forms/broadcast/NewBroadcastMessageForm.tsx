import {  Button, CircularProgress, FormControlLabel, FormGroup, Stack, Switch, TextField, Typography } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext, useState } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, TemplateChoiceActions } from '../../../contexts/dialogContext';
import { BackendError, Target } from '../../..';
import { queryClient } from '../../../main';
import { CreateBroadCastWithMessage } from '../../../services/BroadCastServices';
import AlertBar from '../../snacks/AlertBar';
import { IUser } from '../../../types/user.types';


type TformData = {
    name: string,
    message: string,
    caption: string,
    media: string | Blob | File
    mobiles?: string[]
}

function NewBroadcastMessageForm() {
    const [showLeads, setShowLeads] = useState(false)
    const [file, setFile] = useState<File>()
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IUser>, BackendError, FormData>
        (CreateBroadCastWithMessage, {
            onSuccess: () => {
                queryClient.invalidateQueries('broadcasts')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<TformData>({
        initialValues: {
            name: '',
            message: '',
            caption: '',
            media: '',
            mobiles: undefined

        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Required field'),
            message: Yup.string(),
            caption: Yup.string(),
            mobiles: Yup.string().test(() => {
                if (showLeads)
                    return true
                else if (!showLeads && formik.values.mobiles)
                    return true
                return false
            }),
            media: Yup.mixed<File>()
                .test("size", "size is allowed only less than 10mb",
                    file => {
                        if (file)
                            if (!file.size) //file not provided
                                return true
                            else
                                return Boolean(file.size <= 10 * 1024 * 1024)
                        return true
                    }
                )
                .test("type", " allowed only .jpg, .jpeg, .png, .gif .pdf .csv .xlsx .docs",
                    file => {
                        const Allowed = ["image/png", "image/jpeg", "image/gif", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "application/pdf"]
                        if (file)
                            if (!file.size) //file not provided
                                return true
                            else
                                return Boolean(Allowed.includes(file.type))
                        return true
                    }
                )
        }),
        onSubmit: (values: TformData) => {
            let formdata = new FormData()

            let Data = {}

            if (values.mobiles && !showLeads) {
                Data = {
                    name: values.name,
                    message: values.message,
                    caption: values.caption,
                    mobiles: values.mobiles.toString().replaceAll("\n", ",").split(",")
                }
            }
            else
                Data = {
                    name: values.name,
                    message: values.message,
                    caption: values.caption,
                }

            formdata.append("body", JSON.stringify(Data))
            formdata.append("media", values.media)
            mutate(formdata)
        }
    });

    useEffect(() => {
        if (file)
            setFile(file)
    }, [file])

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setChoice({ type: TemplateChoiceActions.close_template })
            }, 1000)
        }
    }, [isSuccess, setChoice])

    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack sx={{ direction: { xs: 'column', md: 'row' } }}>
                <Stack
                    direction="column"
                    gap={2}
                    sx={{ p: 1 }}
                >
                    <TextField
                        
                        fullWidth
                        required
                        error={
                            formik.touched.name && formik.errors.name ? true : false
                        }
                        id="name"
                        label="Broadcast Name"
                        helperText={
                            formik.touched.name && formik.errors.name ? formik.errors.name : ""
                        }
                        {...formik.getFieldProps('name')}
                    />
                    <TextField
                        multiline
                        minRows={4}
                        fullWidth
                        error={
                            formik.touched.message && formik.errors.message ? true : false
                        }
                        id="message"
                        label="Message"
                        helperText={
                            formik.touched.message && formik.errors.message ? formik.errors.message : ""
                        }
                        {...formik.getFieldProps('message')}
                    />
                    <TextField
                        multiline
                        minRows={4}
                        error={
                            formik.touched.caption && formik.errors.caption ? true : false
                        }
                        id="caption"
                        label="File Caption"
                        fullWidth
                        helperText={
                            formik.touched.caption && formik.errors.caption ? formik.errors.caption : "type \\n for next line"
                        }
                        {...formik.getFieldProps('caption')}
                    />

                    <TextField
                        fullWidth
                        error={
                            formik.touched.media && formik.errors.media ? true : false
                        }
                        helperText={
                            formik.touched.media && formik.errors.media ? String(formik.errors.media) : ""
                        }
                        label="Media"
                        focused
                        type="file"
                        name="media"
                        onBlur={formik.handleBlur}
                        onChange={(e) => {
                            e.preventDefault()
                            const target: Target = e.currentTarget
                            let files = target.files
                            if (files) {
                                let file = files[0]
                                formik.setFieldValue("media", file)
                                setFile(file)
                            }
                        }}
                    />
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={showLeads} onChange={() => setShowLeads(!showLeads)} />} label="Use Leads" />
                    </FormGroup>

                    {!showLeads &&
                        <TextField
                            multiline
                            minRows={4}

                            error={
                                formik.touched.mobiles && formik.errors.mobiles ? true : false
                            }
                            id="mobiles"
                            label="Mobiles"
                            fullWidth
                            helperText={
                                formik.touched.mobiles && formik.errors.mobiles ? "provide correct format for mobiles" : ""
                            }
                            {...formik.getFieldProps('mobiles')}
                        />}
                    {
                        isError ? (
                            <AlertBar message={error?.response.data.message} color="error" />
                        ) : null
                    }
                    {
                        isSuccess ? (
                            <AlertBar message="new custom broadcast created" color="success" />
                        ) : null
                    }
                    <Button variant="contained" color="primary" type="submit"
                        disabled={Boolean(isLoading)}
                        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Create"}
                    </Button>
                </Stack>

                <Stack sx={{ bgcolor: 'black', maxWidth: '350px', p: 2 }}>
                    {formik.values.message && <Typography sx={{ p: 1, m: 1, bgcolor: 'lightgreen', border: 1, borderColor: 'darkgreen', borderRadius: 1 }}>{formik.values.message}</Typography>}
                    {formik.values.media && <Stack sx={{ bgcolor: 'lightgreen', m: 1, p: 1, wordBreak: 'break-all', border: 5, borderColor: 'darkgreen', borderRadius: 2 }}>
                        {/* @ts-ignore */}
                        {formik.values.media && <img src={formik.values.media && URL.createObjectURL(formik.values.media)} alt="media" />}
                        {formik.values.media && <Typography sx={{ py: 1, whiteSpace: 'pre-line' }}>{formik.values.caption.replaceAll("\\n", "\n")}</Typography>}
                    </Stack>}
                </Stack>
            </Stack>

        </form >
    )
}

export default NewBroadcastMessageForm