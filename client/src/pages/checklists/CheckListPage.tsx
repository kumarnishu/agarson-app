import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { GetMyCheckLists } from '../../services/CheckListServices'
import { BackendError } from '../..'
import { IChecklist } from '../../types/checklist.types'
import { Box, IconButton, TextField, Typography } from '@mui/material'
import moment from 'moment'
import { AdsClickOutlined } from '@mui/icons-material'
import CheckMyCheckListDialog from '../../components/dialogs/checklists/CheckMyCheckListDialog'
import { CheckListChoiceActions, ChoiceContext } from '../../contexts/dialogContext'


export default function CheckListPage() {
  const [localchecklist, setCheckList] = useState<IChecklist>()
  const [checklists, setCheckLists] = useState<IChecklist[]>([])
  const [dates, setDates] = useState<{ start_date?: string, end_date?: string }>({
    start_date: moment(new Date().setDate(1)).format("YYYY-MM-DD")
    , end_date: moment(new Date().setDate(30)).format("YYYY-MM-DD")
  })
  const { setChoice } = useContext(ChoiceContext)

  const { data, isSuccess } = useQuery<AxiosResponse<IChecklist[]>, BackendError>(["self_checklists", dates?.start_date, dates?.end_date], async () => GetMyCheckLists({ start_date: dates?.start_date, end_date: dates?.end_date }))

  useEffect(() => {
    if (isSuccess) {
      setCheckLists(data.data)
    }
  }, [isSuccess, data])

  return (
    <Box >
      <Stack direction='row' gap={2} alignItems={'center'} justifyContent={'center'} sx={{ mb: 1, p: 2 }}>
        < TextField
          size='small'
          variant='filled'
          type="date"
          id="start_date"
          label="Start Date"
          fullWidth
          value={dates.start_date}
          focused
          onChange={(e) => setDates({
            ...dates,
            start_date: moment(e.target.value).format("YYYY-MM-DD")
          })}
        />
        < TextField
          size='small'
          variant='filled'
          type="date"
          id="end_date"
          label="End Date"
          focused
          value={dates.end_date}
          fullWidth
          onChange={(e) => setDates({
            ...dates,
            end_date: moment(e.target.value).format("YYYY-MM-DD")
          })}
        />
      </Stack>
      {checklists.map((checklist, index) => {
        return (
          <Stack direction={'row'} key={index} sx={{ m: 1, backgroundColor: 'whitesmoke', borderRadius: 5 }} alignItems={'center'} gap={2}>
            <IconButton
              sx={{ p: 2 }}
              onClick={() => {
                setCheckList(checklist)
                setChoice({ type: CheckListChoiceActions.check_my_boxes })
              }}
            ><AdsClickOutlined color="primary" />
            </IconButton>
            <Typography sx={{ maxWidth: 500, cursor: 'pointer', textTransform: 'capitalize' }} variant='body1'
              onClick={() => {
                let win = window.open(checklist.sheet_url, 'blank');
                win?.focus();
              }}
            >
              {checklist.title}</Typography>
            <Typography>
              <b style={{ color: 'orange' }}>
                Score  {" "}
                {checklist.boxes.filter((box) => {
                  return box.desired_date && box.actual_date && new Date(box.desired_date) <= new Date()

                }).length - checklist.boxes.filter((box) => {
                  return box.desired_date && new Date(box.desired_date) <= new Date()
                }).length +
                  checklist.boxes.filter((box) => {
                    return box.desired_date && box.actual_date && new Date(box.desired_date) <= new Date() && Boolean(new Date(box.desired_date).getDate() === new Date(box.actual_date).getDate() && new Date(box.desired_date).getMonth() === new Date(box.actual_date).getMonth() && new Date(box.desired_date).getFullYear() === new Date(box.actual_date).getFullYear())
                  }).length
                }
              </b>
            </Typography>
          </Stack>
        )
      })}
      {localchecklist && <CheckMyCheckListDialog checklist={localchecklist} dates={dates} />}
    </Box>
  )
}

