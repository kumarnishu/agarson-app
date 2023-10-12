import { Dialog, DialogTitle, IconButton } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, ReminderChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import NewReminderMessageForm from '../../forms/reminders/NewReminderMessageForm';

function NewReminderMessageDialog() {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog open={choice === ReminderChoiceActions.create_message_reminder ? true : false}

            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: ReminderChoiceActions.close_reminder })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>New Reminder</DialogTitle>
                <NewReminderMessageForm />

            </Dialog>
        </>
    )
}

export default NewReminderMessageDialog