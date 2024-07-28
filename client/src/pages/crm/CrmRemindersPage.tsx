import {  useEffect, useState } from 'react'
import { IRemark } from '../../types/crm.types'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { GetReminderRemarks } from '../../services/LeadsServices'
import { BackendError } from '../..'
import { Box,  DialogTitle,  LinearProgress, Paper, Stack, Typography } from '@mui/material'

import TableSkeleton from '../../components/skeleton/TableSkeleton'
import ActivitiesTable from '../../components/tables/crm/ActivitiesTable'

function CrmReminderPage() {
  const [remarks, setRemarks] = useState<IRemark[]>([])
  const [remark, setRemark] = useState<IRemark>()
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IRemark[]>, BackendError>("reminderremarks", GetReminderRemarks)

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
      <DialogTitle sx={{ textAlign: 'center' }}>Reminders - 7 Days</DialogTitle>
      {isLoading && <TableSkeleton />}
      {!isLoading &&
        <Stack direction={"column"}>
          <Box>
            <Typography component="h1" variant="h6" sx={{ fontWeight: 'bold', textAlign: "center", borderRadius: 1 }}>
            </Typography>
            {isLoading && <TableSkeleton />}
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
                          Lead : <b>{remark.lead && remark.lead.name}</b>
                        </Typography>
                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                          Lead Phone : <b>{remark.lead && remark.lead.mobile}</b>
                        </Typography>
                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                          Lead Address : <b>{remark.lead && remark.lead.address}</b>
                        </Typography>
                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                          Lead Stage : <b>{remark.lead && remark.lead.stage}</b>
                        </Typography>
                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                          City : <b>{remark.lead && remark.lead.city}</b>
                        </Typography>
                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                          State : <b>{remark.lead && remark.lead.state}</b>
                        </Typography>
                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                          Refer Party : <b>{remark.lead.referred_party_name && remark.lead.referred_party_name}</b>
                        </Typography>
                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                          Refer Party City : <b>{remark.lead.referred_party && remark.lead.referred_party && remark.lead.referred_party.city}</b>
                        </Typography>
                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                          Refer Date : <b>{remark.lead.referred_date && new Date(remark.lead.referred_date).toLocaleString()}</b>
                        </Typography>
                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                          Refer Party Phone : <b>{remark.lead.referred_party_mobile && remark.lead.referred_party_mobile}</b>
                        </Typography>
                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                          {remark.created_by.username} : <b>{remark.remark}</b>
                        </Typography>
                      
                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                          Timestamp : {new Date(remark.created_at).toLocaleString()}
                        </Typography>
                       
                      
                      </Paper>
                    </Stack>
                  )
                })}
              </Box > :
              <ActivitiesTable remark={remark} remarks={remarks} setRemark={setRemark} />
            }
          </Box >
          
        </Stack >}
    </Box >
  )
}

export default CrmReminderPage