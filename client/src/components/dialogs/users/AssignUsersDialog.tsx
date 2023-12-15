import { Dialog, DialogContent, DialogTitle, Typography, IconButton, Stack, Button, CircularProgress } from '@mui/material'
import { useContext, useEffect, useState } from 'react';
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { IUser } from '../../../types/user.types';
import { AxiosResponse } from 'axios';
import { useMutation, useQuery } from 'react-query';
import { BackendError } from '../../..';
import { AssignUsers, GetUsers } from '../../../services/UserServices';
import { queryClient } from '../../../main';
import SelectUsersInput from '../../select/SelectUsersInput';
import AlertBar from '../../snacks/AlertBar';


function AssignUsersDialog({ user }: { user: IUser }) {
    const [users, setUsers] = useState<IUser[]>([])
    const [ids, setIds] = useState<string[]>(user.assigned_users.map((u) => { return u._id }))

    const { data, isSuccess: isUserSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())
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


    useEffect(() => {
        if (isUserSuccess)
            setUsers(data?.data)
    }, [isUserSuccess, data])

    useEffect(() => {
        if (user)
            setIds(user.assigned_users.map((u) => { return u._id }))
    }, [user])

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setChoice({ type: UserChoiceActions.close_user })
            }, 1000)
        }
    }, [isSuccess, setChoice])

    return (
        <Dialog
            fullWidth
            open={choice === UserChoiceActions.assign_users ? true : false}
            onClose={() => {
                setIds([])
                setChoice({ type: UserChoiceActions.close_user })
            }}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => { setIds([]); setChoice({ type: UserChoiceActions.close_user }) }}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Assign Users
            </DialogTitle>

            <DialogContent>
                <Stack
                    gap={2}
                    pt={2}
                >
                    <Typography variant="body1" color="error">
                        {`Warning ! This will assign ${ids.length} users to the selected user.`}

                    </Typography>
                    <SelectUsersInput
                        user={user}
                        setIds={setIds}
                        users={users}
                        isDisabled={isLoading}
                    />
                    <Button variant="contained" color="primary" onClick={() => {
                        mutate({
                            id: user._id,
                            body: {
                                ids: ids
                            }
                        })
                        queryClient.invalidateQueries('users')
                    }}
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
            </DialogContent>

        </Dialog >
    )
}

export default AssignUsersDialog