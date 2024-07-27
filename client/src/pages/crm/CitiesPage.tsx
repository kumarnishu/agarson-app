
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
import { ICRMCityTemplate } from '../../types/template.type'
import LeadsCityTable from '../../components/tables/crm/LeadsCityTable'
import { GetAllCities, GetAllStates } from '../../services/LeadsServices'
import CreateOrEditCityDialog from '../../components/dialogs/crm/CreateOrEditCityDialog'
import UploadCRMCitiesFromExcelButton from '../../components/buttons/UploadCRMCitiesFromExcelButton'
// import AssignCrmCitiesDialog from '../../components/dialogs/crm/AssignCrmCitiesDialog'
import { ICRMCity, ICRMState } from '../../types/crm.types'
import { toTitleCase } from '../../utils/TitleCase'
import AssignCrmCitiesDialog from '../../components/dialogs/crm/AssignCrmCitiesDialog'
import FindUknownCrmCitiesDialog from '../../components/dialogs/crm/FindUknownCrmCitiesDialog'
import { is_authorized } from '../../utils/auth'


let template: ICRMCityTemplate[] = [
  {
    _id: "",
    city: "chawri"
  }
]

export default function CrmCitiesPage() {
  const [flag, setFlag] = useState(1);
  const [state, setState] = useState<string | undefined>();
  const [states, setStates] = useState<{ state: ICRMState, users: { _id: string, username: string }[] }[]>([])

  const { data: citiesdata, isSuccess, isLoading, refetch } = useQuery<AxiosResponse<{ city: ICRMCity, users: { _id: string, username: string }[] }[]>, BackendError>(["crm_cities", state], async () => GetAllCities({ state: state }))
  const [city, setCity] = useState<{ city: ICRMCity, users: { _id: string, username: string }[] }>()
  const [cities, setCities] = useState<{ city: ICRMCity, users: { _id: string, username: string }[] }[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => cities, [cities])
  const [preFilteredData, setPreFilteredData] = useState<{ city: ICRMCity, users: { _id: string, username: string }[] }[]>([])
  const [selectedCities, setSelectedCities] = useState<{ city: ICRMCity, users: { _id: string, username: string }[] }[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<ICRMCityTemplate[]>(template)
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { user: LoggedInUser } = useContext(UserContext)

  const { data, isSuccess: isStateSuccess } = useQuery<AxiosResponse<{ state: ICRMState, users: { _id: string, username: string }[] }[]>, BackendError>("crm_states", GetAllStates)

  function handleExcel() {
    setAnchorEl(null)
    try {
      ExportToExcel(selectedData, "crm_cities_data")
      setSent(true)
      setSelectAll(false)
      setSelectedData([])
      setSelectedCities([])
    }
    catch (err) {
      console.log(err)
      setSent(false)
    }
  }

  // refine data
  useEffect(() => {
    let data: ICRMCityTemplate[] = []
    selectedCities.map((city) => {
      return data.push({
        _id: city.city._id,
        city: city.city && city.city.city,
        users: city.users.map((u) => { return u.username }).toString()
      })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedCities])

  useEffect(() => {
    if (isSuccess) {
      setCities(citiesdata.data)
      setPreFilteredData(citiesdata.data)
    }
  }, [isSuccess, citiesdata])

  useEffect(() => {
    if (isStateSuccess) {
      setStates(data.data)
    }
  }, [isSuccess, states, data])



  useEffect(() => {
    if (filter) {
      if (cities) {
        const searcher = new FuzzySearch(cities, ["city.city", "users.username"], {
          caseSensitive: false,
        });
        const result = searcher.search(filter);
        setCities(result)
      }
    }
    if (!filter)
      setCities(preFilteredData)

  }, [filter])

  useEffect(() => {
    refetch();
  }, [state])
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
          Cities {selectedCities.length > 0 ? <span>(checked : {selectedCities.length})</span> : `- ${cities.length}`}
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
          placeholder={`Search Cities `}
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

            {LoggedInUser?.crm_access_fields.is_editable && <UploadCRMCitiesFromExcelButton disabled={LoggedInUser?.assigned_roles && is_authorized('leads_view', LoggedInUser?.assigned_roles)} state={state} />}
            < TextField
              select
              SelectProps={{
                native: true
              }}
              id="state"
              size="small"
              label="Select State"
              sx={{ width: '200px' }}
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setSelectAll(false)
                setSelectedCities([])
              }
              }
            >
              <option key={0} value={undefined}>
                Select State
              </option>
              {
                states.map(state => {
                  return (<option key={state.state._id} value={state.state.state}>
                    {toTitleCase(state.state.state)}
                  </option>)
                })
              }
            </TextField>
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
                  setChoice({ type: LeadChoiceActions.create_or_edit_city })
                  setCity(undefined)
                  setAnchorEl(null)
                }}
                disabled={LoggedInUser?.assigned_roles && is_authorized('leads_view', LoggedInUser?.assigned_roles)}
              > Add New</MenuItem>
              <MenuItem
                onClick={() => {
                  if (selectedCities && selectedCities.length == 0) {
                    alert("select some cities")
                  }
                  else {
                    setChoice({ type: LeadChoiceActions.bulk_assign_crm_cities })
                    setCity(undefined)
                    setFlag(1)
                  }
                  setAnchorEl(null)
                }}
                disabled={LoggedInUser?.assigned_roles && is_authorized('leads_view', LoggedInUser?.assigned_roles)}
              > Assign Cities</MenuItem>
              <MenuItem
                onClick={() => {
                  if (selectedCities && selectedCities.length == 0) {
                    alert("select some cities")
                  }
                  else {
                    setChoice({ type: LeadChoiceActions.bulk_assign_crm_cities })
                    setCity(undefined)
                    setFlag(0)
                  }
                  setAnchorEl(null)
                }}
                disabled={LoggedInUser?.assigned_roles && is_authorized('leads_view', LoggedInUser?.assigned_roles)}
              > Remove Cities</MenuItem>
              <MenuItem
                sx={{ color: 'red' }}
                onClick={() => {
                  setChoice({ type: LeadChoiceActions.find_unknown_cities })
                  setState(undefined)
                  setAnchorEl(null)
                }}
                disabled={LoggedInUser?.assigned_roles && is_authorized('leads_view', LoggedInUser?.assigned_roles)}
              > Find Unknown Cities</MenuItem>
              < MenuItem onClick={handleExcel}
                disabled={LoggedInUser?.assigned_roles && is_authorized('leads_view', LoggedInUser?.assigned_roles)}
              >Export To Excel</MenuItem>

            </Menu >
            <CreateOrEditCityDialog />
            {<AssignCrmCitiesDialog flag={flag} cities={selectedCities.map((item) => { return item.city })} />}
            <FindUknownCrmCitiesDialog />
          </>
        </Stack >
      </Stack >
      {/*  table */}
      {isLoading && <TableSkeleton />}
      {MemoData.length == 0 && <div style={{ textAlign: "center", padding: '10px' }}>No Data Found</div>}
      {!isLoading && MemoData.length > 0 &&
        <LeadsCityTable
          city={city}
          selectAll={selectAll}
          selectedCities={selectedCities}
          setSelectedCities={setSelectedCities}
          setSelectAll={setSelectAll}
          cities={MemoData}
          setCity={setCity}
        />}

    </>

  )

}

