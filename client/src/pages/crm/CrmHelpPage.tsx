import { Grid } from '@mui/material'
import createLeadUrl from "../../assets/crm/new lead.mp4"
function CrmHelpPage() {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <video width="320" height="240" controls>
            <source src={createLeadUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <video width="320" height="240" controls>
            <source src={createLeadUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <video width="320" height="240" controls>
            <source src={createLeadUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <video width="320" height="240" controls>
            <source src={createLeadUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Grid>
      </Grid>
    </>
  )
}

export default CrmHelpPage