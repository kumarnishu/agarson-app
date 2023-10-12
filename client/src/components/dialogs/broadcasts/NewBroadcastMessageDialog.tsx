import { Dialog, DialogTitle, IconButton } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, BroadcastChoiceActions } from '../../../contexts/dialogContext';
import NewBroadcastMessageForm from '../../forms/broadcast/NewBroadcastMessageForm';
import { Cancel } from '@mui/icons-material';

function NewBroadcastMessageDialog() {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog open={choice === BroadcastChoiceActions.create_message_broadcast ? true : false}

            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: BroadcastChoiceActions.close_broadcast })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>New Broadcast</DialogTitle>
                <NewBroadcastMessageForm />

            </Dialog>
        </>
    )
}

export default NewBroadcastMessageDialog