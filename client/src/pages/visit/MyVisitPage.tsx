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
import AddSummaryInDialog from "../../components/dialogs/visit/AddSummaryDialog"
import EditSummaryInDialog from "../../components/dialogs/visit/EditSummaryDialog"
import background from "../../assets/visit_background.jpg"
import moment from "moment"
import UploadVisitSamplesDialog from "../../components/dialogs/visit/UploadVisitSamplesDialog"

function MyVisitPage() {
  const [visits, setVisits] = useState<IVisitReport[]>([])
  const [visitReport, setVisitReport] = useState<IVisitReport>()
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
      {visit && visit.start_day_credientials &&
        <>
          {/* start day */}
          <Typography variant="subtitle1" textAlign={'center'} sx={{ p: 1, textTransform: 'uppercase', color: 'blue', fontWeight: 'bold',fontSize:16 }}>Started Day At   {moment(new Date(visit.start_day_credientials && visit.start_day_credientials.timestamp)).format('LT')}</Typography>

          {/* new visit */}
          <Stack direction={'row'} px={2} alignItems={'center'} justifyContent={'center'}>
            {!Boolean(visit.end_day_credentials) && < Button
              fullWidth
              sx={{ p: 2 }}
              disabled={visit.visit_reports.filter((report) => {
                if (!Boolean(report.visit_out_credentials))
                  return report
              }).length > 0}
              variant="contained"
              size="large"
              onClick={() => {
                setChoice({ type: VisitChoiceActions.visit_in })
              }}>New Visit</Button>}
          </Stack >
        </>}

      <>
        {visits.map((visit, index) => {
          return (
            <Paper key={index} elevation={8} sx={{ p: 2, wordSpacing: 2, m: 2, boxShadow: 3, backgroundColor: 'white', borderRadius: 2 }}>
              <Stack
                direction="column"
                gap={2}
              >
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  Party : {visit.party_name}
                </Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  Station : {visit.city}
                </Typography>
                <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                  Visit In : {moment(new Date(visit.visit_in_credientials && visit.visit_in_credientials.timestamp)).format('LT')}
                </Typography>
                <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                  Visit Out : {moment(new Date(visit.visit_out_credentials && visit.visit_out_credentials.timestamp)).format('LT')}
                </Typography>
                <Stack gap={2} direction={'row'} >
                  {visit && !Boolean(visit.visit_out_credentials) && visit.visit_samples_photo && <Button sx={{ fontWeight: 'bold' }} color="error" onClick={() => {
                    setVisitReport(visit)
                    setChoice({ type: VisitChoiceActions.visit_out })
                  }}>Visit Out</Button>}
                  {visit && !Boolean(visit.visit_out_credentials) && !visit.visit_samples_photo && <Button sx={{ fontWeight: 'bold' }} color="secondary" onClick={() => {
                    setVisitReport(visit)
                    setChoice({ type: VisitChoiceActions.upload_samples })
                  }}>Upload Samples</Button>}
                  {!visit.summary ? <Button sx={{ fontWeight: 'bold' }} color="primary" onClick={() => { setVisitReport(visit); setChoice({ type: VisitChoiceActions.add_summary }) }}>Add Summary</Button> : <Button sx={{ fontWeight: 'bold' }} color="primary" onClick={() => { setVisitReport(visit); setChoice({ type: VisitChoiceActions.edit_summary }) }}>Edit Summary</Button>}
                </Stack>
              </Stack>
            </Paper>
          )
        })}
      </>
      {visitReport && <UploadVisitSamplesDialog visit={visitReport} />}
      {visitReport && !Boolean(visitReport.visit_out_credentials) && <MakeVisitOutDialog visit={visitReport} />}
      {visitReport && !visitReport.summary && <AddSummaryInDialog visit={visitReport} />}
      {visitReport && visitReport.summary && <EditSummaryInDialog visit={visitReport} />}
      {visit && <MakeVisitInDialog visit={visit} />}


      {
        !visit && <Stack sx={{ height: '100vh' }}>
          <img src={background} alt="background" style={{ objectFit: 'cover' }} />
          <Button size="large" sx={{ p: 3, fontSize: 20 }} color="error" variant="contained"
            disabled={isLoading}
            fullWidth
            onClick={
              () => {
                setChoice({ type: VisitChoiceActions.start_day })
              }
            }>Start My Day</Button >
        </Stack >
      }
      {!visit && <StartMydayDialog />}

      {
        visit && <Stack p={2}>
          < Button size="large" color="primary" sx={{ position: 'relative', bottom: 0, my: 2 }} variant="outlined"
            disabled={isLoading || Boolean(visit.end_day_credentials) || visit.visit_reports.filter((report) => {
              if (!Boolean(report.visit_out_credentials))
                return report
            }).length > 0}
            fullWidth onClick={
              () => {
                setChoice({ type: VisitChoiceActions.end_day })
              }
            }>{Boolean(visit.end_day_credentials) ? `Day ended at ${new Date(visit.end_day_credentials.timestamp).toLocaleTimeString()}` : "End My Day"}</Button >
        </Stack>
      }
      {visit && <EndMydayDialog visit={visit} />}
    </>
  )
}

export default MyVisitPage