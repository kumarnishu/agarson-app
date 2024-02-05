import { Dialog, DialogContent, DialogTitle, Button, Typography, Stack, CircularProgress, IconButton } from '@mui/material'
import { AxiosResponse } from 'axios';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { Cancel } from '@mui/icons-material';
import AlertBar from '../../snacks/AlertBar';
import { StopAllTodos } from '../../../services/TodoServices';
import { ChoiceContext, TodoChoiceActions } from '../../../contexts/dialogContext';


function StopAllTodoDialog({ ids }: { ids: string[] }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, { ids: string[] }>
        (StopAllTodos, {
            onSuccess: () => {
                queryClient.invalidateQueries('todos')
            }
        })

    useEffect(() => {
        if (isSuccess)
            setChoice({ type: TodoChoiceActions.close_todo })
    }, [setChoice, isSuccess])

    return (
        <Dialog open={choice === TodoChoiceActions.bulk_stop_todo ? true : false}
            onClose={() => setChoice({ type: TodoChoiceActions.close_todo })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TodoChoiceActions.close_todo })}>
                <Cancel fontSize='large' />
            </IconButton>

            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Stop All Todos
            </DialogTitle>
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message=" stopped" color="success" />
                ) : null
            }

            <DialogContent>
                <Typography variant="body1" color="error">
                    Warning ! This will Stop all {ids.length} selected todos for all connected users
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
                        mutate({ ids: ids })
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress /> :
                        "Stop All"}
                </Button>

            </Stack >
        </Dialog >
    )
}

export default StopAllTodoDialog
