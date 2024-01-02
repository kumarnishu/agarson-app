import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
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
import NewMachineDialog from '../../components/dialogs/production/CreateMachineDialog'
import { IMachine } from '../../types/production.types'
import { GetMachines } from '../../services/ProductionServices'
import MachinesTable from '../../components/tables/MachinesTable'


type SelectedData = {
  name?: string,
  display_name?: string,
  is_active?: boolean
  created_at?: string
  updated_at?: string
}
let template: SelectedData[] = [
  {
    name: "power",
    display_name: "power",
    is_active: true
  }
]

export default function MachinePage() {
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IMachine[]>, BackendError>("machines", GetMachines)
  const [machine, setMachine] = useState<IMachine>()
  const [machines, setMachines] = useState<IMachine[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => machines, [machines])
  const [preFilteredData, setPreFilteredData] = useState<IMachine[]>([])
  const [selectedMachines, setSelectedMachines] = useState<IMachine[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<SelectedData[]>(template)
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { user: LoggedInUser } = useContext(UserContext)


  function handleExcel() {
    setAnchorEl(null)
    try {
      ExportToExcel(selectedData, "machines_data")
      setSent(true)
      setSelectAll(false)
      setSelectedData([])
      setSelectedMachines([])
    }
    catch (err) {
      console.log(err)
      setSent(false)
    }
  }

  // refine data
  useEffect(() => {
    let data: SelectedData[] = []
    selectedMachines.map((machine) => {
      return data.push({
        name: machine.name,
        display_name: machine.display_name,
        is_active: machine.active ? true : false,
        created_at: new Date(machine.created_at).toLocaleDateString(),
        updated_at: new Date(machine.updated_at).toLocaleDateString()
      })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedMachines])

  useEffect(() => {
    if (isSuccess) {
      setMachines(data.data)
      setPreFilteredData(data.data)
    }
  }, [isSuccess, machines, data])


  useEffect(() => {
    if (filter) {
      if (machines) {
        const searcher = new FuzzySearch(machines, ["name", "display_name", "created_by", "updated_by"], {
          caseSensitive: false,
        });
        const result = searcher.search(filter);
        setMachines(result)
      }
    }
    if (!filter)
      setMachines(preFilteredData)

  }, [filter, machines])
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
          Machines
        </Typography>

        <Stack
          direction="row"
        >
          {/* search bar */}
          < Stack direction="row" spacing={2} >

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
                setChoice({ type: ProductionChoiceActions.create_machine })
                setAnchorEl(null)
              }}
              >New Machine</MenuItem>}
              <MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>


            </Menu>
            <NewMachineDialog />
          </>

        </Stack>
      </Stack>
      {/*  table */}
      {isLoading && <TableSkeleton />}
      {!isLoading &&
        <MachinesTable
          machine={machine}
          selectAll={selectAll}
          selectedMachines={selectedMachines}
          setSelectedMachines={setSelectedMachines}
          setSelectAll={setSelectAll}
          machines={MemoData}
          setMachine={setMachine}
        />}

    </>

  )

}

