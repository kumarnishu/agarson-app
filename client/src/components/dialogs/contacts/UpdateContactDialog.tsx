import { Dialog, DialogContent, DialogTitle, Stack, IconButton } from '@mui/material'
import { useContext } from 'react';
import { ContactChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import UpdateContactForm from '../../forms/contacts/UpdateContactForm';
import { Cancel } from '@mui/icons-material';
import { IContact } from '../../../types';


function UpdateContactDialog({ contact }: { contact: IContact }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Dialog open={choice === ContactChoiceActions.update_contact ? true : false}
            onClose={() => setChoice({ type: ContactChoiceActions.close_contact })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: ContactChoiceActions.close_contact })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Update Contact
            </DialogTitle>

            <DialogContent>
                <UpdateContactForm contact={contact} />
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

export default UpdateContactDialog
