import { Dialog, DialogTitle, IconButton } from '@mui/material';
import { useContext } from 'react';
import { ReminderChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import EditReminderMessageForm from '../../forms/reminders/EditReminderMessageForm';
import { IReminder } from '../../../types/reminder.types';

function UpdateReminderMessageDialog({ reminder }: { reminder: IReminder }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog open={choice === ReminderChoiceActions.update_message_reminder ? true : false}

            >   <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: ReminderChoiceActions.close_reminder })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Update Reminder</DialogTitle>
                {reminder && <EditReminderMessageForm reminder={reminder} />}

            </Dialog>
        </>
    )
}

export default UpdateReminderMessageDialog




