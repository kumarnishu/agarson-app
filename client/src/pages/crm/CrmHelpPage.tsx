import { Stack, Typography } from '@mui/material'
import { useContext } from 'react'
import { HelpChoiceContext, HelpLeadChoiceActions } from '../../contexts/HelpChoiceContext'
import LeadsHelpDialog from '../../components/dialogs/help/crm/LeadsHelpDialog'

function CrmHelpPage() {
  const { setChoice } = useContext(HelpChoiceContext)
  return (
    <>
      <Stack direction={'column'} gap={2} padding={2} sx={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>
        <Typography onClick={() => { setChoice({ type: HelpLeadChoiceActions.create_lead }) }}>
          How to Add new Lead ?
        </Typography>
        <Typography>
          How to Update an existing Lead ?
        </Typography>
      </Stack>
      <LeadsHelpDialog />
    </>
  )
}

export default CrmHelpPage