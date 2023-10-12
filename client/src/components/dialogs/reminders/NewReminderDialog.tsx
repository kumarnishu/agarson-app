import { Dialog, DialogTitle, IconButton } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, ReminderChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import NewReminderForm from '../../forms/reminders/NewReminderForm';

function NewReminderDialog() {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog open={choice === ReminderChoiceActions.create_reminder ? true : false}

            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: ReminderChoiceActions.close_reminder })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>New Reminder</DialogTitle>
                <NewReminderForm />

            </Dialog>
        </>
    )
}

export default NewReminderDialog