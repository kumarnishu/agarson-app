
import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import FuzzySearch from "fuzzy-search";
import ExportToExcel from '../../utils/ExportToExcel'
import { ChoiceContext, UserChoiceActions } from '../../contexts/dialogContext'
import { Menu as MenuIcon } from '@mui/icons-material';
import AlertBar from '../../components/snacks/AlertBar'
import { UserContext } from '../../contexts/userContext'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { GetStates } from '../../services/ErpServices'
import CreateStateDialog from '../../components/dialogs/states/CreateStateDialog'
import StatesTable from '../../components/tables/StatesTable'
import UploadStatesFromExcelButton from '../../components/buttons/UploadStatesButton'
import BulkAssignStatesDialog from '../../components/dialogs/states/BulkAssignStatesDialog'
import { IState, IUser } from '../../types/user.types'


type SelectedData = {
  state?: string,
  users?: string,
  created_at?: string,
  updated_at?: string
}
let template: SelectedData[] = [
  {
    state: "Goa",
    users: "nishu,rahul"
  }
]

export default function StatePage() {
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<{ state: IState, users: IUser[] }[]>, BackendError>("states", GetStates)
  const [state, setState] = useState<{ state: IState, users: IUser[] }>()
  const [states, setStates] = useState<{ state: IState, users: IUser[] }[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => states, [states])
  const [preFilteredData, setPreFilteredData] = useState<{ state: IState, users: IUser[] }[]>([])
  const [selectedStates, setSelectedStates] = useState<{ state: IState, users: IUser[] }[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<SelectedData[]>(template)
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { user: LoggedInUser } = useContext(UserContext)


  function handleExcel() {
    setAnchorEl(null)
    try {
      ExportToExcel(selectedData, "states_data")
      setSent(true)
      setSelectAll(false)
      setSelectedData([])
      setSelectedStates([])
    }
    catch (err) {
      console.log(err)
      setSent(false)
    }
  }

  // refine data
  useEffect(() => {
    let data: SelectedData[] = []
    selectedStates.map((state) => {
      return data.push({
        state: state.state.state,
        users: state.users.map((u) => { return u.username }).toString(),
        created_at: new Date(state.state.created_at).toLocaleDateString(),
        updated_at: new Date(state.state.updated_at).toLocaleDateString()
      })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedStates])

  useEffect(() => {
    if (isSuccess) {
      setStates(data.data)
      setPreFilteredData(data.data)
    }
  }, [isSuccess, states, data])


  useEffect(() => {
    if (filter) {
      if (states) {
        const searcher = new FuzzySearch(states, ["state.state", "users.username"], {
          caseSensitive: false,
        });
        const result = searcher.search(filter);
        setStates(result)
      }
    }
    if (!filter)
      setStates(preFilteredData)

  }, [filter, states])
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
          States
        </Typography>

        <Stack
          direction="row"
        >
          {/* search bar */}
          < Stack direction="row" spacing={2} >
            {LoggedInUser?.user_access_fields.is_editable && <UploadStatesFromExcelButton disabled={!LoggedInUser?.user_access_fields.is_editable} />}
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
            >{LoggedInUser?.erp_access_fields.is_editable &&
              <MenuItem onClick={() => {
                setChoice({ type: UserChoiceActions.create_state })
                setAnchorEl(null)
              }}
              >New State</MenuItem>}
              {LoggedInUser?.erp_access_fields.is_editable && <MenuItem onClick={() => {
                setChoice({ type: UserChoiceActions.bulk_assign_states })
                setAnchorEl(null)
              }}
              >Assign States</MenuItem>}
              <MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>

            </Menu>
            <CreateStateDialog />
            <BulkAssignStatesDialog states={selectedStates} />
          </>

        </Stack>
      </Stack>
      {/*  table */}
      {isLoading && <TableSkeleton />}
      {!isLoading &&
        <StatesTable
          state={state}
          selectAll={selectAll}
          selectedStates={selectedStates}
          setSelectedStates={setSelectedStates}
          setSelectAll={setSelectAll}
          states={MemoData}
          setState={setState}
        />}

    </>

  )

}

