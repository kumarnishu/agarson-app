import { Dialog, DialogContent, DialogTitle, Stack, IconButton } from '@mui/material'
import { useContext } from 'react';
import { Cancel } from '@mui/icons-material';
import { ChoiceContext, UserChoiceActions } from '../../../contexts/dialogContext';
import NewStateForm from '../../forms/states/CreateStateForm';


function CreateStateDialog() {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === UserChoiceActions.create_state ? true : false}
            onClose={() => setChoice({ type: UserChoiceActions.close_user })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: UserChoiceActions.close_user })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                New State
            </DialogTitle>

            <DialogContent>
                <NewStateForm />
            </DialogContent>
            <Stack
                direction="column"
                gap={2}
                padding={2}
                width="100%"
            >
            </Stack >
        </Dialog >
    )
}

export default CreateStateDialog
