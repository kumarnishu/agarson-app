import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React, { useEffect, useState } from 'react'
import RemindersReportsTable from '../../components/tables/RemindersReportsTable'
import { useQuery } from 'react-query'
import { AxiosResponse } from 'axios'
import DBPagination from '../../components/pagination/DBpagination'
import { Menu as MenuIcon } from '@mui/icons-material';
import FileSaver from 'file-saver'
import AlertBar from '../../components/snacks/AlertBar'
import { GetReminderPaginatedReports, GetReminderReportsByMobile } from '../../services/ReminderServices'
import { BackendError } from '../..'
import { IContactReport } from '../../types/contact.types'
import { IReminder } from '../../types/reminder.types'


export default function ReminderReportPage({ reminder }: { reminder: IReminder }) {
  const [paginationData, setPaginationData] = useState({ limit: 10, page: 1, total: 1 });
  const { data, isSuccess, isLoading, refetch } = useQuery<AxiosResponse<{ reports: IContactReport[], page: number, total: number, limit: number }>, BackendError>(["paginated_reports", paginationData], async () => GetReminderPaginatedReports({ id: reminder._id, limit: paginationData?.limit, page: paginationData?.page }))

  const { data: filteredReports, isSuccess: isSearchSuccess, refetch: Refetchsearch } = useQuery<AxiosResponse<IContactReport[]>, BackendError>(["search_reports", paginationData], async () => GetReminderReportsByMobile({ id: reminder._id, mobile: filter }), { enabled: false })

  const [filter, setFilter] = useState<string | undefined>()
  const [report, setReport] = useState<IContactReport>()
  const [reports, setReports] = useState<IContactReport[]>([])
  const MemoData = React.useMemo(() => reports, [reports])
  const [sent, setSent] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [filterCount, setFilterCount] = useState(0)
  function HandleExport() {
    if (reminder)
      FileSaver.saveAs(`/api/v1/download/reports/reminders?id=${reminder._id}`, "reminder_report.xlsx")
  }

  function handleExcel() {
    setAnchorEl(null)
    HandleExport()
    setSent(true)
  }
  useEffect(() => {
    if (isSuccess) {
      setReports(data.data.reports)
      setPaginationData({
        ...paginationData,
        page: data.data.page,
        limit: data.data.limit,
        total: data.data.total
      })
    }
  }, [isSuccess, data])

  useEffect(() => {
    setReport(report)
  }, [report])

  useEffect(() => {
    if (!filter) {
      refetch()
    }
  }, [filter])


  useEffect(() => {
    if (isSearchSuccess) {
      setReports(filteredReports.data)
    }
  }, [isSearchSuccess, filteredReports])
  console.log(filterCount)
  return (
    <>
      {isLoading && <LinearProgress />}
      {/*heading, search bar and table menu */}
      <Stack
        spacing={2}
        padding={1}
        direction="row"
        justifyContent="space-between"
        width="100vw"
      >
        <Typography
          variant={'h6'}
          component={'h1'}
          sx={{ pl: 1 }}
        >
          Reminder Reports
        </Typography>

        <Stack
          direction="row"
        >
          {/* search bar */}
          < Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              size="small"
              onChange={(e) => setFilter(e.currentTarget.value)}
              autoFocus
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  Refetchsearch()
                }
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">
                  <Search />
                </InputAdornment>,
              }}
              placeholder={`${MemoData?.length} records...`}
              style={{
                fontSize: '1.1rem',
                border: '0',
              }}
            />
            <IconButton
              sx={{ bgcolor: 'whitesmoke' }}
              onClick={() => {
                Refetchsearch()
              }}
            >
              <Search />
            </IconButton>
          </Stack >
          {/* menu */}
          <>

            {sent && <AlertBar message="File Exported Successfuly" color="success" />}

            <IconButton size="medium"
              onClick={(e) => setAnchorEl(e.currentTarget)
              }
              sx={{ border: 1, borderRadius: 2, marginLeft: 2 }}
            >
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)
              }
              TransitionComponent={Fade}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>

            </Menu>
          </>

        </Stack>
      </Stack>

      {/*  table */}
      <RemindersReportsTable
        setReport={setReport}
        report={report}
        reports={MemoData}
      />
      <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} setFilterCount={setFilterCount} />
    </>
  )

}

