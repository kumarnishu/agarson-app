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
import { CreateContact } from '../../../services/ContactServices';
import { IContact } from '../../../types/contact.types';

function NewContactForm() {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IContact>, BackendError, {
            name: string, designation:string,mobile: string
        }>
        (CreateContact, {
            onSuccess: () => {
                queryClient.invalidateQueries('contacts')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik({
        initialValues: {
            name: "",
            mobile: "",
            designation:""
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Required field'),
            designation: Yup.string()
                .required('Required field'),
            mobile: Yup.string()
                .min(10, 'Must be 10 digits')
                .max(10, 'Must be 10 digits')
                .required('Required field')

        }),
        onSubmit: (values) => {
            mutate(values)
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
                    required
                    fullWidth
                    error={
                        formik.touched.designation && formik.errors.designation ? true : false
                    }
                    id="designation"
                    label="Party"
                    helperText={
                        formik.touched.designation && formik.errors.designation ? formik.errors.designation : ""
                    }
                    {...formik.getFieldProps('designation')}
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
                        <AlertBar message="new contact created" color="success" />
                    ) : null
                }
                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Create Cotact"}
                </Button>
            </Stack>
        </form>
    )
}

export default NewContactForm
