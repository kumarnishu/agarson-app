import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import FuzzySearch from "fuzzy-search";
import ExportToExcel from '../../utils/ExportToExcel'
import { ChoiceContext,  UserChoiceActions, } from '../../contexts/dialogContext'
import { Menu as MenuIcon } from '@mui/icons-material';
import AlertBar from '../../components/snacks/AlertBar'
import { UserContext } from '../../contexts/userContext'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { IState, IUser } from '../../types/user.types'
import { ICRMStateTemplate } from '../../types/template.type'
import UploadCRMStatesFromExcelButton from '../../components/buttons/UploadCRMStatesFromExcelButton'
import { GetStates } from '../../services/ErpServices'
import CreateOrEditErpStateDialog from '../../components/dialogs/erp/CreateOrEditErpStateDialog'
import AssignErpCrmStatesDialog from '../../components/dialogs/erp/AssignErpStatesDialog'
import ErpStateTable from '../../components/tables/ErpStateTable'


let template: ICRMStateTemplate[] = [
  {
    _id: "",
    state: "delhi"
  }
]

export default function CrmStatesPage() {
  const [flag, setFlag] = useState(1);
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<{ state: IState, users: IUser[] }[]>, BackendError>("erp_states", GetStates)
  const [state, setState] = useState<{ state: IState, users: IUser[] }>()
  const [states, setStates] = useState<{ state: IState, users: IUser[] }[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => states, [states])
  const [preFilteredData, setPreFilteredData] = useState<{ state: IState, users: IUser[] }[]>([])
  const [selectedStates, setSelectedStates] = useState<{ state: IState, users: IUser[] }[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<ICRMStateTemplate[]>(template)
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { user: LoggedInUser } = useContext(UserContext)


  function handleExcel() {
    setAnchorEl(null)
    try {
      ExportToExcel(selectedData, "erp_states_data")
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
            {LoggedInUser?.crm_access_fields.is_editable && <UploadCRMStatesFromExcelButton disabled={!LoggedInUser?.crm_access_fields.is_editable} />}
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
                onClick={() => {
                  setChoice({ type: UserChoiceActions.create_or_edit_erpstate })
                  setState(undefined)
                  setAnchorEl(null)
                }}
              > Add New</MenuItem>
              <MenuItem
                onClick={() => {
                  if (selectedStates && selectedStates.length == 0) {
                    alert("select some states")
                  }
                  else {
                    setChoice({ type: UserChoiceActions.bulk_assign_erp_states })
                    setState(undefined)
                    setFlag(1)
                  }
                  setAnchorEl(null)
                }}
              > Assign States</MenuItem>
              <MenuItem
                onClick={() => {
                  if (selectedStates && selectedStates.length == 0) {
                    alert("select some states")
                  }
                  else {
                    setChoice({ type: UserChoiceActions.bulk_assign_erp_states })
                    setState(undefined)
                    setFlag(0)
                  }
                  setAnchorEl(null)
                }}
              > Remove States</MenuItem>
              < MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>

            </Menu >
            <CreateOrEditErpStateDialog />
            {<AssignErpCrmStatesDialog flag={flag} states={selectedStates.map((item) => { return item.state })} />}
          </>
        </Stack >
      </Stack >
      {/*  table */}
      {isLoading && <TableSkeleton />}
      {MemoData.length == 0 && <div style={{ textAlign: "center", padding: '10px' }}>No Data Found</div>}
      {!isLoading && MemoData.length > 0 &&
        <ErpStateTable
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

