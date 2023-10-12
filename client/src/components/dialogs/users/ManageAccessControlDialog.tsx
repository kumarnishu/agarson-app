import { useContext } from "react"
import { ChoiceContext, UserChoiceActions } from "../../../contexts/dialogContext"
import { Avatar, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material"
import { IUser } from "../../../types"
import BotControlAccessForm from "../../forms/user/BotControlAccessForm"
import { Cancel } from "@mui/icons-material"
import BroadcastControlAccessForm from "../../forms/user/BroadcastControlAccessForm"
import GlobalControlAccessForm from "../../forms/user/GlobalControlAccessForm"
import ContactControlAccessForm from "../../forms/user/ContactControlAccessForm"
import ReminderControlAccessForm from "../../forms/user/ReminderControlAccessForm"
import CrmControlAccessForm from "../../forms/user/CrmControlAccessForm"
import TemplateControlAccessForm from "../../forms/user/TemplateControlAccessForm"

function ManageAccessControlDialog({ user }: { user: IUser }) {
  const { choice, setChoice } = useContext(ChoiceContext)

  return (
    <>
      <Dialog fullScreen open={choice === UserChoiceActions.control_access ? true : false}
        onClose={() => setChoice({ type: UserChoiceActions.close_user })}
      >

        <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: UserChoiceActions.close_user })}>
          <Cancel fontSize='large' />
        </IconButton>

        <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
          <Stack direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Stack gap={1} alignItems="center" direction="row">

              <Avatar
                alt="display picture" src={user.dp?.public_url} />
              <Typography variant="button">
                Access Control Page <u><b>{user.username}</b></u>
              </Typography>
            </Stack >

          </Stack>
        </DialogTitle>
        <DialogContent>
          {user && <GlobalControlAccessForm user={user} />}
          <Stack direction="row" gap={2}>
            {
              user ?
                <>
                  <CrmControlAccessForm user={user} />
                  <BotControlAccessForm user={user} />
                  <BroadcastControlAccessForm user={user} />
                  <ContactControlAccessForm user={user} />
                  <ReminderControlAccessForm user={user} />
                  <TemplateControlAccessForm user={user} />
                </>
                : null
            }
          </Stack>
        </DialogContent>

      </Dialog >
    </>
  )
}

export default ManageAccessControlDialog
