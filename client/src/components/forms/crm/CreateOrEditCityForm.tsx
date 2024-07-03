import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { CreateOrEditCity, GetAllStates } from '../../../services/LeadsServices';
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import {  ICRMCity, ICRMState } from '../../../types/crm.types';
import * as yup from 'yup';
import { IUser } from '../../../types/user.types';
import { toTitleCase } from '../../../utils/TitleCase';

function CreateOrEditCityForm({ city }: { city?: ICRMCity }) {
    const [states, setStates] = useState<{ state: ICRMState, users: IUser[] }[]>([])
    const { data, isSuccess: isStateSuccess } = useQuery<AxiosResponse<{ state: ICRMState, users: IUser[] }[]>, BackendError>("crm_states", GetAllStates)

    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            body: {
                city: string,
                state:string
            },
            id?: string
        }>
        (CreateOrEditCity, {
            onSuccess: () => {
                queryClient.invalidateQueries('crm_cities')
            }
        })


    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<{
        city: string,
        state: string
    }>({
        initialValues: {
            city: city ? city.city : "",
            state: city ? city.state : ""
        },
        validationSchema: yup.object({
            city: yup.string().required(),
            state: yup.string().required()
        }),
        onSubmit: (values: {
            city: string,
            state: string,
        }) => {
            mutate({
                id: city?._id,
                body: {
                    city: values.city,
                    state: values.state
                }
            })
        }
    });

    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: LeadChoiceActions.close_lead })

        }
    }, [isSuccess, setChoice])

    useEffect(() => {
        if (isStateSuccess) {
            setStates(data.data)
        }
    }, [isSuccess, states, data])
    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack
                gap={2}
                pt={2}
            >
                {/* remarks */}
                <TextField
                    required
                    error={
                        formik.touched.city && formik.errors.city ? true : false
                    }
                    autoFocus
                    id="city"
                    label="City"
                    fullWidth
                    helperText={
                        formik.touched.city && formik.errors.city ? formik.errors.city : ""
                    }
                    {...formik.getFieldProps('city')}
                />

                < TextField

                    select


                    SelectProps={{
                        native: true
                    }}
                    focused

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
                    <option key={0} value={undefined}>
                        Select State
                    </option>
                    {
                        states.map(state => {
                            return (<option key={state.state._id} value={state.state.state}>
                                {toTitleCase(state.state.state)}
                            </option>)
                        })
                    }
                </TextField>

                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : !city ? "Add City" : "Update City"}
                </Button>
            </Stack>

            {
                isError ? (
                    <>
                        {<AlertBar message={error?.response.data.message} color="error" />}
                    </>
                ) : null
            }
            {
                isSuccess ? (
                    <>
                        {!city ? <AlertBar message="new city created" color="success" /> : <AlertBar message="city updated" color="success" />}
                    </>
                ) : null
            }

        </form>
    )
}

export default CreateOrEditCityForm
