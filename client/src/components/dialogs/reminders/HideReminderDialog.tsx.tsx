import { Dialog, DialogContent, DialogTitle, Button, DialogActions, CircularProgress, IconButton } from '@mui/material';
import { useContext, useEffect } from 'react';
import { ReminderChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { IReminder } from '../../../types/reminder.types';
import { queryClient } from '../../../main';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import { useMutation } from 'react-query';
import { Cancel } from '@mui/icons-material';
import AlertBar from '../../snacks/AlertBar';
import { HideReminder } from '../../../services/ReminderServices';

function HideReminderDialog({ reminder }: { reminder: IReminder }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (HideReminder, {
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
            <Dialog open={choice === ReminderChoiceActions.hide_reminder ? true : false}
                onClose={() => setChoice({ type: ReminderChoiceActions.close_reminder })}
            >
                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message={"reset successfull"} color="success" />
                    ) : null
                }
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: ReminderChoiceActions.close_reminder })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Hide Reminder</DialogTitle>
                <DialogContent>
                    This Will hide reminder {reminder.name}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button fullWidth variant="outlined" color="error"
                        onClick={() => {
                            setChoice({ type: ReminderChoiceActions.hide_reminder })
                            mutate(reminder._id)
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress /> :
                            "Hide"}
                    </Button>

                </DialogActions>
            </Dialog>
        </>
    )
}

export default HideReminderDialog