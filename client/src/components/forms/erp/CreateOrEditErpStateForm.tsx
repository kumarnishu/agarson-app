import { Button,  CircularProgress,  Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import * as yup from 'yup';
import { IState } from '../../../types/user.types';
import { CreateOreditErpState } from '../../../services/ErpServices';

function CreateOrEditErpStateForm({ state }: { state?: IState}) {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            state?: IState | undefined;
            body: {
                state: string ;
            };
        }>
        (CreateOreditErpState, {
            onSuccess: () => {
                queryClient.invalidateQueries('erp_states')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<{
        state: string
    }>({
        initialValues: {
            state: state ? state.state : ""
        },
        validationSchema:yup.object({
            state:yup.string().required()
        }),
        onSubmit: (values: {
            state: string,
        }) => {
            mutate({
               state:state,
                body: {
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
                        formik.touched.state && formik.errors.state ? true : false
                    }
                    autoFocus
                    id="state"
                    label="State"
                    fullWidth
                    helperText={
                        formik.touched.state && formik.errors.state ? formik.errors.state : ""
                    }
                    {...formik.getFieldProps('state')}
                />
              
               

                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : !state ? "Add State" : "Update State"}
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
                        {!state ? <AlertBar message="new state created" color="success" /> : <AlertBar message="state updated" color="success" />}
                    </>
                ) : null
            }

        </form>
    )
}

export default CreateOrEditErpStateForm
