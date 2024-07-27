import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import FuzzySearch from "fuzzy-search";
import ExportToExcel from '../../utils/ExportToExcel'
import { ChoiceContext, LeadChoiceActions, } from '../../contexts/dialogContext'
import { Menu as MenuIcon } from '@mui/icons-material';
import AlertBar from '../../components/snacks/AlertBar'
import { UserContext } from '../../contexts/userContext'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { ICRMStateTemplate } from '../../types/template.type'
import LeadsStateTable from '../../components/tables/crm/LeadsStateTable'
import { GetAllStates } from '../../services/LeadsServices'
import CreateOrEditStateDialog from '../../components/dialogs/crm/CreateOrEditStateDialog'
import AssignCrmStatesDialog from '../../components/dialogs/crm/AssignCrmStatesDialog'
import FindUknownCrmStatesDialog from '../../components/dialogs/crm/FindUknownCrmStatesDialog'
import { ICRMState } from '../../types/crm.types'
import UploadCRMStatesFromExcelButton from '../../components/buttons/UploadCRMStatesFromExcelButton'
import { is_authorized } from '../../utils/auth'


let template: ICRMStateTemplate[] = [
  {
    _id: "",
    state: "delhi"
  }
]

export default function CrmStatesPage() {
  const [flag, setFlag] = useState(1);
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<{ state: ICRMState, users: { _id: string, username: string }[] }[]>, BackendError>("crm_states", GetAllStates)
  const [state, setState] = useState<{ state: ICRMState, users: { _id: string, username: string }[] }>()
  const [states, setStates] = useState<{ state: ICRMState, users: { _id: string, username: string }[] }[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => states, [states])
  const [preFilteredData, setPreFilteredData] = useState<{ state: ICRMState, users: { _id: string, username: string }[] }[]>([])
  const [selectedStates, setSelectedStates] = useState<{ state: ICRMState, users: { _id: string, username: string }[] }[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<ICRMStateTemplate[]>(template)
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { user: LoggedInUser } = useContext(UserContext)


  function handleExcel() {
    setAnchorEl(null)
    try {
      ExportToExcel(selectedData, "crm_states_data")
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
    let data: ICRMStateTemplate[] = []
    selectedStates.map((state) => {
      return data.push({
        _id: state.state._id,
        state: state.state.state,
        users: state.users.map((u) => { return u.username }).toString()
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
  }, [isSuccess, data])


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

  }, [filter])
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

      >

        <Typography
          variant={'h6'}
          component={'h1'}
          sx={{ pl: 1 }}
        >
          States {selectedStates.length > 0 ? <span>(checked : {selectedStates.length})</span> : `- ${states.length}`}
        </Typography>

        <TextField
          sx={{ width: '50vw' }}
          size="small"
          onChange={(e) => {
            setFilter(e.currentTarget.value)
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search sx={{ cursor: 'pointer' }} />
              </InputAdornment>
            ),
          }}
          placeholder={`Search States `}
          style={{
            fontSize: '1.1rem',
            border: '0',
          }}
        />
        <Stack
          direction="row"
        >
          {/* search bar */}
          < Stack direction="row" spacing={2}>
            <UploadCRMStatesFromExcelButton disabled={Boolean(LoggedInUser?.assigned_roles && is_authorized('leads_view', LoggedInUser?.assigned_roles))} />
          </Stack >
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
              <MenuItem
                disabled={LoggedInUser?.assigned_roles && is_authorized('leads_view', LoggedInUser?.assigned_roles)}
                onClick={() => {
                  setChoice({ type: LeadChoiceActions.create_or_edit_state })
                  setState(undefined)
                  setAnchorEl(null)
                }}
              > Add New</MenuItem>
              <MenuItem
                disabled={LoggedInUser?.assigned_roles && is_authorized('leads_view', LoggedInUser?.assigned_roles)}
                onClick={() => {
                  if (selectedStates && selectedStates.length == 0) {
                    alert("select some states")
                  }
                  else {
                    setChoice({ type: LeadChoiceActions.bulk_assign_crm_states })
                    setState(undefined)
                    setFlag(1)
                  }
                  setAnchorEl(null)
                }}
              > Assign States</MenuItem>
              <MenuItem
                disabled={LoggedInUser?.assigned_roles && is_authorized('leads_view', LoggedInUser?.assigned_roles)}
                onClick={() => {
                  if (selectedStates && selectedStates.length == 0) {
                    alert("select some states")
                  }
                  else {
                    setChoice({ type: LeadChoiceActions.bulk_assign_crm_states })
                    setState(undefined)
                    setFlag(0)
                  }
                  setAnchorEl(null)
                }}
              > Remove States</MenuItem>
              <MenuItem
                sx={{ color: 'red' }}
                disabled={LoggedInUser?.assigned_roles && is_authorized('leads_view', LoggedInUser?.assigned_roles)}
                onClick={() => {
                  setChoice({ type: LeadChoiceActions.find_unknown_states })
                  setState(undefined)
                  setAnchorEl(null)
                }}
              > Find Unknown States</MenuItem>

              < MenuItem onClick={handleExcel}
                disabled={LoggedInUser?.assigned_roles && is_authorized('leads_view', LoggedInUser?.assigned_roles)}
              >Export To Excel</MenuItem>

            </Menu >
            <CreateOrEditStateDialog />
            {LoggedInUser?.is_admin && <FindUknownCrmStatesDialog />}
            {<AssignCrmStatesDialog flag={flag} states={selectedStates.map((item) => { return item.state })} />}
          </>
        </Stack >
      </Stack >
      {/*  table */}
      {isLoading && <TableSkeleton />}
      {MemoData.length == 0 && <div style={{ textAlign: "center", padding: '10px' }}>No Data Found</div>}
      {!isLoading && MemoData.length > 0 &&
        <LeadsStateTable
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

