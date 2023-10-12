import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';

import AlertBar from '../../snacks/AlertBar';
import { UpdateContact } from '../../../services/ContactServices';
import { IContact } from '../../../types';



function UpdateContactForm({ contact }: { contact: IContact }) {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IContact>, BackendError, {
            id: string, body: { name: string, mobile: string }
        }>
        (UpdateContact, {
            onSuccess: () => {
                queryClient.invalidateQueries('contacts')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik({
        initialValues: {
            name: contact.name,
            mobile: contact.mobile.replace("91", "").replace("@c.us", "")
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Required field'),
            mobile: Yup.string()
                .min(10, 'Must be 10 digits')
                .max(10, 'Must be 10 digits')
                .required('Required field')

        }),
        onSubmit: (values) => {
            mutate({ id: contact._id, body: values })
        }
    });



    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setChoice({ type: UserChoiceActions.close_user })
            }, 1000)
        }
    }, [isSuccess, setChoice])

    return (
        <form onSubmit={formik.handleSubmit}>

            <Stack
                direction="column"
                gap={2}
                pt={2}
            >
                <TextField


                    required
                    fullWidth
                    error={
                        formik.touched.name && formik.errors.name ? true : false
                    }
                    id="name"
                    label="Contact name"
                    helperText={
                        formik.touched.name && formik.errors.name ? formik.errors.name : ""
                    }
                    {...formik.getFieldProps('name')}
                />
                <TextField
                    type="number"
                    fullWidth
                    error={
                        formik.touched.mobile && formik.errors.mobile ? true : false
                    }
                    id="mobile"
                    label="Mobile"
                    helperText={
                        formik.touched.mobile && formik.errors.mobile ? formik.errors.mobile : ""
                    }
                    {...formik.getFieldProps('mobile')}
                />
                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message="contact updated" color="success" />
                    ) : null
                }
                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Update Cotact"}
                </Button>
            </Stack>
        </form>
    )
}

export default UpdateContactForm
