import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { GetMyCheckLists, ToogleMyCheckLists } from '../../services/CheckListServices'
import { BackendError } from '../..'
import { IChecklist } from '../../types/checklist.types'
import { Box, Checkbox, IconButton, TextField, Tooltip, Typography } from '@mui/material'
import { queryClient } from '../../main'
import moment from 'moment'
import { Save } from '@mui/icons-material'


export default function CheckListPage() {
  const [localchecklist, setCheckList] = useState<{
    checklist: IChecklist,
    desired_date: Date,
    actual_date?: Date
  }>()
  const [checklists, setCheckLists] = useState<IChecklist[]>([])
  const [dates, setDates] = useState<{ start_date?: string, end_date?: string }>({
    start_date: moment(new Date().setDate(1)).format("YYYY-MM-DD")
    , end_date: moment(new Date().setDate(30)).format("YYYY-MM-DD")
  })

  const { data, isSuccess } = useQuery<AxiosResponse<IChecklist[]>, BackendError>(["self_checklists", dates?.start_date, dates?.end_date], async () => GetMyCheckLists({ start_date: dates?.start_date, end_date: dates?.end_date }))



  const { mutate, isLoading } = useMutation
    <AxiosResponse<string>, BackendError, {
      id: string,
      date: string
    }>
    (ToogleMyCheckLists, {
      onSuccess: () => {
        queryClient.invalidateQueries('self_checklists')
      }
    })

  useEffect(() => {
    if (isSuccess) {
      setCheckLists(data.data)
    }
  }, [isSuccess, data])

  return (
    <Box sx={{ pt: 2 }}>
      <Stack direction='row' gap={2} alignItems={'center'} justifyContent={'center'}>
        < TextField
          type="date"
          id="start_date"
          label="Start Date"
          fullWidth
          value={dates.start_date}
          focused
          onChange={(e) => setDates({
            ...dates,
            start_date: moment(e.target.value).format("YYYY-MM-DDThh:mm")
          })}
        />
        < TextField
          type="date"
          id="end_date"
          label="End Date"
          focused
          value={dates.end_date}
          fullWidth
          onChange={(e) => setDates({
            ...dates,
            end_date: moment(e.target.value).format("YYYY-MM-DDThh:mm")
          })}
        />
      </Stack>
      <Stack padding={2} gap={2} sx={{ overflow: 'scroll' }} >
        {checklists.map((checklist, index) => {
          return (
            <Stack key={index} direction={'row'} sx={{ borderBottom: 2 }} >
              <Typography sx={{ minWidth: 400 }} variant='button'><a href={checklist.sheet_url} target="blank">{checklist.title}</a></Typography>
              <IconButton
                onClick={() => {
                  if (localchecklist) {
                    mutate({ id: localchecklist.checklist._id, date: new Date(localchecklist.desired_date).toString() })
                    setCheckList(undefined)
                  }
                }}
              >{!isLoading && <Save color='primary' />}</IconButton>
              {
                checklist.boxes.map((box, index) => {
                  return (
                    <Tooltip key={index} title={new Date(box.desired_date).toDateString()}>
                      <Checkbox
                        disabled={Boolean(box.desired_date && box.actual_date) || Boolean(new Date(box.desired_date).getDay() === 0) || Boolean(new Date(box.desired_date) > new Date())}
                        onChange={() => {
                          setCheckList({
                            checklist: checklist,
                            desired_date: box.desired_date
                          })
                        }} defaultChecked={Boolean(box.desired_date && box.actual_date)} />
                    </Tooltip>
                  )
                })
              }
            </Stack >
          )
        })}
      </Stack>
    </Box>
  )
}

