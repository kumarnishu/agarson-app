import { Search } from '@mui/icons-material'
import { Fade, FormControlLabel, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, Switch, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import FuzzySearch from "fuzzy-search";
import ExportToExcel from '../../utils/ExportToExcel'
import { ChoiceContext, ProductionChoiceActions } from '../../contexts/dialogContext'
import { Menu as MenuIcon } from '@mui/icons-material';
import AlertBar from '../../components/snacks/AlertBar'
import { UserContext } from '../../contexts/userContext'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { IDye } from '../../types/production.types'
import { GetDyes } from '../../services/ProductionServices'
import NewDyeDialog from '../../components/dialogs/production/CreateDyeDialog'
import DyesTable from '../../components/tables/DyesTable'
import UploadDyesFromExcelButton from '../../components/buttons/UploadDyesButton'


type SelectedData = {
  dye_number?: number,
  size?: string,
  is_active?: boolean,
  created_at?: string,
  updated_at?: string
}
let template: SelectedData[] = [
  {
    dye_number: 1,
    is_active: true,
    size: "6"
  }
]

export default function DyePage() {
  const [hidden, setHidden] = useState(false)
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IDye[]>, BackendError>(["dyes", hidden], async () => GetDyes(String(hidden)))
  const [dye, setDye] = useState<IDye>()
  const [dyes, setDyes] = useState<IDye[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => dyes, [dyes])
  const [preFilteredData, setPreFilteredData] = useState<IDye[]>([])
  const [selectedDyes, setSelectedDyes] = useState<IDye[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<SelectedData[]>(template)
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { user: LoggedInUser } = useContext(UserContext)


  function handleExcel() {
    setAnchorEl(null)
    try {
      ExportToExcel(selectedData, "dyes_data")
      setSent(true)
      setSelectAll(false)
      setSelectedData([])
      setSelectedDyes([])
    }
    catch (err) {
      console.log(err)
      setSent(false)
    }
  }

  // refine data
  useEffect(() => {
    let data: SelectedData[] = []
    selectedDyes.map((dye) => {
      return data.push({
        dye_number: dye.dye_number,
        size: dye.size,
        is_active: dye.active ? true : false,
        created_at: new Date(dye.created_at).toLocaleDateString(),
        updated_at: new Date(dye.updated_at).toLocaleDateString()
      })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedDyes])

  useEffect(() => {
    if (isSuccess) {
      setDyes(data.data)
      setPreFilteredData(data.data)
    }
  }, [isSuccess, dyes, data])


  useEffect(() => {
    if (filter) {
      if (dyes) {
        const searcher = new FuzzySearch(dyes, ["dye_number", "size",  "created_by", "updated_by"], {
          caseSensitive: false,
        });
        const result = searcher.search(filter);
        setDyes(result)
      }
    }
    if (!filter)
      setDyes(preFilteredData)

  }, [filter, dyes])
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
          Dyes
        </Typography>

        <Stack
          direction="row"
        >
          {/* search bar */}
          < Stack direction="row" spacing={2} >
            {LoggedInUser?.productions_access_fields.is_editable ?
              < UploadDyesFromExcelButton disabled={Boolean(!LoggedInUser?.productions_access_fields.is_editable)} /> : null}
            <FormControlLabel control={<Switch
              defaultChecked={Boolean(hidden)}
              onChange={() => setHidden(!hidden)}
            />} label="Show hidden" />
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
            >{LoggedInUser?.productions_access_fields.is_editable &&
              <MenuItem onClick={() => {
                setChoice({ type: ProductionChoiceActions.create_dye })
                setAnchorEl(null)
              }}
              >New Dye</MenuItem>}
              <MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>


            </Menu>
            <NewDyeDialog />
          </>

        </Stack>
      </Stack>
      {/*  table */}
      {isLoading && <TableSkeleton />}
      {!isLoading &&
        <DyesTable
          dye={dye}
          selectAll={selectAll}
          selectedDyes={selectedDyes}
          setSelectedDyes={setSelectedDyes}
          setSelectAll={setSelectAll}
          dyes={MemoData}
          setDye={setDye}
        />}

    </>

  )

}

