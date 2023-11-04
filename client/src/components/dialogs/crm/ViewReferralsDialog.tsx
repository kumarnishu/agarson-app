import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useContext } from 'react';
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { ILead } from '../../../types/crm.types';
import AllReferralPage from '../../../pages/crm/AllReferralPage';
import { Cancel } from '@mui/icons-material';

function ViewReferralsDialog({ leads, display, setDisplay }: { leads: ILead[], display: Boolean, setDisplay: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { choice, setChoice } = useContext(ChoiceContext)

    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)}  open={display || choice === LeadChoiceActions.update_remark || choice === LeadChoiceActions.view_remarks ? true : false}
                scroll="paper"
                onClose={() => setChoice({ type: LeadChoiceActions.close_lead })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setDisplay(false)}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '300px' }} textAlign="center">Referrals History</DialogTitle>
                <DialogContent>
                    <AllReferralPage leads={leads} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ViewReferralsDialog