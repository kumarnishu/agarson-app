import { Grid } from "@mui/material"
import newContactUrl from "../../assets/contacts/new contact.mp4"
import newContactPosterUrl from "../../assets/contacts/new contact.jpg"
import editDeleteUrl from "../../assets/contacts/edit delete contact.mp4"
import editDeletePosterUrl from "../../assets/contacts/edit delete.jpg"
import bulkUploadUrl from "../../assets/contacts/bulk upload.mp4"
import bulkUploadPosterUrl from "../../assets/contacts/bulk upload.jpg"


function ContactsHelpPage() {
  return (
    <Grid container spacing={2} paddingX={1}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <video width="320" height="240" controls poster={newContactPosterUrl}>
          <source src={newContactUrl} type="video/mp4" />
        </video>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <video width="320" height="240" controls poster={editDeletePosterUrl}>
          <source src={editDeleteUrl} type="video/mp4" />
        </video>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <video width="320" height="240" controls poster={bulkUploadPosterUrl}>
          <source src={bulkUploadUrl} type="video/mp4" />
        </video>
      </Grid>
    </Grid>
  )
}

export default ContactsHelpPage