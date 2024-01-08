import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup"
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { GetMachineCategories, UpdateMachine } from '../../../services/ProductionServices';
import { IMachine, IMachineCategory } from '../../../types/production.types';


function UpdateMachineForm({ machine }: { machine: IMachine }) {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IMachine>, BackendError, {
            body: { name: string, display_name: string, category: string }, id: string
        }>
        (UpdateMachine, {
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
            name: machine.name,
            display_name: machine.display_name,
            category: machine.category,
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Required field'),
            display_name: Yup.string()
                .required('Required field'),
            category: Yup.string()
                .required('Required field'),


        }),
        onSubmit: (values) => {
            mutate({ id: machine._id, body: { name: values.name, display_name: values.display_name, category: values.category } })
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
                    {
                        <option key={"00"} value={machine.category}>
                            {machine.category}
                        </option>
                    }
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
                        <AlertBar message="machine updated" color="success" />
                    ) : null
                }
                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Update Machine"}
                </Button>
            </Stack>
        </form>
    )
}

export default UpdateMachineForm
