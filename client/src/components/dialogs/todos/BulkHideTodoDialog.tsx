import { Dialog, DialogContent, DialogTitle, Typography, IconButton, Button, CircularProgress } from '@mui/material'
import { useContext, useEffect, useState } from 'react';
import { ChoiceContext, TodoChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { ITodo } from '../../../types/todo.types';
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { BackendError } from '../../..';
import AlertBar from '../../snacks/AlertBar';
import { BulkHideTodos } from '../../../services/TodoServices';
import { queryClient } from '../../../main';


function BulkHideTodoDialog({ todos }: { todos: ITodo[] }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const [selected_ids, setSelected_ids] = useState<string[]>([])
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            body: {
                ids: string[]
            }
        }>
        (BulkHideTodos, {
            onSuccess: () => {
                queryClient.invalidateQueries('todos')
            }
        })
        
    useEffect(() => {
        let ids: string[] = []
        todos.forEach((todo) => {
            ids.push(todo._id)
        })
        setSelected_ids(ids)
    }, [todos])

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setChoice({ type: TodoChoiceActions.close_todo })
            }, 1000)
        }
    }, [isSuccess, setChoice])

    return (
        <Dialog open={choice === TodoChoiceActions.bulk_hide_todo ? true : false}
            onClose={() => setChoice({ type: TodoChoiceActions.close_todo })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TodoChoiceActions.close_todo })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Hide Todos
            </DialogTitle>
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message="hidden successfully" color="success" />
                ) : null
            }
            <DialogContent>
                <Typography variant="body1" color="error">
                    {`Warning ! This will hide ${todos.length} todos.`}
                </Typography>
                <Button variant="contained" color="primary"
                    onClick={() => {
                        mutate({
                            body: {
                                ids: selected_ids
                            }
                        })
                    }}
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Submit"}
                </Button>
            </DialogContent>

        </Dialog >
    )
}

export default BulkHideTodoDialog
