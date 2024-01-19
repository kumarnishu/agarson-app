import { Dialog, DialogTitle, DialogContent, IconButton, Stack, Button, CircularProgress, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { ChoiceContext, TodoChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { ITodo } from '../../../types/todo.types';
import AlertBar from '../../snacks/AlertBar';
import { useMutation } from 'react-query';
import { BackendError } from '../../..';
import { AxiosResponse } from 'axios';
import { ToogleHideTodo } from '../../../services/TodoServices';
import { queryClient } from '../../../main';

function ToogleHideTodoDialog({ todo }: { todo: ITodo }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (ToogleHideTodo, {
            onSuccess: () => {
                queryClient.invalidateQueries('todos')
            }
        })

    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: TodoChoiceActions.close_todo })
            }, 1000)
    }, [setChoice, isSuccess])

    return (
        <>
            <Dialog fullWidth open={choice === TodoChoiceActions.hide_todo ? true : false}
                onClose={() => setChoice({ type: TodoChoiceActions.close_todo })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TodoChoiceActions.close_todo })}>
                    <Cancel fontSize='large' />
                </IconButton>

                <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                    Hide Todo
                </DialogTitle>
                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message=" deleted todo" color="success" />
                    ) : null
                }

                <DialogContent>
                    <Typography variant="body1" color="error">
                        {todo.is_hidden ?
                            `Warning ! This will unhide todo  ${todo.title}`
                            :
                            `Warning ! This will hide todo  ${todo.title}`}

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
                            setChoice({ type: TodoChoiceActions.hide_todo })
                            mutate(todo._id)
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress /> :
                            todo.is_hidden ? "Show todo" : "Hide Todo"}
                    </Button>
                </Stack >
            </Dialog>
        </>
    )
}

export default ToogleHideTodoDialog