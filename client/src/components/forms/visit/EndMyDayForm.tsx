import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext, useState } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, VisitChoiceActions } from '../../../contexts/dialogContext';
import { BackendError, Target } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { IUser } from '../../../types/user.types';
import { EndMyDay } from '../../../services/VisitServices';
import { IVisit } from '../../../types/visit.types';


type TformData = {
    media: string | Blob | File
}

function EndMydayForm({ visit }: { visit: IVisit }) {
    const [location, setLocation] = useState<{ latitude: string, longitude: string, timestamp: Date }>()
    const [file, setFile] = useState<File>()
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IUser>, BackendError, {
            id: string;
            body: FormData;
        }>
        (EndMyDay, {
            onSuccess: () => {
                queryClient.invalidateQueries('visit')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<TformData>({
        initialValues: {
            media: ''
        },
        validationSchema: Yup.object({
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
                .test("type", " allowed only .jpg, .jpeg, .png, .gif ",
                    file => {
                        const Allowed = ["image/png", "image/jpeg", "image/gif"]
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
            if (location) {
                let formdata = new FormData()
                formdata.append("body", JSON.stringify({ end_day_credentials: location }))
                formdata.append("media", values.media)
                mutate({ id: visit._id, body: formdata })
                setLocation(undefined)
            }
            else {
                alert("location not enabled ")
            }
        }
    });

    useEffect(() => {
        if (file)
            setFile(file)
    }, [file])

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setChoice({ type: VisitChoiceActions.close_visit })
            }, 1000)
        }
    }, [isSuccess, setChoice])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((data) => {
            setLocation({ latitude: String(data.coords.latitude), longitude: String(data.coords.longitude), timestamp: new Date(data.timestamp) })
        })
    }, [])


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
                        error={
                            formik.touched.media && formik.errors.media ? true : false
                        }
                        helperText={
                            formik.touched.media && formik.errors.media ? String(formik.errors.media) : ""
                        }
                        label="Upload Selfie"
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
                            <AlertBar message="Your day Ended SuccessFully" color="success" />
                        ) : null
                    }
                    <Button size="large" variant="contained" color="primary" type="submit"
                        disabled={Boolean(isLoading)}
                        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Submit"}
                    </Button>
                </Stack>

                {formik.values.media && <Stack sx={{ bgcolor: 'lightblue', m: 1, p: 1, border: 5, borderColor: 'darkgreen', borderRadius: 2 }}>
                    {/* @ts-ignore */}
                    {formik.values.media && <img src={formik.values.media && URL.createObjectURL(formik.values.media)} alt="image" />}
                </Stack>}
            </Stack>

        </form >
    )
}

export default EndMydayForm
