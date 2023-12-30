import { Stack, Typography } from "@mui/material"



function UsersHelpPage() {
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

export default UsersHelpPage