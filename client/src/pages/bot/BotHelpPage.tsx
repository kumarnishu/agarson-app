import { Grid } from '@mui/material'
import connectWhatsappUrl from "../../assets/bot/connect whatsapp.mp4"
import connectWhatsappPosterUrl from "../../assets/bot/connect whatsapp.jpg"

function BotHelpPage() {
  return (
    <>
      <Grid container spacing={2} paddingX={1}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <video width="320" height="240" controls poster={connectWhatsappPosterUrl}>
            <source src={connectWhatsappUrl} type="video/mp4" />
          </video>
        </Grid>
      </Grid>
    </>
  )
}

export default BotHelpPage