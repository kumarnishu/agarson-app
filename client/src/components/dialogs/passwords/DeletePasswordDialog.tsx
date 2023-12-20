import { Dialog, DialogTitle, DialogContent, IconButton, Stack, Button, CircularProgress, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { ChoiceContext, PasswordChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { IPassword } from '../../../types/password.types';
import AlertBar from '../../snacks/AlertBar';
import { useMutation } from 'react-query';
import { BackendError } from '../../..';
import { AxiosResponse } from 'axios';
import { DeletePassword } from '../../../services/PasswordServices';
import { queryClient } from '../../../main';

function DeletePasswordDialog({ password }: { password: IPassword }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (DeletePassword, {
            onSuccess: () => {
                queryClient.invalidateQueries('passwords')
            }
        })

    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: PasswordChoiceActions.close_password })
            }, 1000)
    }, [setChoice, isSuccess])

    return (
        <>
            <Dialog fullWidth open={choice === PasswordChoiceActions.delete_password ? true : false}
                onClose={() => setChoice({ type: PasswordChoiceActions.close_password })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: PasswordChoiceActions.close_password })}>
                    <Cancel fontSize='large' />
                </IconButton>

                <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                    Delete Password
                </DialogTitle>
                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message=" deleted password" color="success" />
                    ) : null
                }

                <DialogContent>
                    <Typography variant="body1" color="error">
                        {`Warning ! This will delete password  ${password.state} & ${password.username}`}

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
                            setChoice({ type: PasswordChoiceActions.delete_password })
                            mutate(password._id)
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress /> :
                            "Delete Password"}
                    </Button>
                </Stack >
            </Dialog>
        </>
    )
}

export default DeletePasswordDialog