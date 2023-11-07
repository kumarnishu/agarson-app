import { Box, FormControlLabel, Grid, Radio, Stack, Typography } from "@mui/material"
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
import { useState } from "react"


function HelpGuide() {
  return (
    <Stack direction={'column'} gap={2} padding={2}>
      <Stack>
        <Typography variant='subtitle2' fontSize={17}>1. Users.</Typography>
        <Typography variant='subtitle1'>1. Creating, updating a user</Typography>
        <Typography variant='subtitle1'>2.Users are not allowed to delete we can update only</Typography>
        <Typography variant='subtitle1'>3. Removing and adding admin role to a user</Typography>
        <Typography variant='subtitle1'>4. Block and Unblock a user, blocking stops a user to login into app</Typography>
        <Typography variant='subtitle1'>5.Change user password by a button</Typography>
        <Typography variant='subtitle1'>6. Manage Basic Access of indivitual user for every feature like edit,delete and hide by checkboxes</Typography>
        <Typography variant='subtitle1'>7.Export users into excel file</Typography>
        <Typography variant='subtitle1'>8. Verify email of a user</Typography>
        <Typography variant='subtitle1'>9. We can login via email after verifying email id</Typography>
        <Typography variant='subtitle1'>10.Search users with comma seperated words</Typography>
        <Typography variant='subtitle1'>11. When a users leaves the job, we can change its username and all its resources are assigned to that new  user automatically</Typography>
        <Typography variant='subtitle1'>12. Only owner is allowed to reset password after forgot via email</Typography>
        <Typography variant='subtitle1'>13. Any logged in user can update its password</Typography>
      </Stack>
    </Stack>
  )
}


function UsersHelpPage() {
  const [displayGuide, setDisplay] = useState(true)
  return (
    <Box sx={{ p: 2 }}>
      <FormControlLabel value="female" control={<Radio checked={Boolean(displayGuide)} onChange={() => setDisplay(true)} />} label="Guide" />
      <FormControlLabel value="male" control={<Radio checked={Boolean(!displayGuide)} onChange={() => setDisplay(false)} />} label="Videos" />
      {!displayGuide ?
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
        : <HelpGuide />}
    </Box>
  )
}

export default UsersHelpPage