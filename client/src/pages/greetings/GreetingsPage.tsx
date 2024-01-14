import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import FuzzySearch from "fuzzy-search";
import { BackendError } from '../..'
import GreetingsTable from '../../components/tables/GreetingTable'
import { ChoiceContext, GreetingChoiceActions } from '../../contexts/dialogContext'
import ExportToExcel from '../../utils/ExportToExcel'
import { Menu as MenuIcon } from '@mui/icons-material';
import AlertBar from '../../components/snacks/AlertBar'
import { GetGreetings } from '../../services/GreetingServices'
import { IGreeting } from '../../types/greeting.types'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import NewGreetingDialog from '../../components/dialogs/greetings/NewGreetingDialog'
import StartAllGreetingDialog from '../../components/dialogs/greetings/StartAllGreetingDialog'
import StopAllGreetingsDialog from '../../components/dialogs/greetings/StopAllGreetingsDialog.tsx'
import { UserContext } from '../../contexts/userContext.tsx'
import UploadGreetingsExcelButton from '../../components/buttons/UploadGreetingsExcelButton.tsx'
import moment from 'moment'

type SelectedData = {
  name?: string,
  party?: string,
  mobile?: string,
  category?: string,
  date_of_birth?: string,
  anniversary?: string,
  updated_at?: Date,
  created_by?: string

}
const template: SelectedData[] = [{
  name: "nishu",
  party: "ram footwear",
  mobile: "9898989898",
  category: "party",
  date_of_birth: moment(new Date()).format("MM/DD/YY"),
  anniversary: moment(new Date()).format("MM/DD/YY"),
}
]

export default function GreetingPage() {
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IGreeting[]>, BackendError>("greetings", GetGreetings)
  const [greeting, setGreeting] = useState<IGreeting>()
  const [greetings, setGreetings] = useState<IGreeting[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => greetings, [greetings])
  const [preFilteredData, setPreFilteredData] = useState<IGreeting[]>([])
  const [selectedGreetings, setSelectedGreetings] = useState<IGreeting[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<SelectedData[]>(template)
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { user } = useContext(UserContext)
  function handleExcel() {
    setAnchorEl(null)
    try {
      ExportToExcel(selectedData, "greeting_data")
      setSent(true)
      setSelectAll(false)
      setSelectedData([])
      setSelectedGreetings([])
    }
    catch (err) {
      console.log(err)
      setSent(false)
    }

  }

  // refine data
  useEffect(() => {
    let data: SelectedData[] = template
    selectedGreetings.map((greeting) => {
      return data.push({
        name: greeting.name,
        party: greeting.party,
        mobile: greeting.mobile,
        category: greeting.category,
        date_of_birth: moment(new Date(greeting.dob_time)).format("MM/DD/YY"),
        anniversary: moment(new Date(greeting.anniversary_time)).format("MM/DD/YY"),
        updated_at: new Date(greeting.updated_at),
        created_by: greeting.created_by && greeting.created_by.username
      })
    })
    setSelectedData(data)
  }, [selectedGreetings])

  useEffect(() => {
    if (isSuccess) {
      setGreetings(data.data)
      setPreFilteredData(data.data)
    }
  }, [isSuccess, greetings, data])


  useEffect(() => {
    if (filter) {
      if (greetings) {
        const searcher = new FuzzySearch(greetings, ["name", "party", "category", "mobile"], {
          caseSensitive: false,
        });
        const result = searcher.search(filter);
        setGreetings(result)
      }
    }
    if (!filter)
      setGreetings(preFilteredData)

  }, [filter, greetings])

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
          Greetings
        </Typography>

        <Stack
          direction="row"
        >
          {/* search bar */}
          {!user?.greetings_access_fields.is_hidden ?
            < UploadGreetingsExcelButton disabled={Boolean(!user?.greetings_access_fields.is_editable)} /> : null}

          < Stack direction="row" spacing={2} sx={{ bgcolor: 'whitesmoke' }
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
              {user?.greetings_access_fields.is_editable &&
                <MenuItem onClick={() => {
                  setChoice({ type: GreetingChoiceActions.create_greeting })
                  setAnchorEl(null)
                }}
                >New Greeting</MenuItem>}

              {user?.greetings_access_fields.is_editable && <MenuItem onClick={() => {
                setChoice({ type: GreetingChoiceActions.bulk_start_greeting })
                setAnchorEl(null)
              }}
              >Start All</MenuItem>}

              {user?.greetings_access_fields.is_editable && <MenuItem onClick={() => {
                setChoice({ type: GreetingChoiceActions.bulk_stop_greeting })
                setAnchorEl(null)
              }}
              >Stop All</MenuItem>}

              <MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>

            </Menu>
            <NewGreetingDialog />
            <StartAllGreetingDialog />
            <StopAllGreetingsDialog />
          </>
        </Stack>
      </Stack >
      {/*  table */}
      {isLoading && <TableSkeleton />}
      {
        !isLoading &&
        <GreetingsTable
          greeting={greeting}
          selectAll={selectAll}
          selectedGreetings={selectedGreetings}
          setSelectedGreetings={setSelectedGreetings}
          setSelectAll={setSelectAll}
          greetings={MemoData}
          setGreeting={setGreeting}
        />
      }

    </>

  )

}

