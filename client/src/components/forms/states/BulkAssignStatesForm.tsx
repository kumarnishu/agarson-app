import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, UserChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import {  IState, IUser } from '../../../types/user.types';
import { AssignStates } from '../../../services/ErpServices';


function BulkAssignStatesForm({ states, users }: { states: { state: IState, users: IUser[] }[], users: IUser[] }) {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            body: {
                states: string[],
                ids: string[]
            }
        }>
        (AssignStates, {
            onSuccess: () => {
                queryClient.invalidateQueries('states')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<{
        state_owners?: string[],
        states?: string[],
    }>({
        initialValues: {
            states: states.map((state) => {
                return state.state._id
            }),
            state_owners: ['']
        },
        validationSchema: Yup.object({
            states: Yup.array()
                .required('Required field'),
            state_owners: Yup.array()
                .required('Required field')
        }),
        onSubmit: (values: {
            state_owners?: string[]
            states?: string[]
        }) => {
            mutate({
                body: {
                    states: values.states || [],
                    ids: values.state_owners || []
                }
            })
        }
    });

    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: UserChoiceActions.close_user })
        }
    }, [isSuccess, setChoice])
    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack
                gap={2}
                pt={2}
            >
                < TextField

                    select
                    SelectProps={{
                        native: true,
                        multiple: true
                    }}
                    focused
                    required
                    error={
                        formik.touched.state_owners && formik.errors.state_owners ? true : false
                    }
                    id="state_owners"
                    label="State Owners"
                    fullWidth
                    helperText={
                        formik.touched.state_owners && formik.errors.state_owners ? formik.errors.state_owners : ""
                    }
                    {...formik.getFieldProps('state_owners')}
                >
                    {
                        users.map((user, index) => {
                            if (!user.erp_access_fields.is_hidden) {
                                return (<option key={index} value={user._id}>
                                    {user.username}
                                </option>)
                            }
                            else return null
                        })
                    }
                </TextField>
                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Assign"}
                </Button>
            </Stack>
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message="assigned successfully" color="success" />
                ) : null
            }

        </form>
    )
}

export default BulkAssignStatesForm
