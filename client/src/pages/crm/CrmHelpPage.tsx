import { Grid } from '@mui/material'
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

function CrmHelpPage() {
  return (
    <>
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
      </Grid>
    </>
  )
}

export default CrmHelpPage