import { Dialog, DialogContent, DialogActions, Typography, CircularProgress, IconButton, DialogTitle } from '@mui/material'
import { useContext } from 'react'
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { Cancel } from '@mui/icons-material'
import { IRemark } from '../../../types/crm.types'
import UpdateRemarkForm from '../../forms/crm/UpdateRemarkForm'

function UpdateRemarkDialog({ remark, display, setDisplay }: { remark: IRemark, display: boolean, setDisplay: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { choice, setChoice } = useContext(ChoiceContext)
  return (
    <Dialog fullScreen={Boolean(window.screen.width < 500)}
      open={choice === LeadChoiceActions.update_remark || display ? true : false}
    >
      <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => {
        if (!display)
          setChoice({ type: LeadChoiceActions.close_lead })
        else
          setDisplay(false)
      }
      }>
        <Cancel fontSize='large' />
      </IconButton>
      <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Update Remark</DialogTitle>
      <DialogContent>
        {remark ?
          < UpdateRemarkForm remark={remark} show={display} setShow={setDisplay} />
          : <CircularProgress size="large" />
        }
      </DialogContent>
      <DialogActions>
        <Typography
          variant="button"
          component="p"
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
        </Typography >
      </DialogActions>
    </Dialog>
  )
}

export default UpdateRemarkDialog