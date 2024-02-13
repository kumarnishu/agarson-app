import { Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, TemplateChoiceActions } from '../../../contexts/dialogContext';
import { BackendError, Target } from '../../..';
import { queryClient } from '../../../main';
import { CreateTemplate, GetCategories } from '../../../services/TemplateServices';
import AlertBar from '../../snacks/AlertBar';
import { IUser } from '../../../types/user.types';
import { ITemplateCategoryField } from '../../../types/template.types';


type TformData = {
    name: string,
    message: string,
    category: string,
    caption: string,
    media: string | Blob | File
}

function NewtemplateForm() {
    const [file, setFile] = useState<File>()
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IUser>, BackendError, FormData>
        (CreateTemplate, {
            onSuccess: () => {
                queryClient.invalidateQueries('templates')
            }
        })
    const { data: catgeories } = useQuery<AxiosResponse<ITemplateCategoryField>, BackendError>("catgeories", GetCategories, {
        staleTime: 10000
    })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<TformData>({
        initialValues: {
            name: '',
            message: '',
            category: catgeories?.data && catgeories?.data.categories[0] || "",
            caption: '',
            media: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Required field'),
            message: Yup.string(),
            category: Yup.string().required("required"),
            caption: Yup.string(),
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
            let Data = {
                name: values.name,
                message: values.message.replaceAll("\\n", "\n").replaceAll("\\t", "\t"),
                caption: values.caption.replaceAll("\\n", "\n").replaceAll("\\t", "\t"),
                category: values.category,
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
            setChoice({ type: TemplateChoiceActions.close_template })
        }
    }, [isSuccess, setChoice])
    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack sx={{ direction: { xs: 'column', md: 'row' } }}>
                <Stack
                    direction="column"
                    gap={2}
                    sx={{ pt: 2 }}
                >
                    <TextField

                        fullWidth
                        required
                        error={
                            formik.touched.name && formik.errors.name ? true : false
                        }
                        id="name"
                        label="Template Name"
                        helperText={
                            formik.touched.name && formik.errors.name ? formik.errors.name : ""
                        }
                        {...formik.getFieldProps('name')}
                    />
                    {catgeories?.data && < TextField
                        size='small'
                        select
                        SelectProps={{
                            native: true,
                        }}
                        focused
                        fullWidth
                        required
                        error={
                            formik.touched.category && formik.errors.category ? true : false
                        }
                        id="category"
                        label="category"
                        helperText={
                            formik.touched.category && formik.errors.category ? formik.errors.category : ""
                        }
                        {...formik.getFieldProps('category')}
                    >

                        {
                            catgeories && catgeories.data && catgeories.data.categories.map((category, index) => {
                                return (<option key={index} value={category}>
                                    {category}
                                </option>)
                            })
                        }
                    </TextField>}
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
                            formik.touched.caption && formik.errors.caption ? formik.errors.caption : ""
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
                    {
                        isError ? (
                            <AlertBar message={error?.response.data.message} color="error" />
                        ) : null
                    }
                    {
                        isSuccess ? (
                            <AlertBar message="new template created" color="success" />
                        ) : null
                    }
                    <Button variant="contained" color="primary" type="submit"
                        disabled={Boolean(isLoading)}
                        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Create"}
                    </Button>
                </Stack>

                {formik.values.media || formik.values.message ?
                    <Stack sx={{ bgcolor: 'black', maxWidth: '350px', p: 2 }}>
                        {formik.values.message && <Typography sx={{ p: 1, m: 1, bgcolor: 'lightgreen', whiteSpace: 'pre-wrap', border: 1, borderColor: 'darkgreen', borderRadius: 1 }}>{formik.values.message.replaceAll("\\n", "\n").replaceAll("\\t", "\t")}</Typography>}
                        {formik.values.media && <Stack sx={{ bgcolor: 'lightgreen', m: 1, p: 1, wordBreak: 'break-all', border: 5, borderColor: 'darkgreen', borderRadius: 2 }}>
                            {/* @ts-ignore */}
                            {formik.values.media && <img src={formik.values.media && URL.createObjectURL(formik.values.media)} alt="image" />}
                            {formik.values.caption && <Typography sx={{ py: 1, whiteSpace: 'pre-wrap' }}>{formik.values.caption.replaceAll("\\n", "\n").replaceAll("\\t", "\t")}</Typography>}
                        </Stack>}
                    </Stack> : null}
            </Stack>

        </form >
    )
}

export default NewtemplateForm
