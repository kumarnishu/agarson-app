import { Dialog, DialogContent, DialogTitle,  Stack, IconButton } from '@mui/material'
import { useContext } from 'react';
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import CreateReferForm from '../../forms/crm/CreateReferForm';
import { Cancel } from '@mui/icons-material';


function CreateReferDialog() {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Dialog open={choice === LeadChoiceActions.create_refer ? true : false}
            onClose={() => setChoice({ type: LeadChoiceActions.close_lead })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Create A Refer Party
            </DialogTitle>

            <DialogContent>
                <CreateReferForm />
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

export default CreateReferDialog
