import { Dialog, DialogContent, DialogTitle, Stack, IconButton } from '@mui/material'
import { useContext } from 'react';
import { ContactChoiceActions,  ChoiceContext } from '../../../contexts/dialogContext';
import NewContactForm from '../../forms/contacts/NewContactForm';
import { Cancel } from '@mui/icons-material';


function NewContactDialog() {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Dialog open={choice === ContactChoiceActions.create_contact ? true : false}
            onClose={() => setChoice({ type: ContactChoiceActions.close_contact })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: ContactChoiceActions.close_contact })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
               New Contact
            </DialogTitle>

            <DialogContent>
                <NewContactForm />
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

export default NewContactDialog
