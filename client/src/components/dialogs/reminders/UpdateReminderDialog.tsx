import { Dialog, DialogTitle, IconButton } from '@mui/material';
import { useContext } from 'react';
import { ReminderChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import EditReminderForm from '../../forms/reminders/EditReminderForm';
import { IReminder } from '../../../types/reminder.types';

function UpdateReminderDialog({ reminder }: { reminder: IReminder }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog open={choice === ReminderChoiceActions.update_reminder ? true : false}

            >   <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: ReminderChoiceActions.close_reminder })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Update Reminder</DialogTitle>
                {reminder && <EditReminderForm reminder={reminder} />}

            </Dialog>
        </>
    )
}

export default UpdateReminderDialog




