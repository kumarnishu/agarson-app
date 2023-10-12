import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { headColor } from '../../utils/colors'
import FuzzySearch from "fuzzy-search";
import { BackendError } from '../..'
import { IReminder } from '../../types'
import RemindersTable from '../../components/tables/ReminderTable'
import { ReminderChoiceActions, ChoiceContext } from '../../contexts/dialogContext'
import ExportToExcel from '../../utils/ExportToExcel'
import NewReminderDialog from '../../components/dialogs/reminders/NewReminderDialog'
import NewReminderMessageDialog from '../../components/dialogs/reminders/NewReminderMessageDialog'
import { Menu as MenuIcon } from '@mui/icons-material';
import ReactPagination from '../../components/pagination/ReactPagination'
import AlertBar from '../../components/snacks/AlertBar'
import { GetReminders } from '../../services/ReminderServices'

type SelectedData = {
  name?: string,
  type?: string,
  status?: string,
  start_time: Date,
  updated_at: Date,
  created_by: string

}

export default function ReminderPage() {
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IReminder[]>, BackendError>("reminders", GetReminders)
  const [reminder, setReminder] = useState<IReminder>()
  const [reminders, setReminders] = useState<IReminder[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => reminders, [reminders])
  const [preFilteredData, setPreFilteredData] = useState<IReminder[]>([])
  const [selectedReminders, setSelectedReminders] = useState<IReminder[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<SelectedData[]>([])
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  // pagination  states
  const [reactPaginationData, setReactPaginationData] = useState({ limit: 10, page: 1, total: 1 });
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + reactPaginationData.limit;
  const currentItems = MemoData.slice(itemOffset, endOffset)

  function handleExcel() {
    setAnchorEl(null)
    try {
      if (selectedData.length === 0)
        return alert("please select some rows")
      ExportToExcel(selectedData, "reminder_data")
      setSent(true)
    }
    catch (err) {
      console.log(err)
      setSent(false)
    }

  }

  // refine data
  useEffect(() => {
    let data: SelectedData[] = []
    selectedReminders.map((reminder) => {
      return data.push({
        name: reminder.name,
        type: reminder.message ? "custom" : "template",
        status: reminder.is_active ? "active" : "disabled",
        start_time: new Date(reminder.created_at),
        updated_at: new Date(reminder.updated_at),
        created_by: reminder.created_by && reminder.created_by.username
      })
    })
    setSelectedData(data)
  }, [selectedReminders])

  useEffect(() => {
    if (isSuccess) {
      setReminders(data.data)
      setPreFilteredData(data.data)
      setReactPaginationData({
        ...reactPaginationData,
        total: Math.ceil(data.data.length / reactPaginationData.limit)
      })
    }
  }, [isSuccess, reminders, data])

  useEffect(() => {
    setItemOffset(reactPaginationData.page * reactPaginationData.limit % reactPaginationData.total)
  }, [reactPaginationData])

  useEffect(() => {
    if (filter) {
      if (reminders) {
        const searcher = new FuzzySearch(reminders, ["name", "type", "is_active", "created_by", "is_random__template", "auto_refresh", "connected_number", "daily_limit", ""], {
          caseSensitive: false,
        });
        const result = searcher.search(filter);
        setReminders(result)
      }
    }
    if (!filter)
      setReminders(preFilteredData)

  }, [filter, reminders])
  return (
    <>
      {
        isLoading && <LinearProgress />
      }
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
          Reminder
        </Typography>

        <Stack
          direction="row"
        >
          {/* search bar */}
          < Stack direction="row" spacing={2} sx={{ bgcolor: headColor }
          }>
            <TextField
              fullWidth
              size="small"
              onChange={(e) => setFilter(e.currentTarget.value)}
              autoFocus
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
              <MenuItem onClick={() => {
                setChoice({ type: ReminderChoiceActions.create_reminder })
                setAnchorEl(null)
              }}
              >New Template Reminder</MenuItem>
              <MenuItem onClick={() => {
                setChoice({ type: ReminderChoiceActions.create_message_reminder })
                setAnchorEl(null)
              }}
              >New Custom Reminder</MenuItem>
              <MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>

            </Menu>
            <NewReminderDialog />
            <NewReminderMessageDialog />
          </>
        </Stack>
      </Stack>
      {/*  table */}
      <RemindersTable
        reminder={reminder}
        selectAll={selectAll}
        selectedReminders={selectedReminders}
        setSelectedReminders={setSelectedReminders}
        setSelectAll={setSelectAll}
        reminders={currentItems}
        setReminder={setReminder}
      />
      <ReactPagination reactPaginationData={reactPaginationData} setReactPaginationData={setReactPaginationData} data={MemoData}
      />
    </>

  )

}

