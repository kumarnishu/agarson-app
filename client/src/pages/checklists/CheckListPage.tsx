import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { GetMyCheckLists } from '../../services/CheckListServices'
import { BackendError } from '../..'
import { IChecklist } from '../../types/checklist.types'
import { Box, LinearProgress, TextField } from '@mui/material'
import moment from 'moment'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import MyChecklistTable from '../../components/tables/MyCheckListTable'


export default function CheckListPage() {
  const [localchecklist, setCheckList] = useState<IChecklist>()
  const [checklists, setCheckLists] = useState<IChecklist[]>([])
  const [dates, setDates] = useState<{ start_date?: string, end_date?: string }>({
    start_date: moment(new Date().setDate(1)).format("YYYY-MM-DD")
    , end_date: moment(new Date().setDate(30)).format("YYYY-MM-DD")
  })

  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IChecklist[]>, BackendError>(["self_checklists", dates?.start_date, dates?.end_date], async () => GetMyCheckLists({ start_date: dates?.start_date, end_date: dates?.end_date }))

  useEffect(() => {
    if (isSuccess) {
      setCheckLists(data.data)
    }
  }, [isSuccess, data])

  return (
    <Box >
      {isLoading && <LinearProgress />}
      <Stack direction='row' gap={2} alignItems={'center'} justifyContent={'center'} sx={{ mb: 1, p: 2 }}>
        < TextField
          size='small'
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
      {isLoading ? <TableSkeleton /> : <MyChecklistTable checklist={localchecklist} setChecklist={setCheckList} dates={dates} checklists={checklists} />}
    </Box>)
}

