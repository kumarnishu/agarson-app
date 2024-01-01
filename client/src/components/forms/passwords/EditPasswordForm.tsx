import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, PasswordChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { IUser } from '../../../types/user.types';
import { UpdatePassword } from '../../../services/PasswordServices';
import { IPassword } from '../../../types/password.types';

function UpdatePasswordForm({ password, users }: { users: IUser[], password: IPassword }) {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            id: string, body: { state: string, username: string, password: string, ids: string[] }
        }>
        (UpdatePassword, {
            onSuccess: () => {
                queryClient.invalidateQueries('passwords')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<{
        state: string, username: string, password: string, ids: string[]
    }>({
        initialValues: {
            state: password.state,
            username: password.username,
            password: password.password,
            ids: password.persons.map((p) => { return p._id })
        },
        validationSchema: Yup.object({
            state: Yup.string().required("required field"),
            ids: Yup.array()
                .required('field')
            ,
            username: Yup.string().required("required field")
            ,
            password: Yup.string().required("required field"),
        }),
        onSubmit: (values: {
            state: string; username: string; password: string, ids: string[]
        }) => {
            mutate({
                id: password._id,
                body: { state: values.state, username: values.username, password: values.password, ids: values.ids }
            })
        }
    });

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setChoice({ type: PasswordChoiceActions.close_password })
            }, 1000)
        }
    }, [isSuccess, setChoice])
    console.log(formik.values)
    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack
                gap={2}
                pt={2}
            >
                {/* password_descriptions */}
                < TextField

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
                />

                <TextField
                    multiline
                    minRows={2}
                    required
                    error={
                        formik.touched.username && formik.errors.username ? true : false
                    }
                    id="username"
                    label="Username"
                    fullWidth
                    helperText={
                        formik.touched.username && formik.errors.username ? formik.errors.username : ""
                    }
                    {...formik.getFieldProps('username')}
                />
                <TextField
                    error={
                        formik.touched.password && formik.errors.password ? true : false
                    }
                    id="password"
                    label="Password"
                    fullWidth
                    helperText={
                        formik.touched.password && formik.errors.password ? formik.errors.password : ""
                    }
                    {...formik.getFieldProps('password')}
                />

                < TextField

                    select
                    SelectProps={{
                        native: true,
                        multiple: true
                    }}
                    focused

                    error={
                        formik.touched.ids && formik.errors.ids ? true : false
                    }
                    id="ids"
                    label="Persons"
                    fullWidth
                    required
                    helperText={
                        formik.touched.ids && formik.errors.ids ? formik.errors.ids : ""
                    }
                    {...formik.getFieldProps('ids')}
                >
                   
                    {
                        users.map((user, index) => {
                            if (!user.passwords_access_fields.is_hidden) {
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
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Submit"}
                </Button>
            </Stack>
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message="new password added" color="success" />
                ) : null
            }

        </form>
    )
}

export default UpdatePasswordForm
