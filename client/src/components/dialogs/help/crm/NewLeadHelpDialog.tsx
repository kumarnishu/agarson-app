import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useContext } from 'react';
import { HelpChoiceContext, HelpLeadChoiceActions } from '../../../../contexts/HelpChoiceContext';
import { Cancel } from '@mui/icons-material';


function NewLeadHelpDialog() {
  const { choice, setChoice } = useContext(HelpChoiceContext)

  return (
    <>
      <Dialog fullScreen open={choice === HelpLeadChoiceActions.create_lead ? true : false}
        onClose={() => setChoice({ type: HelpLeadChoiceActions.close_lead })}
      >
        <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: HelpLeadChoiceActions.close_lead })}>
          <Cancel fontSize='large' />
        </IconButton>
        <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>New Lead</DialogTitle>
        <DialogContent>
          This Will teach you how to create new lead
        </DialogContent>
      </Dialog>
    </>
  )
}

export default NewLeadHelpDialog