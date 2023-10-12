import { Dialog, DialogContent,  DialogTitle,  IconButton } from '@mui/material';
import { useContext } from 'react';
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { ILead } from '../../../types';
import AllReferralPage from '../../../pages/crm/AllReferralPage';
import { Cancel } from '@mui/icons-material';

function ViewReferralsDialog({ leads }: { leads: ILead[] }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog open={choice === LeadChoiceActions.view_referrals ? true : false}
                scroll="paper"
                onClose={() => setChoice({ type: LeadChoiceActions.close_lead })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '300px' }}  textAlign="center">Referrals History</DialogTitle>
                <DialogContent>
                    <AllReferralPage leads={leads} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ViewReferralsDialog