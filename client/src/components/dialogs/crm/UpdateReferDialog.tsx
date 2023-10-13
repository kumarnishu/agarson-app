import { Dialog, DialogContent, DialogTitle, CircularProgress, IconButton } from '@mui/material'
import { useContext } from 'react'
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { IReferredParty } from '../../../types/crm.types'
import UpdateReferForm from '../../forms/crm/UpdateReferForm'
import { Cancel } from '@mui/icons-material'

function UpdateReferDialog({ refer }: { refer: IReferredParty }) {
    const { choice, setChoice } = useContext(ChoiceContext)

    return (
        <Dialog
            open={choice === LeadChoiceActions.update_refer ? true : false}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">Update Refer Party</DialogTitle>
            <DialogContent>
                {refer ?
                    < UpdateReferForm refer={refer} />
                    : <CircularProgress size="large" />
                }
            </DialogContent>
        </Dialog>
    )
}

export default UpdateReferDialog