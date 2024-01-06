import { Search } from '@mui/icons-material'
import { Fade, FormControlLabel, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, Switch, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { headColor } from '../../utils/colors'
import FuzzySearch from "fuzzy-search";
import { BackendError } from '../..'
import RemindersTable from '../../components/tables/ReminderTable'
import { ReminderChoiceActions, ChoiceContext } from '../../contexts/dialogContext'
import ExportToExcel from '../../utils/ExportToExcel'
import NewReminderDialog from '../../components/dialogs/reminders/NewReminderDialog'
import NewReminderMessageDialog from '../../components/dialogs/reminders/NewReminderMessageDialog'
import { Menu as MenuIcon } from '@mui/icons-material';
import AlertBar from '../../components/snacks/AlertBar'
import { GetReminders } from '../../services/ReminderServices'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { UserContext } from '../../contexts/userContext'
import { IReminder } from '../../types/reminder.types'
import { IContactReport } from '../../types/contact.types'

type SelectedData = {
  name?: string,
  type?: string,
  status?: string,
  start_time: Date,
  updated_at: Date,
  created_by: string

}

export default function ReminderPage() {
  const [hidden, setHidden] = useState(false)
  const { data, isSuccess, isLoading, refetch } = useQuery<AxiosResponse<{
    reminder: IReminder,
    contacts: IContactReport[]
  }[]>, BackendError>(["reminders", hidden], async () => GetReminders(String(hidden)))
  const [reminder, setReminder] = useState<{
    reminder: IReminder,
    contacts: IContactReport[]
  }>()
  const [reminders, setReminders] = useState<{
    reminder: IReminder,
    contacts: IContactReport[]
  }[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => reminders, [reminders])
  const [preFilteredData, setPreFilteredData] = useState<{
    reminder: IReminder,
    contacts: IContactReport[]
  }[]>([])
  const [selectedReminders, setSelectedReminders] = useState<{
    reminder: IReminder,
    contacts: IContactReport[]
  }[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<SelectedData[]>([])
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { user } = useContext(UserContext)

  function handleExcel() {
    setAnchorEl(null)
    try {
      if (selectedData.length === 0)
        return alert("please select some rows")
      ExportToExcel(selectedData, "reminder_data")
      setSent(true)
      setSelectAll(false)
      setSelectedData([])
      setSelectedReminders([])
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
        name: reminder.reminder.name,
        type: reminder.reminder.message ? "custom" : "template",
        status: reminder.reminder.is_active ? "active" : "disabled",
        start_time: new Date(reminder.reminder.created_at),
        updated_at: new Date(reminder.reminder.updated_at),
        created_by: reminder.reminder.created_by && reminder.reminder.created_by.username
      })
    })
    setSelectedData(data)
  }, [selectedReminders])

  useEffect(() => {
    if (isSuccess) {
      setReminders(data.data)
      setPreFilteredData(data.data)
    }
  }, [isSuccess, reminders, data])


  useEffect(() => {
    if (filter) {
      if (reminders) {
        const searcher = new FuzzySearch(reminders, ["reminder.name", "contacts.contact.mobile", "contacts.contact.name", "contact.designation", "reminder.type", "reminder.is_active", "reminder.created_by", "reminder.is_random__template", "reminder.auto_refresh", "reminder.connected_number", "reminder.daily_limit", ""], {
          caseSensitive: false,
        });
        const result = searcher.search(filter);
        setReminders(result)
      }
    }
    if (!filter)
      setReminders(preFilteredData)

  }, [filter, reminders])


  useEffect(() => {
    refetch()
  }, [hidden])

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
          Reminders
        </Typography>

        <Stack
          direction="row"
        >
          <FormControlLabel control={<Switch
            defaultChecked={Boolean(hidden)}
            onChange={() => setHidden(!hidden)}
          />} label="Show hidden" />

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


            <IconButton size="small" color="primary"
              onClick={(e) => setAnchorEl(e.currentTarget)
              }
              sx={{ border: 2, borderRadius: 3, marginLeft: 1 }}
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
              {user?.reminders_access_fields.is_editable && <MenuItem onClick={() => {
                setChoice({ type: ReminderChoiceActions.create_reminder })
                setAnchorEl(null)
              }}
              >New Template Reminder</MenuItem>}
              {user?.reminders_access_fields.is_editable && <MenuItem onClick={() => {
                setChoice({ type: ReminderChoiceActions.create_message_reminder })
                setAnchorEl(null)
              }}
              >New Custom Reminder</MenuItem>}
              <MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>

            </Menu>
            <NewReminderDialog />
            <NewReminderMessageDialog />
          </>
        </Stack>
      </Stack>
      {/*  table */}
      {isLoading && <TableSkeleton />}
      {!isLoading &&
        <RemindersTable
          reminder={reminder}
          selectAll={selectAll}
          selectedReminders={selectedReminders}
          setSelectedReminders={setSelectedReminders}
          setSelectAll={setSelectAll}
          reminders={MemoData}
          setReminder={setReminder}
        />}

    </>

  )

}

