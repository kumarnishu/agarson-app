import { Dialog, DialogContent, DialogTitle, Typography, IconButton } from '@mui/material'
import { useContext } from 'react';
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { ILead } from '../../../types/crm.types';
import RemoveLeadReferForm from '../../forms/crm/RemoveLeadReferForm';


function RemoveLeadReferralDialog({ lead }: { lead: ILead }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Dialog open={choice === LeadChoiceActions.remove_referral ? true : false}
            onClose={() => setChoice({ type: LeadChoiceActions.close_lead })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>

            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Remove Refer from lead
            </DialogTitle>


            <DialogContent>
                <Typography variant="body1" color="error">
                    {`Warning ! This will remove refreral from  ${lead.name}`}

                </Typography>
                <RemoveLeadReferForm lead={lead} />
            </DialogContent>
        </Dialog >
    )
}

export default RemoveLeadReferralDialog
