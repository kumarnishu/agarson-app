import { Dialog, DialogContent, DialogTitle,  Typography,IconButton } from '@mui/material'
import { useContext } from 'react';
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { ILead } from '../../../types/crm.types';
import { Cancel } from '@mui/icons-material';
import ConvertLeadToCustomerForm from '../../forms/crm/ConvertLeadToCustomerForm';


function ConvertLeadToCustomerDialog({ lead }: { lead: ILead }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Dialog open={choice === LeadChoiceActions.convert_customer ? true : false}
            onClose={() => setChoice({ type: LeadChoiceActions.close_lead })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Convert  To Customer
            </DialogTitle>

            <DialogContent>
                <Typography variant="body1" color="error">
                    {`This will make a new customer with ${lead.mobile}`}
                </Typography>
                <ConvertLeadToCustomerForm lead={lead} /> z
            </DialogContent>
        </Dialog >
    )
}

export default ConvertLeadToCustomerDialog
