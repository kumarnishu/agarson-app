import { Dialog, Button, DialogActions } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, ReminderChoiceActions } from '../../../contexts/dialogContext';
import ReminderReportPage from '../../../pages/reminders/ReminderReportPage';
import { IReminder } from '../../../types/reminder.types';

function ViewReminderDialog({ reminder }: { reminder: IReminder }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen open={choice === ReminderChoiceActions.view_reminder ? true : false}

            >
                <ReminderReportPage reminder={reminder} />
                <DialogActions>
                    <Button fullWidth color="inherit" variant="outlined"
                        onClick={() => setChoice({ type: ReminderChoiceActions.close_reminder })}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ViewReminderDialog