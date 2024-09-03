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
import LeadsCityTable from '../../components/tables/crm/LeadsCityTable'
import { GetAllCities, GetAllStates } from '../../services/LeadsServices'
import CreateOrEditCityDialog from '../../components/dialogs/crm/CreateOrEditCityDialog'
import UploadCRMCitiesFromExcelButton from '../../components/buttons/UploadCRMCitiesFromExcelButton'
// import AssignCrmCitiesDialog from '../../components/dialogs/crm/AssignCrmCitiesDialog'
import { toTitleCase } from '../../utils/TitleCase'
import AssignCrmCitiesDialog from '../../components/dialogs/crm/AssignCrmCitiesDialog'
import FindUknownCrmCitiesDialog from '../../components/dialogs/crm/FindUknownCrmCitiesDialog'
import { CreateAndUpdatesCityFromExcelDto, GetCrmCityDto, GetCrmStateDto } from '../../dtos/crm/crm.dto'


let template: CreateAndUpdatesCityFromExcelDto[] = [
  {
    _id: "",
    city: "chawri"
  }
]

export default function CrmCitiesPage() {
  const [flag, setFlag] = useState(1);
  const [state, setState] = useState<string | undefined>();
  const [states, setStates] = useState<GetCrmStateDto[]>([])

  const { data: citiesdata, isSuccess, isLoading, refetch } = useQuery<AxiosResponse<GetCrmCityDto[]>, BackendError>(["crm_cities", state], async () => GetAllCities({ state: state }))
  const [city, setCity] = useState<GetCrmCityDto>()
  const [cities, setCities] = useState<GetCrmCityDto[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => cities, [cities])
  const [preFilteredData, setPreFilteredData] = useState<GetCrmCityDto[]>([])
  const [selectedCities, setSelectedCities] = useState<GetCrmCityDto[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<CreateAndUpdatesCityFromExcelDto[]>(template)
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { user: LoggedInUser } = useContext(UserContext)

  const { data, isSuccess: isStateSuccess } = useQuery<AxiosResponse<GetCrmStateDto[]>, BackendError>("crm_states", GetAllStates)

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
    let data: CreateAndUpdatesCityFromExcelDto[] = []
    selectedCities.map((city) => {
      return data.push({
        _id: city.city.id,
        city: city.city && city.city.value,
        users: city.assigned_users.map((u) => { return u.value }).toString()
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

            {LoggedInUser?.assigned_permissions.includes('') && <UploadCRMCitiesFromExcelButton state={state} />}
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
                  return (<option key={state.state.id} value={state.state.value}>
                    {toTitleCase(state.state.label)}
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
              {LoggedInUser?.assigned_permissions.includes('city_create') && <MenuItem
                onClick={() => {
                  setChoice({ type: LeadChoiceActions.create_or_edit_city })
                  setCity(undefined)
                  setAnchorEl(null)
                }}

              > Add New</MenuItem>}
              {LoggedInUser?.assigned_permissions.includes('city_edit') && <MenuItem
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

              > Assign Cities</MenuItem>}
              {LoggedInUser?.assigned_permissions.includes('city_edit') && <MenuItem
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

              > Remove Cities</MenuItem>}
              {LoggedInUser?.assigned_permissions.includes('city_create') && <MenuItem
                sx={{ color: 'red' }}
                onClick={() => {
                  setChoice({ type: LeadChoiceActions.find_unknown_cities })
                  setState(undefined)
                  setAnchorEl(null)
                }}

              > Find Unknown Cities</MenuItem>}
              {LoggedInUser?.assigned_permissions.includes('city_export') && < MenuItem onClick={handleExcel}

              >Export To Excel</MenuItem>}

            </Menu >
            <CreateOrEditCityDialog />
            {<AssignCrmCitiesDialog flag={flag} cities={selectedCities.map((item) => { return item.city })} />}
            <FindUknownCrmCitiesDialog />
          </>
        </Stack >
      </Stack >
      {/*  table */}
      {isLoading && <TableSkeleton />}
      {!isLoading && MemoData.length == 0 && <div style={{ textAlign: "center", padding: '10px' }}>No Data Found</div>}
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

