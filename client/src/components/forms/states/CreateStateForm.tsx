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
import { CreateState } from '../../../services/ErpServices';
import { IState } from '../../../types/user.types';

function NewStateForm() {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IState>, BackendError, {
            state: string
        }>
        (CreateState, {
            onSuccess: () => {
                queryClient.invalidateQueries('states')
            }
        })


    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik({
        initialValues: {
            state: "",

        },
        validationSchema: Yup.object({
            state: Yup.string()
                .required('Required field'),

        }),
        onSubmit: (values) => {
            mutate({
                state: values.state,

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
                direction="column"
                gap={2}
                pt={2}
            >
                <TextField


                    required
                    fullWidth
                    error={
                        formik.touched.state && formik.errors.state ? true : false
                    }
                    id="state"
                    label="State"
                    helperText={
                        formik.touched.state && formik.errors.state ? formik.errors.state : ""
                    }
                    {...formik.getFieldProps('state')}
                />
                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message="new state created" color="success" />
                    ) : null
                }
                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Create State"}
                </Button>
            </Stack>
        </form>
    )
}

export default NewStateForm
