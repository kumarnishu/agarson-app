import { Dialog, DialogContent, DialogTitle, Button, DialogActions, CircularProgress, IconButton } from '@mui/material';
import { useContext, useEffect } from 'react';
import { ReminderChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { IReminder } from '../../../types/reminder.types';
import { queryClient } from '../../../main';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import { useMutation } from 'react-query';
import { DeleteReminder } from '../../../services/ReminderServices';
import { Cancel } from '@mui/icons-material';
import AlertBar from '../../snacks/AlertBar';

function DeleteReminderDialog({ reminder }: { reminder: IReminder }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (DeleteReminder, {
            onSuccess: () => {
                queryClient.invalidateQueries('reminders')
            }
        })

    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: ReminderChoiceActions.close_reminder })
            }, 1000)
    }, [setChoice, isSuccess])
    return (
        <>
            <Dialog open={choice === ReminderChoiceActions.delete_reminder ? true : false}
                onClose={() => setChoice({ type: ReminderChoiceActions.close_reminder })}
            >
                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message="deleted reminder" color="success" />
                    ) : null
                }
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: ReminderChoiceActions.close_reminder })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Delete Reminder</DialogTitle>
                <DialogContent>
                    This Will delete reminder {reminder.name}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button fullWidth variant="outlined" color="error"
                        onClick={() => {
                            setChoice({ type: ReminderChoiceActions.delete_reminder })
                            mutate(reminder._id)
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress /> :
                            "Delete"}
                    </Button>

                </DialogActions>
            </Dialog>
        </>
    )
}

export default DeleteReminderDialog