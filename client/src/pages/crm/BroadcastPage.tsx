import { Button, LinearProgress, Paper, Stack, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { ChoiceContext, LeadChoiceActions } from "../../contexts/dialogContext"
import { BackendError } from "../.."
import { AxiosResponse } from "axios"
import { useQuery } from "react-query"
import { IBroadcast } from "../../types/crm.types"
import { GetBroadcast } from "../../services/LeadsServices"

function BroadcastPage() {
  const [broadcast, setBroadcast] = useState<IBroadcast>()
  const { setChoice } = useContext(ChoiceContext)
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IBroadcast>, BackendError>("broadcast", async () => GetBroadcast())

  useEffect(() => {
    setBroadcast(data?.data)
  }, [isSuccess])

  return (
    <>
      {isLoading && <LinearProgress />}
      {!broadcast ?
        <Stack sx={{ justifyContent: 'center', position: 'absolute', bottom: 10, width: '100vw' }}>
          < Button variant="contained" disabled={isLoading} size="large" sx={{ py: 2, mx: 2, fontWeight: 'bold', fontSize: 14 }} color="info"
            onClick={() => { setChoice({ type: LeadChoiceActions.create_broadcast }) }}
          >Create Daily Broadcast</Button>
        </Stack >
        :
        <Stack>
          <Paper elevation={8} sx={{ p: 2, wordSpacing: 2, m: 2, boxShadow: 3, backgroundColor: 'white', borderRadius: 2 }}>
            <Stack
              direction="column"
              gap={1}
            >
              <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 14 }}>
                Broadcast Name : {broadcast.name}
              </Typography>


            </Stack>
          </Paper>
        </Stack >
      }
    </>

  )
}

export default BroadcastPage