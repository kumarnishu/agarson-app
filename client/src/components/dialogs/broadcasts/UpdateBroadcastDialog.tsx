import { Dialog,  DialogTitle,  IconButton } from '@mui/material';
import { useContext } from 'react';
import { BroadcastChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { IBroadcast } from '../../../types/broadcast.types';
import EditBroadcastForm from '../../forms/broadcast/EditBroadcastForm';
import { Cancel } from '@mui/icons-material';

function UpdateBroadcastDialog({ broadcast }: { broadcast: IBroadcast }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog open={choice === BroadcastChoiceActions.update_broadcast ? true : false}
                
            >   <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: BroadcastChoiceActions.close_broadcast })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Update Broadcast</DialogTitle>
                {broadcast && <EditBroadcastForm broadcast={broadcast} />}
               
            </Dialog>
        </>
    )
}

export default UpdateBroadcastDialog




