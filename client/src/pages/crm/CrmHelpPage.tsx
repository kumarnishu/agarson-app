import { Box, FormControlLabel, Radio, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import createLeadUrl from "../../assets/crm/new lead.mp4"
import createLeadPosterUrl from "../../assets/crm/add lead.jpg"
import updateLeadUrl from "../../assets/crm/update lead.mp4"
import updateLeadPosterUrl from "../../assets/crm/update lead.jpg"
import addRemarkLeadUrl from "../../assets/crm/add remark.mp4"
import addRemarkLeadPosterUrl from "../../assets/crm/add remark.jpg"
import convertCustomerLeadUrl from "../../assets/crm/convert to customer.mp4"
import convertCustomerLeadPosterUrl from "../../assets/crm/convert a customer.jpg"
import addFieldsLeadUrl from "../../assets/crm/manage lead fields.mp4"
import addFieldsLeadPosterUrl from "../../assets/crm/add fields.jpg"
import createReferLeadUrl from "../../assets/crm/Refer lead.mp4"
import createReferLeadPosterUrl from "../../assets/crm/create refer.jpg"
import viewRemarksLeadUrl from "../../assets/crm/view remarks.mp4"
import viewRemarksLeadPosterUrl from "../../assets/crm/view remarks.jpg"
import viewAllocatedPartiesLeadUrl from "../../assets/crm/View allocated parties.mp4"
import viewAllocatedPartiesLeadPosterUrl from "../../assets/crm/view referred parties.jpg"
import referLeadUrl from "../../assets/crm/Refer lead.mp4"
import referLeadPosterUrl from "../../assets/crm/refer  lead.jpg"
import manageUselessLeadUrl from "../../assets/crm/manage useless leads.mp4"
import manageUselessLeadPosterUrl from "../../assets/crm/manage useless.jpg"
import bulkUploadLeadUrl from "../../assets/crm/bulk upload leads.mp4"
import bulkUploadLeadPosterUrl from "../../assets/crm/bulk upload.jpg"
import { Grid } from '@mui/material'
import { useState } from 'react';



function HelpGuide() {
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


function CrmHelpPage() {
  const [displayGuide, setDisplay] = useState(true)
  return (
    <Box sx={{ p: 2 }}>
      <FormControlLabel value="female" control={<Radio checked={Boolean(displayGuide)} onChange={() => setDisplay(true)} />} label="Guide" />
      <FormControlLabel value="male" control={<Radio checked={Boolean(!displayGuide)} onChange={() => setDisplay(false)} />} label="Videos" />
      {!displayGuide ?
        <Grid container spacing={2} paddingX={1}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <video width="320" height="240" controls poster={createLeadPosterUrl}>
              <source src={createLeadUrl} type="video/mp4" />
            </video>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <video width="320" height="240" controls poster={updateLeadPosterUrl}>
              <source src={updateLeadUrl} type="video/mp4" />
            </video>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <video width="320" height="240" controls poster={addRemarkLeadPosterUrl}>
              <source src={addRemarkLeadUrl} type="video/mp4" />
            </video>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <video width="320" height="240" controls poster={convertCustomerLeadPosterUrl}>
              <source src={convertCustomerLeadUrl} type="video/mp4" />
            </video>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <video width="320" height="240" controls poster={addFieldsLeadPosterUrl}>
              <source src={addFieldsLeadUrl} type="video/mp4" />
            </video>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <video width="320" height="240" controls poster={createReferLeadPosterUrl}>
              <source src={createReferLeadUrl} type="video/mp4" />
            </video>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <video width="320" height="240" controls poster={viewRemarksLeadPosterUrl}>
              <source src={viewRemarksLeadUrl} type="video/mp4" />
            </video>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <video width="320" height="240" controls poster={viewAllocatedPartiesLeadPosterUrl}>
              <source src={viewAllocatedPartiesLeadUrl} type="video/mp4" />
            </video>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <video width="320" height="240" controls poster={referLeadPosterUrl}>
              <source src={referLeadUrl} type="video/mp4" />
            </video>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <video width="320" height="240" controls poster={manageUselessLeadPosterUrl}>
              <source src={manageUselessLeadUrl} type="video/mp4" />
            </video>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <video width="320" height="240" controls poster={bulkUploadLeadPosterUrl}>
              <source src={bulkUploadLeadUrl} type="video/mp4" />
            </video>
          </Grid>

        </Grid> : <HelpGuide />}
    </Box>
  )
}

export default CrmHelpPage