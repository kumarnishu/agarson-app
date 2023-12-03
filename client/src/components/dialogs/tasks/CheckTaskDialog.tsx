import { Dialog, DialogTitle, DialogContent, IconButton, Stack, Button, CircularProgress, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { ChoiceContext, TaskChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { ITask } from '../../../types/task.types';
import AlertBar from '../../snacks/AlertBar';
import { useMutation } from 'react-query';
import { BackendError } from '../../..';
import { AxiosResponse } from 'axios';
import { ToogleMyTasks } from '../../../services/TaskServices';
import { queryClient } from '../../../main';

function CheckTaskDialog({ task }: {
    task: {
        task: ITask;
        previous_date: Date;
        next_date: Date;
        box: {
            date: Date;
            is_completed: boolean;
        };
    }
}) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isSuccess, isError, error, isLoading } = useMutation
        <AxiosResponse<string>, BackendError, {
            id: string,
            date: string
        }>
        (ToogleMyTasks, {
            onSuccess: () => {
                queryClient.invalidateQueries('self_tasks')
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
            <Dialog fullWidth open={choice === TaskChoiceActions.check_task ? true : false}
                onClose={() => setChoice({ type: TaskChoiceActions.close_task })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TaskChoiceActions.close_task })}>
                    <Cancel fontSize='large' />
                </IconButton>

                <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                    Check Task
                </DialogTitle>
                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message=" checked task" color="success" />
                    ) : null
                }

                <DialogContent>
                    <Typography variant="body1" color="error">
                        {`Warning ! This will check task  ${task.task.task_description}`}

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
                            if (task) {
                                mutate({ id: task.task._id, date: new Date(task.box.date).toString() })
                            }
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress /> :
                            "Submit"}
                    </Button>
                </Stack >
            </Dialog>
        </>
    )
}

export default CheckTaskDialog