import { AxiosResponse } from 'axios'
import { queryClient } from '../../../main'
import { AssignFlow, GetConnectedUsers } from '../../../services/BotServices'
import { useMutation, useQuery } from 'react-query'
import { BackendError } from '../../..'
import {  Button, CircularProgress, Stack, TextField } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from "yup"
import { useEffect, useState } from 'react'
import AlertBar from '../../snacks/AlertBar'
import { IFlow } from '../../../types/bot.types'
import { IUser } from '../../../types/user.types'

function UpdateConnectedUserForm({ flow }: { flow: IFlow }) {
    const { data } = useQuery<AxiosResponse<IUser[]>, BackendError>("connected_users", GetConnectedUsers)
    const [users, setUsers] = useState<IUser[]>()

    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IFlow>, BackendError, { id: string, body: { user_ids: string[] } }>
        (AssignFlow, {
            onSuccess: () => {
                queryClient.invalidateQueries('flows')
                queryClient.invalidateQueries('connected_users')
            }
        })
    const formik = useFormik({
        initialValues: {
            connected_users: flow.connected_users && flow.connected_users.map((user) => { return user._id })
        },
        validationSchema: Yup.object({
            connected_users: Yup.array()
                .required('field')
        }),
        onSubmit: (values) => {
            if (flow && flow._id && values.connected_users)
                mutate({
                    id: flow._id,
                    body: { user_ids: values.connected_users }
                })
        }
    });

    useEffect(() => {
        if (data)
            setUsers(data.data)
    }, [data])
    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <Stack
                    gap={2}
                    pt={2}>
                    < TextField
                        select
                        SelectProps={{
                            native: true,
                            multiple: true
                        }}


                        error={
                            formik.touched.connected_users && formik.errors.connected_users ? true : false
                        }
                        id="connected_users"
                        label="Connected Users"
                        fullWidth
                        required
                        helperText={
                            formik.touched.connected_users && formik.errors.connected_users ? formik.errors.connected_users : ""
                        }
                        {...formik.getFieldProps('connected_users')}
                    >
                        {
                            flow.connected_users && flow.connected_users.map(user => {
                                return (
                                    <>
                                        {
                                            user.connected_number &&
                                            < option key={user._id} value={user._id}>

                                                {user.username + ": : " + String(user.connected_number).replace("91", "").replace("@c.us", "")}
                                            </option >

                                        }
                                    </>
                                )
                            })
                        }

                        {
                            users && users.map((user, index) => {
                                let conn_users = flow.connected_users && flow.connected_users.map((user) => { return user._id })
                                if (!conn_users?.includes(user._id)) {
                                    return (
                                        <>
                                            {
                                                user.connected_number && <option key={index} value={user._id}>
                                                    {user.username + ": : " + String(user.connected_number).replace("91", "").replace("@c.us", "")}
                                                </option>
                                            }
                                        </>
                                    )
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
                            <AlertBar message="successfull updated flow assignee" color="success" />
                        ) : null
                    }
                    <Button variant="contained" color="primary" type="submit"
                        disabled={isLoading}
                        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Assign flow"}
                    </Button>
                </Stack>
            </form >

        </>
    )
}

export default UpdateConnectedUserForm