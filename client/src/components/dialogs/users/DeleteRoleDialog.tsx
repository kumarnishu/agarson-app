import { Dialog, DialogContent, DialogTitle, Button, Typography, Stack, CircularProgress, IconButton } from '@mui/material'
import { AxiosResponse } from 'axios';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { Cancel } from '@mui/icons-material';
import AlertBar from '../../snacks/AlertBar';
import { IRole } from '../../../types/user.types';
import { DeleteRole } from '../../../services/UserServices';


function DeleteRoleDialog({ role }: { role: IRole}) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, { role: IRole }>
        (DeleteRole, {
            onSuccess: () => {
                queryClient.invalidateQueries('roles')
            }
        })


    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: UserChoiceActions.close_user })
            }, 1000)
    }, [setChoice, isSuccess])

    return (
        <Dialog open={choice === UserChoiceActions.delete_role ? true : false}
            onClose={() => setChoice({ type: UserChoiceActions.close_user })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: UserChoiceActions.close_user })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Delete Role
            </DialogTitle>
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message={"selected role deleted"} color="success" />
                ) : null
            }
            <DialogContent>
                <Typography variant="body1" color="error">
                    {`Warning ! This will delete selected ${role.role}  permanently`}

                </Typography>
            </DialogContent>
            <Stack
                direction="column"
                gap={2}
                padding={2}
                width="100%"
            >
                <Button fullWidth variant="outlined" color="error"
                    onClick={() => {

                        mutate({ role: role })
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress /> :
                        "Delete"}
                </Button>

            </Stack >
        </Dialog >
    )
}

export default DeleteRoleDialog