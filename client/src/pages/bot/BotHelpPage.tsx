import { Grid } from '@mui/material'
import createLeadUrl from "../../assets/crm/new lead.mp4"
import createLeadPosterUrl from "../../assets/crm/add lead.jpg"


function BotHelpPage() {
  return (
    <>
      <Grid container spacing={2} paddingX={1}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <video width="320" height="240" controls poster={createLeadPosterUrl}>
            <source src={createLeadUrl} type="video/mp4" />
          </video>
        </Grid>
      </Grid>
    </>
  )
}

export default BotHelpPage