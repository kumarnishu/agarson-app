import { Dialog, DialogTitle, DialogContent, IconButton,  Stack, Button, CircularProgress, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { ChoiceContext, TaskChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { ITask } from '../../../types/task.types';
import AlertBar from '../../snacks/AlertBar';
import { useMutation } from 'react-query';
import { BackendError } from '../../..';
import { AxiosResponse } from 'axios';
import { DeleteTask } from '../../../services/TaskServices';
import { queryClient } from '../../../main';

function DeleteTaskDialog({ task }: { task: ITask }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (DeleteTask, {
            onSuccess: () => {
                queryClient.invalidateQueries('tasks')
            }
        })

    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: TaskChoiceActions.close_task })
            }, 1000)
    }, [setChoice, isSuccess])

    return (
        <>
            <Dialog fullWidth open={choice === TaskChoiceActions.delete_task ? true : false}
                onClose={() => setChoice({ type: TaskChoiceActions.close_task })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TaskChoiceActions.close_task })}>
                    <Cancel fontSize='large' />
                </IconButton>

                <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                    Delete Task
                </DialogTitle>
                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message=" deleted task" color="success" />
                    ) : null
                }

                <DialogContent>
                    <Typography variant="body1" color="error">
                        {`Warning ! This will delete  ${task.task_description}`}

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
                            setChoice({ type: TaskChoiceActions.delete_task })
                            mutate(task._id)
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress /> :
                            "Delete Task"}
                    </Button>
                </Stack >
            </Dialog>
        </>
    )
}

export default DeleteTaskDialog