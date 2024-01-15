import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import UpdateBroadcastForm from '../../forms/crm/UpdateBroadcastForm';
import { IBroadcast } from '../../../types/crm.types';

function UpdateBroadcastDialog({ broadcast }: { broadcast: IBroadcast }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)}  open={choice === LeadChoiceActions.update_broadcast ? true : false}

            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Create Broadcast</DialogTitle>
                <DialogContent>
                    <UpdateBroadcastForm broadcast={broadcast} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default UpdateBroadcastDialog