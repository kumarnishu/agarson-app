import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup"
import {  ChoiceContext, ProductionChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { IMachine, IMachineCategory } from '../../../types/production.types';
import { CreateMachine, GetMachineCategories } from '../../../services/ProductionServices';

function NewMachineForm() {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IMachine>, BackendError, {
            name: string, display_name: string, category: string, serial_no: number
        }>
        (CreateMachine, {
            onSuccess: () => {
                queryClient.invalidateQueries('machines')
            }
        })

    const { data: catgeories } = useQuery<AxiosResponse<IMachineCategory>, BackendError>("machine_catgeories", GetMachineCategories, {
        staleTime: 10000
    })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik({
        initialValues: {
            name: "",
            display_name: "",
            category: "",
            serial_no: 0
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Required field'),
            display_name: Yup.string()
                .required('Required field'),
            category: Yup.string()
                .required('Required field'),
            serial_no: Yup.number().required('required field')
        }),
        onSubmit: (values) => {
            mutate({
                name: values.name,
                display_name: values.display_name,
                category: values.category,
                serial_no: values.serial_no
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
                        formik.touched.serial_no && formik.errors.serial_no ? true : false
                    }
                    id="serial_no"
                    label="Seriala no"
                    helperText={
                        formik.touched.serial_no && formik.errors.serial_no ? formik.errors.serial_no : ""
                    }
                    {...formik.getFieldProps('serial_no')}
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
                < TextField
                    size='small'
                    select
                    SelectProps={{
                        native: true,
                    }}
                    fullWidth
                    required
                    error={
                        formik.touched.category && formik.errors.category ? true : false
                    }
                    focused
                    id="category"
                    label="category"
                    helperText={
                        formik.touched.category && formik.errors.category ? formik.errors.category : ""
                    }
                    {...formik.getFieldProps('category')}
                >
                    <option key={'00'} value={undefined}>

                    </option>
                    {
                        catgeories && catgeories.data && catgeories.data.categories.map((category, index) => {
                            return (<option key={index} value={category}>
                                {category}
                            </option>)
                        })
                    }
                </TextField>
                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message="new machine created" color="success" />
                    ) : null
                }
                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Create Machine"}
                </Button>
            </Stack>
        </form>
    )
}

export default NewMachineForm
