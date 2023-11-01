import { Grid } from "@mui/material"
import newTemplateUrl from "../../assets/templates/new template.mp4"
import newTemplatePosterUrl from "../../assets/templates/new template.jpg"
import templateActionsUrl from "../../assets/templates/Template actions.mp4"
import templateActionsPosterUrl from "../../assets/templates/template actions.jpg"

function TemplatesHelpPage() {
  return (
    <Grid container spacing={2} paddingX={1}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <video width="320" height="240" controls poster={newTemplatePosterUrl}>
          <source src={newTemplateUrl} type="video/mp4" />
        </video>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <video width="320" height="240" controls poster={templateActionsPosterUrl}>
          <source src={templateActionsUrl} type="video/mp4" />
        </video>
      </Grid>
    </Grid>
  )
}

export default TemplatesHelpPage