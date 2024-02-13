import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import {  ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { NewReferParty } from '../../../services/LeadsServices';
import { Cities } from '../../../utils/cities';
import { States } from '../../../utils/states';
import AlertBar from '../../snacks/AlertBar';
import { IReferredParty } from '../../../types/crm.types';
import { IUser } from '../../../types/user.types';



function CreateReferForm({ users }: { users: IUser[] }) {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IReferredParty>, BackendError, {
            name: string, customer_name?: string, city: string, state: string, mobile: string, lead_owners: string,
        }>
        (NewReferParty, {
            onSuccess: () => {
                queryClient.invalidateQueries('refers')
                queryClient.invalidateQueries('paginatedrefers')
                
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik({
        initialValues: {
            name: "",
            customer_name: "",
            city: "",
            state: "",
            mobile: "",
            lead_owners: [""],
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Required field'),
            lead_owners: Yup.array()
                .required('field'),
            customer_name: Yup.string(),
            city: Yup.string().required(),
            state: Yup.string().required(),
            mobile: Yup.string()
                .min(10, 'Must be 10 digits')
                .max(10, 'Must be 10 digits')
                .required('Required field')

        }),
        onSubmit: (values) => {
            let data: {
                name: string,
                lead_owners: string,
                customer_name: string,
                city: string,
                state: string,
                mobile: string
            } = {
                name: values.name,
                customer_name: values.customer_name,
                city: values.city,
                state: values.state,
                mobile: values.mobile,
                lead_owners: values.lead_owners.toString()
            }
            mutate(data)
        }
    });



    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: LeadChoiceActions.close_lead })
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
                < TextField

                    select
                    SelectProps={{
                        native: true,
                        multiple: true
                    }}
                    focused

                    error={
                        formik.touched.lead_owners && formik.errors.lead_owners ? true : false
                    }
                    id="lead_owners"
                    label="Refer Owners"
                    fullWidth
                    required
                    helperText={
                        formik.touched.lead_owners && formik.errors.lead_owners ? formik.errors.lead_owners : ""
                    }
                    {...formik.getFieldProps('lead_owners')}
                >

                    {
                        users.map((user, index) => {
                            if (!user.crm_access_fields.is_hidden) {
                                return (<option key={index} value={user._id}>
                                    {user.username}
                                </option>)
                            }
                            else return null
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
