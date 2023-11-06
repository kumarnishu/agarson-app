import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { useContext } from 'react';
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import AllRemarksPage from '../../../pages/crm/AllRemarksPage';
import { ILead } from '../../../types/crm.types';
import { Cancel } from '@mui/icons-material';

function ViewRemarksDialog({ lead }: { lead: ILead }) {
  const { choice, setChoice } = useContext(ChoiceContext)
  return (
    <>
      <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === LeadChoiceActions.view_remarks ? true : false}
        scroll="paper"
        onClose={() => setChoice({ type: LeadChoiceActions.close_lead })}
      >
        <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
          <Cancel fontSize='large' />
        </IconButton>
        <DialogTitle sx={{ minWidth: '300px' }} textAlign="center">Remarks History</DialogTitle>
        <Typography sx={{ minWidth: '300px', textTransform: 'capitalize' }} textAlign="center">{lead.name}</Typography>
        <Typography sx={{ minWidth: '300px' }} textAlign="center">{lead.mobile}</Typography>
        <DialogContent>
          <AllRemarksPage lead={lead} />
        </DialogContent>
      </Dialog >
    </>
  )
}

export default ViewRemarksDialog