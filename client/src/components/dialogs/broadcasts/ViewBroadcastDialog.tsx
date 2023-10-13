import { Dialog, Button, DialogActions } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, BroadcastChoiceActions } from '../../../contexts/dialogContext';
import { IBroadcast } from '../../../types/broadcast.types';
import BroadcastReportPage from '../../../pages/broadcast/BroadcastReportPage';

function ViewBroadcastDialog({ broadcast }: { broadcast: IBroadcast }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen open={choice === BroadcastChoiceActions.view_broadcast ? true : false}

            >
                <BroadcastReportPage broadcast={broadcast} />
                <DialogActions>
                    <Button fullWidth color="inherit" variant="outlined"
                        onClick={() => setChoice({ type: BroadcastChoiceActions.close_broadcast })}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ViewBroadcastDialog