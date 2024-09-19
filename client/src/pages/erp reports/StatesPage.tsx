import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import FuzzySearch from "fuzzy-search";
import ExportToExcel from '../../utils/ExportToExcel'
import { ChoiceContext, UserChoiceActions, } from '../../contexts/dialogContext'
import { Menu as MenuIcon } from '@mui/icons-material';
import AlertBar from '../../components/snacks/AlertBar'
import { UserContext } from '../../contexts/userContext'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { GetStates } from '../../services/ErpServices'
import CreateOrEditErpStateDialog from '../../components/dialogs/erp/CreateOrEditErpStateDialog'
import AssignErpCrmStatesDialog from '../../components/dialogs/erp/AssignErpStatesDialog'
import ErpStateTable from '../../components/tables/erp reports/ErpStateTable'
import UploadStatesFromExcelButton from '../../components/buttons/UploadStatesButton'
import { GetErpStateDto, GetErpStateFromExcelDto } from '../../dtos/erp reports/erp.reports.dto'


let template: GetErpStateFromExcelDto[] = [
  {
    _id: "",
    state: "delhi",
    apr: 0,
    may: 0,
    jun: 0,
    jul: 0,
    aug: 0,
    sep: 0,
    oct: 0,
    nov: 0,
    dec: 0,
    jan: 0,
    feb: 0,
    mar: 0,
  }
]

export default function ErpStatesPage() {
  const [flag, setFlag] = useState(1);
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<GetErpStateDto[]>, BackendError>("erp_states", GetStates)
  const [state, setState] = useState<GetErpStateDto>()
  const [states, setStates] = useState<GetErpStateDto[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => states, [states])
  const [preFilteredData, setPreFilteredData] = useState<GetErpStateDto[]>([])
  const [selectedStates, setSelectedStates] = useState<GetErpStateDto[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<GetErpStateFromExcelDto[]>(template)
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { user } = useContext(UserContext)

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
    let data: GetErpStateFromExcelDto[] = []
    selectedStates.map((state) => {
      return data.push({
        _id: state._id,
        state: state.state,
        apr: state ? state.apr : 0,
        may: state ? state.may : 0,
        jun: state ? state.jun : 0,
        jul: state ? state.jul : 0,
        aug: state ? state.aug : 0,
        sep: state ? state.sep : 0,
        oct: state ? state.oct : 0,
        nov: state ? state.nov : 0,
        dec: state ? state.dec : 0,
        jan: state ? state.jan : 0,
        feb: state ? state.feb : 0,
        mar: state ? state.mar : 0,
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

      >

        <Typography
          variant={'h6'}
          component={'h1'}
        >
          Erp States {selectedStates.length > 0 ? <span>(checked : {selectedStates.length})</span> : `- ${states.length}`}
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
            border: 0,
          }}
        />
        <Stack
          direction="row"
        >
          {/* search bar */}
          < Stack direction="row" spacing={2}>
            {user?.assigned_permissions.includes("pending_orders_create") && <UploadStatesFromExcelButton />}
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
              {user?.assigned_permissions.includes("erp_state_create") && <MenuItem
                onClick={() => {
                  setChoice({ type: UserChoiceActions.create_or_edit_erpstate })
                  setState(undefined)
                  setAnchorEl(null)
                }}
              > Add New</MenuItem>}
              {user?.assigned_permissions.includes("erp_state_edit") && <MenuItem
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
              > Assign States</MenuItem>}
              {user?.assigned_permissions.includes("erp_state_edit") && <MenuItem
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
              > Remove States</MenuItem>}
              {user?.assigned_permissions.includes("erp_state_export") && < MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>}

            </Menu >
            <CreateOrEditErpStateDialog />
            {<AssignErpCrmStatesDialog flag={flag} states={selectedStates.map((item) => { return item })} />}
          </>
        </Stack >
      </Stack >
      {/*  table */}
      {isLoading && <TableSkeleton />}
      {!isLoading && MemoData.length == 0 && <div style={{ textAlign: "center", padding: '10px' }}>No Data Found</div>}
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

