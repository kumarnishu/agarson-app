import { Button, LinearProgress, Paper, Stack, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { AxiosResponse } from "axios"
import { BackendError } from "../.."
import { getMyTodayVisit } from "../../services/VisitServices"
import { IVisit, IVisitReport } from "../../types/visit.types"
import StartMydayDialog from "../../components/dialogs/visit/StartMydayDialog"
import { ChoiceContext, VisitChoiceActions } from "../../contexts/dialogContext"
import EndMydayDialog from "../../components/dialogs/visit/EndMyDayDialog"
import MakeVisitInDialog from "../../components/dialogs/visit/MakeVisitInDialog"
import MakeVisitOutDialog from "../../components/dialogs/visit/MakeVisitOutDialog"

function MyVisitPage() {
  const [visits, setVisits] = useState<IVisitReport[]>([])
  const [visit, setVisit] = useState<IVisit>()
  const { setChoice } = useContext(ChoiceContext)
  const { data, isLoading, isSuccess } = useQuery<AxiosResponse<IVisit>, BackendError>("visit", getMyTodayVisit)

  useEffect(() => {
    if (data && data.data) {
      setVisit(data.data)
      setVisits(data.data.visit_reports)
    }
    else {
      setVisit(undefined)
      setVisits([])
    }

  }, [isSuccess, data])
  return (
    <>
      {isLoading && <LinearProgress />}


      {visit && visit.start_day_credientials && <Stack p={2} direction={'row'} gap={2} alignItems={'center'}>
        <Typography variant="subtitle1">Started day at  <b>{new Date(visit?.start_day_credientials.timestamp).toLocaleTimeString()}</b></Typography>
        {!Boolean(visit.end_day_credentials) && < Button size="small" variant="outlined" onClick={() => {
          setChoice({ type: VisitChoiceActions.visit_in })
        }}>New Visit</Button>}
      </Stack >}

      <>
        {visits.map((visit, index) => {
          return (
            <Stack key={index}
              direction="column"
              p={2}
              gap={2}
            >
              <Paper elevation={8} sx={{ p: 2, mt: 1, boxShadow: 2, backgroundColor: 'white' }}>
                <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                  Party : <b>{visit.party_name}</b>
                </Typography>
                <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                  Station:<b>{visit.city}</b>
                </Typography>
                <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                  Visit In : {new Date(visit.visit_in_credientials && visit.visit_in_credientials.timestamp).toLocaleTimeString()}
                </Typography>
                <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                  Visit Out : {new Date(visit.visit_out_credentials && visit.visit_out_credentials.timestamp).toLocaleTimeString()}
                </Typography>
                {visit && !Boolean(visit.visit_out_credentials) && <Button sx={{ fontWeight: 'bold', p: 0, mt: 2 }} color="error" onClick={() => setChoice({ type: VisitChoiceActions.visit_out })}>Visit Out</Button>}
              </Paper>
              {visit && !Boolean(visit.visit_out_credentials) && <MakeVisitOutDialog visit={visit} />}
            </Stack>
          )
        })}
      </>

      {visit && <MakeVisitInDialog visit={visit} />}


      {
        !visit && < Button size="large" color="success" sx={{ position: 'relative', bottom: 0, my: 2 }} variant="outlined"
          disabled={isLoading}
          fullWidth onClick={
            () => {
              setChoice({ type: VisitChoiceActions.start_day })
            }
          }>Start My Day</Button >
      }
      {!visit && <StartMydayDialog />}

      {
        visit  && < Button size="large" color="error" sx={{ position: 'relative', bottom: 0, my: 2 }} variant="outlined"
          disabled={isLoading || Boolean(visit.end_day_credentials) || visit.visit_reports.filter((report) => {
            if (!Boolean(report.visit_out_credentials))
              return report
          }).length > 0}
          fullWidth onClick={
            () => {
              setChoice({ type: VisitChoiceActions.end_day })
            }
          }>{Boolean(visit.end_day_credentials) ? `Day ended at ${new Date(visit.end_day_credentials.timestamp).toLocaleTimeString()}` : "End My Day"}</Button >
      }
      {visit && <EndMydayDialog visit={visit} />}
    </>
  )
}

export default MyVisitPage