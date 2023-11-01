import { Grid } from "@mui/material"
import newUserUrl from "../../assets/user/new user.mp4"
import newUserPosterUrl from "../../assets/user/new user.jpg"
import updateUserUrl from "../../assets/user/update user .mp4"
import updateUserPosterUrl from "../../assets/user/update user.jpg"
import accessControlUrl from "../../assets/user/access control for user.mp4"
import accessControlPosterUrl from "../../assets/user/access control.jpg"
import updatePasswordUrl from "../../assets/user/update password for users.mp4"
import updatePasswordPosterUrl from "../../assets/user/update password.jpg"
import makeAdminUrl from "../../assets/user/manage admin role.mp4"
import makeAdminPosterUrl from "../../assets/user/make admin.jpg"
import blockUserUrl from "../../assets/user/block and unblock user.mp4"
import blockUserPosterUrl from "../../assets/user/block user.jpg"

function UsersHelpPage() {
  return (
    <Grid container spacing={2} paddingX={1}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <video width="320" height="240" controls poster={newUserPosterUrl}>
          <source src={newUserUrl} type="video/mp4" />
        </video>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <video width="320" height="240" controls poster={updateUserPosterUrl}>
          <source src={updateUserUrl} type="video/mp4" />
        </video>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <video width="320" height="240" controls poster={accessControlPosterUrl}>
          <source src={accessControlUrl} type="video/mp4" />
        </video>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <video width="320" height="240" controls poster={updatePasswordPosterUrl}>
          <source src={updatePasswordUrl} type="video/mp4" />
        </video>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <video width="320" height="240" controls poster={makeAdminPosterUrl}>
          <source src={makeAdminUrl} type="video/mp4" />
        </video>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <video width="320" height="240" controls poster={blockUserPosterUrl}>
          <source src={blockUserUrl} type="video/mp4" />
        </video>
      </Grid>
    </Grid>
  )
}

export default UsersHelpPage