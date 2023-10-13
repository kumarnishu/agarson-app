import {  Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { NewReferParty } from '../../../services/LeadsServices';
import { Cities } from '../../../utils/cities';
import { States } from '../../../utils/states';
import AlertBar from '../../snacks/AlertBar';
import { IReferredParty } from '../../../types/crm.types';



function CreateReferForm() {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IReferredParty>, BackendError, {
            name: string, customer_name?: string, city: string, state: string, mobile: string
        }>
        (NewReferParty, {
            onSuccess: () => {
                queryClient.invalidateQueries('refers')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik({
        initialValues: {
            name: "",
            customer_name: "",
            city: "",
            state: "",
            mobile: ""
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Required field'),
            customer_name: Yup.string(),
            city: Yup.string().required(),
            state: Yup.string().required(),
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
                    label="Party name"
                    helperText={
                        formik.touched.name && formik.errors.name ? formik.errors.name : ""
                    }
                    {...formik.getFieldProps('name')}
                />
                <TextField

                    fullWidth
                    error={
                        formik.touched.customer_name && formik.errors.customer_name ? true : false
                    }
                    id="customer_name"
                    label="Customer Name"
                    helperText={
                        formik.touched.customer_name && formik.errors.customer_name ? formik.errors.customer_name : ""
                    }
                    {...formik.getFieldProps('customer_name')}
                />

                <TextField

                    type="number"
                    required
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

                < TextField

                    select
                    required
                    SelectProps={{
                        native: true
                    }}
                    

                    error={
                        formik.touched.city && formik.errors.city ? true : false
                    }
                    id="city"
                    label="City"
                    fullWidth
                    helperText={
                        formik.touched.city && formik.errors.city ? formik.errors.city : ""
                    }
                    {...formik.getFieldProps('city')}
                >
                    <option value="">
                    </option>
                    {
                        Cities.map((city, index) => {
                            return (<option key={index} value={city}>
                                {city}
                            </option>)
                        })
                    }
                </TextField>

                {/* state */}


                < TextField

                    select
                    required

                    SelectProps={{
                        native: true
                    }}
                    

                    error={
                        formik.touched.state && formik.errors.state ? true : false
                    }
                    id="state"
                    label="State"
                    fullWidth
                    helperText={
                        formik.touched.state && formik.errors.state ? formik.errors.state : ""
                    }
                    {...formik.getFieldProps('state')}
                >
                    <option value="">

                    </option>
                    {
                        States.map(state => {
                            return (<option key={state.code} value={state.state}>
                                {state.state}
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
                        <AlertBar message="new refer created" color="success" />
                    ) : null
                }
                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Create Refer"}
                </Button>
            </Stack>
        </form>
    )
}

export default CreateReferForm
