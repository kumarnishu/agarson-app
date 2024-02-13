import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import {  ChoiceContext, ProductionChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { IArticle } from '../../../types/production.types';
import { CreateArticle } from '../../../services/ProductionServices';

function NewArticleForm() {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IArticle>, BackendError, {
            name: string, display_name: string
        }>
        (CreateArticle, {
            onSuccess: () => {
                queryClient.invalidateQueries('articles')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik({
        initialValues: {
            name: "",
            display_name: "",
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Required field'),
            display_name: Yup.string()
                .required('Required field'),
        }),
        onSubmit: (values) => {
            mutate({
                name: values.name,
                display_name: values.display_name,
            })
        }
    });

    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: ProductionChoiceActions.close_production })
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
                    label="Name"
                    helperText={
                        formik.touched.name && formik.errors.name ? formik.errors.name : ""
                    }
                    {...formik.getFieldProps('name')}
                />
                <TextField
                    required
                    fullWidth
                    error={
                        formik.touched.display_name && formik.errors.display_name ? true : false
                    }
                    id="display_name"
                    label="Display Name"
                    helperText={
                        formik.touched.display_name && formik.errors.display_name ? formik.errors.display_name : ""
                    }
                    {...formik.getFieldProps('display_name')}
                />

                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message="new article created" color="success" />
                    ) : null
                }
                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Create Article"}
                </Button>
            </Stack>
        </form>
    )
}

export default NewArticleForm
