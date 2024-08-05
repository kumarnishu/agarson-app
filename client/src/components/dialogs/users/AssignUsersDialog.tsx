import { Dialog, DialogContent, DialogTitle, Typography, IconButton, Stack, Button, CircularProgress,  MenuItem, Select,  } from '@mui/material'
import { useContext, useEffect, useState } from 'react';
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { IUser } from '../../../types/user.types';
import { AxiosResponse } from 'axios';
import { useMutation, useQuery } from 'react-query';
import { BackendError } from '../../..';
import { AssignUsers, GetUsers } from '../../../services/UserServices';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { useFormik } from 'formik';
import * as Yup from "yup"
import { toTitleCase } from '../../../utils/TitleCase';


function AssignUsersDialog({ user, setUser }: { user: IUser, setUser: React.Dispatch<React.SetStateAction<IUser | undefined>> }) {
    const [users, setUsers] = useState<IUser[]>(user.assigned_users)
    const { data, isSuccess: isUserSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers({hidden:'false'}))
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            id: string,
            body: {
                ids: string[]
            }
        }>
        (AssignUsers, {
            onSuccess: () => {
                queryClient.invalidateQueries('users')
            }
        })
    const formik = useFormik<{
        ids: string[]
    }>({
        initialValues: {
            ids: user.assigned_users.map((u) => { return u._id })
        },
        validationSchema: Yup.object({
            ids: Yup.array()
                .required('field')
        }),
        onSubmit: (values: {
            ids: string[]
        }) => {
            mutate({
                id: user._id,
                body: {
                    ids: values.ids
                }
            })
            queryClient.invalidateQueries('users')
        }
    });

    useEffect(() => {
        if (isUserSuccess) {
            setUsers(data?.data)
        }
    }, [isUserSuccess, data])


    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: UserChoiceActions.close_user })
            setUser(undefined)
        }
    }, [isSuccess, setChoice])
    return (
        <Dialog
            fullWidth
            open={choice === UserChoiceActions.assign_users ? true : false}
            onClose={() => {
                setUser(undefined)
                setChoice({ type: UserChoiceActions.close_user })
            }}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => { setUser(undefined); setChoice({ type: UserChoiceActions.close_user }) }}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Assign Users
            </DialogTitle>
            <DialogContent>
                <Stack
                    gap={2}
                >
                    <Typography variant="body1" color="error">
                        {`Warning ! This will assign ${formik.values.ids.length} users to the selected user.`}

                    </Typography>
                    <Button onClick={() => formik.setValues({ ids: [] })}>Remove Selection</Button>
                    <form onSubmit={formik.handleSubmit}>
                        <Select
                            sx={{ mt: 2 }}
                            multiple
                            fullWidth
                            size='small'
                            {...formik.getFieldProps('ids')}
                        > <MenuItem
                            key={0}
                            value={undefined}
                        >
                                {toTitleCase('Select')}
                            </MenuItem>

                            {users.map((user, index) => (
                                <MenuItem
                                    key={index}
                                    value={user._id}
                                >
                                    {toTitleCase(user.username)}
                                </MenuItem>
                            ))}
                        </Select>

                        <Button style={{ padding: 10, marginTop: 10 }} variant="contained" color="primary" type="submit"
                            disabled={Boolean(isLoading)}
                            fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Assign"}
                        </Button>
                    </form>


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
            </DialogContent>
        </Dialog >
    )
}

export default AssignUsersDialog