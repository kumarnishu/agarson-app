import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import { useContext } from 'react';
import { HelpChoiceContext, HelpLeadChoiceActions } from '../../../../contexts/HelpChoiceContext';
import { Cancel } from '@mui/icons-material';
import step1 from "../../../../assets/crm/new_lead/step1.png"
import step2 from "../../../../assets/crm/new_lead/step2.png"

function LeadsHelpDialog() {
  const { choice, setChoice } = useContext(HelpChoiceContext)

  return (
    <>
      <Dialog fullScreen open={choice === HelpLeadChoiceActions.create_lead ? true : false}
        onClose={() => setChoice({ type: HelpLeadChoiceActions.close_lead })}
      >
        <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: HelpLeadChoiceActions.close_lead })}>
          <Cancel fontSize='large' />
        </IconButton>
        <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>How to Create New Lead</DialogTitle>
        <DialogContent>
          <Stack direction={'column'}>
            <Typography variant='h4'>Step1</Typography>
            <img src={step1} height={550} alt="step1" />
            <Typography variant='h4'>Step2</Typography>
            <img src={step2}  height={550}alt="step2" />
          </Stack>

        </DialogContent>
      </Dialog>
    </>
  )
}

export default LeadsHelpDialog