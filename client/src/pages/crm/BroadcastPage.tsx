import { Button, LinearProgress, Paper, Stack, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { ChoiceContext, LeadChoiceActions } from "../../contexts/dialogContext"
import { BackendError } from "../.."
import { AxiosResponse } from "axios"
import { useQuery } from "react-query"
import { IBroadcast } from "../../types/crm.types"
import { GetBroadcast } from "../../services/LeadsServices"
import CreateBroadcastDialog from "../../components/dialogs/crm/CreateBroadcastDialog"
import UpdateBroadcastDialog from "../../components/dialogs/crm/UpdateBroadcastDialog"
import StartBroadcastDialog from "../../components/dialogs/crm/StartBroadcastDialog"
import StopBroadcastDialog from "../../components/dialogs/crm/StopBroadcastDialog.tsx"

function BroadcastPage() {
  const [broadcast, setBroadcast] = useState<IBroadcast>()
  const { setChoice } = useContext(ChoiceContext)
  const { data, isLoading } = useQuery<AxiosResponse<IBroadcast>, BackendError>("broadcast", async () => GetBroadcast())

  useEffect(() => {
    setBroadcast(data?.data)
  }, [data])
  return (
    <>
      {isLoading && <LinearProgress />}


      {broadcast &&
        <Stack>

          <Paper elevation={8} sx={{ p: 2, wordSpacing: 2, m: 2, boxShadow: 3, backgroundColor: 'white', borderRadius: 2 }}>
            <Stack
              direction="column"
              gap={1}
            >
              <Typography variant="h4" sx={{ textAlign: 'center', textTransform: 'uppercase', fontSize: 18, p: 2, fontWeight: 'bold', textDecoration: 'underline' }}>
                Daily Leads Broadcast
              </Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 14 }}>
                Broadcast Name : {broadcast.name}
              </Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 14 }}>
                Daily Limit : {broadcast.daily_limit}
              </Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 14 }}>
                Auto Refresh : {broadcast.autoRefresh ? "Yes" : "Not"}
              </Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 14 }}>
                Time Gap: {`${broadcast.time_gap} seconds `}
              </Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 14 }}>
                Next run date: {new Date(broadcast.next_run_date).toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 14 }}>
                Random Template : {broadcast.is_random_template ? "Yes" : "Not"}
              </Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 14 }}>
                Created By : {broadcast.created_by.username}
              </Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 14 }}>
                Status :  {broadcast.is_active ?
                  <>
                    {broadcast.is_paused ? "Paused"
                      : "Live"} </> :
                  "stopped"
                }
              </Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 14 }}>
                Counter : {broadcast.counter}
              </Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 14 }}>
                Connected Users : {broadcast.connected_users.map((u) => {
                  if (u.connected_number)
                    return `${u.username}:${String(u.connected_number).split(":")[0].replace("91", "")}`
                }).toString()}
              </Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 14 }}>
                Connected templates : {broadcast.templates.length}
              </Typography>

            </Stack>
            <Stack flexDirection="row" gap={2}>
              <Button fullWidth disabled={broadcast.is_active} variant="contained" color="error" onClick={() => {
                setChoice({ type: LeadChoiceActions.update_broadcast })
              }} sx={{ p: 2, my: 2, fontWeight: 'bold', fontSize: 12 }}>Edit</Button>
              {!broadcast.is_paused && broadcast.is_active ?
                <Button fullWidth variant="outlined" color="error" onClick={() => {
                  setChoice({ type: LeadChoiceActions.stop_broadcast })
                }} sx={{ p: 2, my: 2, fontWeight: 'bold', fontSize: 12 }}>Stop</Button>
                :
                <Button fullWidth variant="contained" color="success" onClick={() => {
                  setChoice({ type: LeadChoiceActions.start_broadcast })
                }} sx={{ p: 2, my: 2, fontWeight: 'bold', fontSize: 12 }}>Start</Button>
              }
            </Stack>
            {broadcast.is_paused && <Typography>Paused</Typography>}
          </Paper>
          <UpdateBroadcastDialog broadcast={broadcast} />
          <StartBroadcastDialog broadcast={broadcast} />
          <StopBroadcastDialog broadcast={broadcast} />
        </Stack >
      }
      {!broadcast &&
        <>
          <Stack sx={{ justifyContent: 'center', position: 'absolute', bottom: 10, width: '100vw' }}>
            < Button variant="contained" disabled={isLoading} size="large" sx={{ my: 2, mx: 1, fontWeight: 'bold', fontSize: 14 }} color="info"
              onClick={() => {
                setChoice({ type: LeadChoiceActions.create_broadcast })
              }}
            >Create New Broadcast</Button>
          </Stack >
          {!broadcast && <CreateBroadcastDialog />}
        </>
      }
    </>

  )
}

export default BroadcastPage