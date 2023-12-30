import { Stack, Typography } from '@mui/material';

function CrmHelpPage() {
  return (
    <Stack direction={'column'} gap={2} padding={2}>
      <Stack>
        <Typography variant='subtitle2' fontSize={17}>1. Reminders.</Typography>
        <Typography variant='subtitle1'>1. View Last 7 days reminders.</Typography>
      </Stack>
      <Stack>
        <Typography variant='subtitle2' fontSize={17}>2. Activities.</Typography>
        <Typography variant='subtitle1'>1. View Last 7 remarks included reminders.</Typography>
      </Stack>
      <Stack>
        <Typography variant='subtitle2' fontSize={17}>3. Leads.</Typography>
        <Typography variant='subtitle1'>1. Creating,updating and deleteing a lead.</Typography>
        <Typography variant='subtitle1'>2. Make a Lead  useless by button and also when customer type stop on whatsapp</Typography>
        <Typography variant='subtitle1'>3. Convert a Lead into customer.</Typography>
        <Typography variant='subtitle1'>4. Add Remark with reminder date.</Typography>
        <Typography variant='subtitle1'>5. Assign lead to others with remarks.</Typography>
        <Typography variant='subtitle1'>6. View Remarks history of a lead.</Typography>
        <Typography variant='subtitle1'>7. Bulk add leads with excel file.</Typography>
        <Typography variant='subtitle1'>8.  Bulk update leads with excel file.</Typography>
        <Typography variant='subtitle1'>9. Searching leads with comma seperated values upto 4 words.</Typography>
        <Typography variant='subtitle1'>10.Bulk Assign leads to users.</Typography>
        <Typography variant='subtitle1'>11. Export leads into excel file.</Typography>
        <Typography variant='subtitle1'>12. Refer a lead to our refer party(working with us)</Typography>
        <Typography variant='subtitle1'>13. Whatsapp Broadcast is running on these leads phone numbers</Typography>
      </Stack>
      <Stack>
        <Typography variant='subtitle2' fontSize={17}>4. Refers</Typography>
        <Typography variant='subtitle1'>1. Creating,updating and deleteing a refer party(working with us directly).</Typography>
        <Typography variant='subtitle1'>2. Assign refer to users with remarks</Typography>
        <Typography variant='subtitle1'>3. View Allocated leads to the refer parties.</Typography>
        <Typography variant='subtitle1'>4. Bulk Assign refer to users.</Typography>
        <Typography variant='subtitle1'>5. Searching refer with comma seperated values upto 4 words</Typography>
        <Typography variant='subtitle1'>7.Export Refers into excel file.</Typography>
      </Stack>
      <Stack>
        <Typography variant='subtitle2' fontSize={17}>5. Customers</Typography>
        <Typography variant='subtitle1'>1. Converted customers are visible here.</Typography>
        <Typography variant='subtitle1'>2. customers are not allowed to delete</Typography>
      </Stack>
      <Stack>
        <Typography variant='subtitle2' fontSize={17}>6. Useless</Typography>
        <Typography variant='subtitle1'>1. useless leads are visible here.</Typography>
        <Typography variant='subtitle1'>2. bulk delete allowed for owner only</Typography>
        <Typography variant='subtitle1'>3. Not used in whatsapp broadcast messages</Typography>
      </Stack>
      <Stack>
        <Typography variant='subtitle2' fontSize={17}>7. Fields</Typography>
        <Typography variant='subtitle1'>1. We can add more fields or delete existing ones</Typography>
        <Typography variant='subtitle1'>2. lead stage,lead type and lead source can be changed from  here</Typography>
      </Stack>
    </Stack>
  )
}

export default CrmHelpPage