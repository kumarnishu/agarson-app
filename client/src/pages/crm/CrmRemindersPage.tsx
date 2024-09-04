import { useEffect, useState } from 'react'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { GetReminderRemarks } from '../../services/LeadsServices'
import { BackendError } from '../..'
import { Box, DialogTitle, LinearProgress, Paper, Stack, Typography } from '@mui/material'

import RemindersTable from '../../components/tables/crm/RemindersTable'
import { GetActivitiesOrRemindersDto } from '../../dtos/crm/crm.dto'

function CrmReminderPage() {
  const [remarks, setRemarks] = useState<GetActivitiesOrRemindersDto[]>([])
  const [remark, setRemark] = useState<GetActivitiesOrRemindersDto>()
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<GetActivitiesOrRemindersDto[]>, BackendError>("reminders", GetReminderRemarks)

  let previous_date = new Date()
  let day = previous_date.getDate() - 1
  previous_date.setDate(day)


  useEffect(() => {
    if (isSuccess)
      setRemarks(data?.data)
  }, [remarks, isSuccess, data])

  return (
    <Box>
      {
        isLoading && <LinearProgress />
      }
      <DialogTitle sx={{ textAlign: 'center' }}>Last 3 Days Reminders -{remarks && remarks.length}</DialogTitle>

      <Stack direction={"column"}>
        <Box>
          <Typography component="h1" variant="h6" sx={{ fontWeight: 'bold', textAlign: "center", borderRadius: 1 }}>
          </Typography>
          {!isLoading &&
            window.screen.width < 500 ?
            <Box>
              <Typography component="h1" variant="h6" sx={{ fontWeight: 'bold', textAlign: "center", borderRadius: 1 }}>
              </Typography>
              {remarks && remarks.map((remark, index) => {
                return (
                  <Stack key={index}
                    direction="column"
                  >
                    <Paper elevation={8} sx={{ p: 2, mt: 1, boxShadow: 2, backgroundColor: 'whitesmoke' }}>
                      <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                        {remark.created_by.label} : <b>{remark.remark}</b>
                      </Typography>
                      <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                        Lead : <b>{remark.name}</b>
                      </Typography>
                      <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                        Lead Phone : <b>{remark.mobile}</b>
                      </Typography>
                      <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                        Lead Address : <b>{remark.address}</b>
                      </Typography>
                      <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                        Lead Stage : <b>{remark.stage}</b>
                      </Typography>
                      <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                        City : <b>{remark.city}</b>
                      </Typography>
                      <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                        State : <b>{remark.state}</b>
                      </Typography>
                      <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                        Refer Party : <b>{remark.referred_party_name}</b>
                      </Typography>
                      <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                        Refer Date : <b>{remark.referred_date}</b>
                      </Typography>
                      <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                        Refer Party Phone : <b>{remark.referred_party_mobile}</b>
                      </Typography>


                      <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                        Timestamp : {new Date(remark.created_at).toLocaleString()}
                      </Typography>


                    </Paper>
                  </Stack>
                )
              })}
            </Box > :
            <RemindersTable remark={remark} remarks={remarks} setRemark={setRemark} />
          }
        </Box >

      </Stack >
    </Box >
  )
}

export default CrmReminderPage