import { Button, CircularProgress, FormControlLabel, Stack, Switch, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext, useState } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, VisitChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { IUser } from '../../../types/user.types';
import { MakeVisitIn } from '../../../services/VisitServices';
import { IVisit } from '../../../types/visit.types';
import UploadFileButton from '../../buttons/UploadFileButton';


type TformData = {
    party_name: string,
    city: string,
    is_old_party: Boolean,
    mobile: string,
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
            mobile: '',
            is_old_party: false
        },
        validationSchema: Yup.object({
            party_name: Yup.string().required("required"),
            city: Yup.string().required("required"),
            mobile: Yup.string().required("required mobile string")
                .min(10, 'Must be 10 digits')
                .max(10, 'Must be 10 digits'),
            is_old_party: Yup.boolean().required("required")
        }),
        onSubmit: (values: TformData) => {
            if (location && file) {
                let formdata = new FormData()
                let Data = {
                    visit_in_credientials: location,
                    party_name: values.party_name,
                    city: values.city,
                    mobile: values.mobile,
                    is_old_party: values.is_old_party
                }
                formdata.append("body", JSON.stringify(Data))
                formdata.append("media", file)
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
            setChoice({ type: VisitChoiceActions.close_visit })
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
                            formik.touched.mobile && formik.errors.mobile ? true : false
                        }
                        id="mobile"
                        label="Party Mobile"
                        helperText={
                            formik.touched.mobile && formik.errors.mobile ? formik.errors.mobile : ""
                        }
                        {...formik.getFieldProps('mobile')}
                    />
                    <FormControlLabel control={<Switch
                        checked={Boolean(formik.values.is_old_party)}
                        {...formik.getFieldProps('is_old_party')}
                    />} label="Is Old ?" />

                    <UploadFileButton name="media" required={true} camera={true} isLoading={isLoading} label="Upload Party Photo" file={file} setFile={setFile} disabled={isLoading} />

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
                    {location && file && <Button size="large" variant="contained" color="primary" type="submit"
                        disabled={Boolean(isLoading)}
                        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Submit"}
                    </Button>
                    }

                </Stack>
            </Stack>
        </form >
    )
}

export default VisitInForm
