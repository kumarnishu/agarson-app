import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import FuzzySearch from "fuzzy-search";
import ExportToExcel from '../../utils/ExportToExcel'
import { ChoiceContext,  ProductionChoiceActions, } from '../../contexts/dialogContext'
import { Menu as MenuIcon } from '@mui/icons-material';
import AlertBar from '../../components/snacks/AlertBar'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { UserContext } from '../../contexts/userContext'
import { IDyeLocation } from '../../types/production.types'
import { GetAllDyeLocations } from '../../services/ProductionServices'
import DyeLocationTable from '../../components/tables/production/DyeLocationTable'
import CreateOrEditDyeLocationDialog from '../../components/dialogs/production/CreateOrEditDyeLocationDialog'

type ITemplate = {
  _id: string,
  name: string,
  display_name: string
}
let template: ITemplate[] = [
  {
    _id: "qeqq6g54",
    name: "VER-1",
    display_name: "VER-1",
  }
]

export default function DyeLocationsPage() {
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IDyeLocation[]>, BackendError>("dye_locations", GetAllDyeLocations)
  const [location, setDyeLocation] = useState<IDyeLocation>()
  const [locations, setDyeLocations] = useState<IDyeLocation[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => locations, [locations])
  const [preFilteredData, setPreFilteredData] = useState<IDyeLocation[]>([])
  const [selectedDyeLocations, setSelectedDyeLocations] = useState<IDyeLocation[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<ITemplate[]>(template)
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { user: LoggedInUser } = useContext(UserContext)

  function handleExcel() {
    setAnchorEl(null)
    try {
      ExportToExcel(selectedData, "dye_location_data")
      setSent(true)
      setSelectAll(false)
      setSelectedData([])
      setSelectedDyeLocations([])
    }
    catch (err) {
      console.log(err)
      setSent(false)
    }
  }

  // refine data
  useEffect(() => {
    let data: ITemplate[] = []
    selectedDyeLocations.map((location) => {
      return data.push({
        _id: location._id,
        name: location.name,
        display_name: location.display_name,
      })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedDyeLocations])

  useEffect(() => {
    if (isSuccess) {
      setDyeLocations(data.data)
      setPreFilteredData(data.data)
    }
  }, [isSuccess, locations, data])


  useEffect(() => {
    if (filter) {
      if (locations) {
        const searcher = new FuzzySearch(locations, ["location", "users.username"], {
          caseSensitive: false,
        });
        const result = searcher.search(filter);
        setDyeLocations(result)
      }
    }
    if (!filter)
      setDyeLocations(preFilteredData)

  }, [filter, locations])
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
          Locations {selectedDyeLocations.length > 0 ? <span>(checked : {selectedDyeLocations.length})</span> : `- ${locations.length}`}
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
          placeholder={`Search DyeLocations `}
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
            {/* {LoggedInUser?.crm_access_fields.is_editable && <UploadCRMDyeLocationsFromExcelButton is_editable} />} */}
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
              {LoggedInUser?.assigned_permissions.includes('dye_location_create') && <MenuItem
                onClick={() => {
                  setChoice({ type: ProductionChoiceActions.create_or_edit_location })
                  setDyeLocation(undefined)
                  setAnchorEl(null)
                }}

              > Add New</MenuItem>}


              {LoggedInUser?.assigned_permissions.includes('dye_location_export') && < MenuItem onClick={handleExcel}

              >Export To Excel</MenuItem>}

            </Menu >
            <CreateOrEditDyeLocationDialog />
          </>
        </Stack >
      </Stack >
      {/*  table */}
      {isLoading && <TableSkeleton />}
      {MemoData.length == 0 && <div style={{ textAlign: "center", padding: '10px' }}>No Data Found</div>}
      {!isLoading && MemoData.length > 0 &&
        <DyeLocationTable
          location={location}
          selectAll={selectAll}
          selectedDyeLocations={selectedDyeLocations}
          setSelectedDyeLocations={setSelectedDyeLocations}
          setSelectAll={setSelectAll}
          locations={MemoData}
          setDyeLocation={setDyeLocation}
        />}

    </>

  )

}

