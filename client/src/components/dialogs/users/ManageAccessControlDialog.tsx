import { useContext } from "react"
import { ChoiceContext, UserChoiceActions } from "../../../contexts/dialogContext"
import { Avatar, Dialog,  IconButton, Stack, Typography } from "@mui/material"
import { IUser } from "../../../types/user.types"

import AccessControlForm from "../../forms/user/AccessControlForm"
import { Cancel } from "@mui/icons-material"

function ManageAccessControlDialog({ user }: { user: IUser }) {
  const { choice, setChoice } = useContext(ChoiceContext)
  return (
    <>
      <Dialog fullScreen open={choice === UserChoiceActions.control_access ? true : false}
        onClose={() => setChoice({ type: UserChoiceActions.close_user })}
      >

        <IconButton style={{ display: 'inline-block', position: 'absolute', right: '10px' }} color="error" onClick={() => setChoice({ type: UserChoiceActions.close_user })}>
          <Cancel fontSize='large' />
        </IconButton>

          <Stack gap={1} alignItems="center" direction="row" p={2}>
            <Avatar sx={{ height: "30px", width: '30px' }}
              alt="display picture" src={user.dp?.public_url} />
            <Typography variant="h6">
              Access Control Page <Typography variant="button" fontWeight={'bold'} color="blue">
                [{user.username}]
              </Typography>
            </Typography>
          </Stack >
        {
          user &&
          <AccessControlForm user={user} />
        }

      </Dialog >
    </>
  )
}

export default ManageAccessControlDialog
