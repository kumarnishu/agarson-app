import { useEffect, useState } from 'react'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { GetReminderRemarks } from '../../services/LeadsServices'
import { BackendError } from '../..'
import { Box, DialogTitle, LinearProgress, Stack, Typography } from '@mui/material'

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
      <DialogTitle sx={{ textAlign: 'center' }}>Last 3 Days Reminders - [{remarks && remarks.length}]</DialogTitle>

      <Stack direction={"column"}>
        <Box>
          <Typography component="h1" variant="h6" sx={{ fontWeight: 'bold', textAlign: "center", borderRadius: 1 }}>
          </Typography>
          <RemindersTable remark={remark} remarks={remarks} setRemark={setRemark} />
        </Box >

      </Stack >
    </Box >
  )
}

export default CrmReminderPage