import { Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext, useState } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, TemplateChoiceActions } from '../../../contexts/dialogContext';
import { BackendError, Target } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { IUser } from '../../../types/user.types';
import { MakeVisitIn } from '../../../services/VisitServices';
import { IVisit } from '../../../types/visit.types';


type TformData = {
    party_name: string,
    city: string,
    summary: string,
    is_old_party: boolean,
    dealer_of: string,
    refs_given: string,
    reviews_taken: number,
    media: string | Blob | File
}

function VisitInForm({ visit }: { visit: IVisit }) {
    const [location, setLocation] = useState<{ latitude: string, longitude: string, timestamp: Date }>()
    const [file, setFile] = useState<File>()
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IUser>, BackendError, {
            id: string;
            body: FormData;
        }>
        (MakeVisitIn, {
            onSuccess: () => {
                queryClient.invalidateQueries('visit')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<TformData>({
        initialValues: {
            party_name: "",
            city: "",
            summary: "",
            is_old_party: false,
            dealer_of: "",
            refs_given: "",
            reviews_taken: 0,
            media: ''
        },
        validationSchema: Yup.object({
            party_name: Yup.string().required("required"),
            city: Yup.string().required("required"),
            summary: Yup.string().required("required"),
            is_old_party: Yup.boolean().required("required"),
            dealer_of: Yup.string().required("required"),
            refs_given: Yup.string().required("required"),
            reviews_taken: Yup.number().required("required"),
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
            if (!location) {
                navigator.geolocation.getCurrentPosition((data) => {
                    setLocation({ latitude: String(data.coords.latitude), longitude: String(data.coords.longitude), timestamp: new Date(data.timestamp) })
                })
            }
            else {
                let formdata = new FormData()
                let Data = {
                    visit_in_credientials: location,
                    party_name: values.party_name,
                    city: values.city,
                    summary: values.summary,
                    is_old_party: values.is_old_party,
                    dealer_of: values.dealer_of,
                    refs_given: values.refs_given,
                    reviews_taken: values.reviews_taken,
                }
                formdata.append("body", JSON.stringify(Data))
                formdata.append("media", values.media)
                mutate({ id: visit._id, body: formdata })
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
                setChoice({ type: TemplateChoiceActions.close_template })
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
                        variant="outlined"
                        fullWidth
                        required
                        error={
                            formik.touched.party_name && formik.errors.party_name ? true : false
                        }
                        id="party_name"
                        label="Party Name"
                        helperText={
                            formik.touched.party_name && formik.errors.party_name ? formik.errors.party_name : ""
                        }
                        {...formik.getFieldProps('party_name')}
                    />
                    <TextField
                        variant="outlined"
                        fullWidth
                        required
                        error={
                            formik.touched.city && formik.errors.city ? true : false
                        }
                        id="city"
                        label="Station"
                        helperText={
                            formik.touched.city && formik.errors.city ? formik.errors.city : ""
                        }
                        {...formik.getFieldProps('city')}
                    />
                    <TextField
                        variant="outlined"
                        fullWidth
                        required
                        error={
                            formik.touched.dealer_of && formik.errors.dealer_of ? true : false
                        }
                        id="dealer_of"
                        label="Dealer of"
                        helperText={
                            formik.touched.dealer_of && formik.errors.dealer_of ? formik.errors.dealer_of : ""
                        }
                        {...formik.getFieldProps('dealer_of')}
                    />
                    <TextField
                        variant="outlined"
                        fullWidth
                        required
                        error={
                            formik.touched.refs_given && formik.errors.refs_given ? true : false
                        }
                        id="refs_given"
                        label="References"
                        helperText={
                            formik.touched.refs_given && formik.errors.refs_given ? formik.errors.refs_given : ""
                        }
                        {...formik.getFieldProps('refs_given')}
                    />
                    <TextField
                        variant="outlined"
                        fullWidth
                        required
                        error={
                            formik.touched.reviews_taken && formik.errors.reviews_taken ? true : false
                        }
                        id="reviews_taken"
                        label="Reviews taken"
                        helperText={
                            formik.touched.reviews_taken && formik.errors.reviews_taken ? formik.errors.reviews_taken : ""
                        }
                        {...formik.getFieldProps('reviews_taken')}
                    />
                    <FormGroup>
                        <FormControlLabel control={<Checkbox
                            checked={Boolean(formik.values.is_old_party)}
                            {...formik.getFieldProps('is_old_party')}
                        />} label="Is Old Party ?" />
                    </FormGroup>
                    <TextField
                        variant="outlined"
                        fullWidth
                        required
                        multiline
                        minRows={5}
                        error={
                            formik.touched.summary && formik.errors.summary ? true : false
                        }
                        id="summary"
                        label="Summary"
                        helperText={
                            formik.touched.summary && formik.errors.summary ? formik.errors.summary : ""
                        }
                        {...formik.getFieldProps('summary')}
                    />
                    <TextField
                        fullWidth
                        focused
                        required
                        error={
                            formik.touched.media && formik.errors.media ? true : false
                        }
                        helperText={
                            formik.touched.media && formik.errors.media ? String(formik.errors.media) : ""
                        }
                        label="Upload Party Photo"
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
                            <AlertBar message="Visit in SuccessFull" color="success" />
                        ) : null
                    }
                    <Button variant="contained" color="primary" type="submit"
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

export default VisitInForm
