import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import FuzzySearch from "fuzzy-search";
import ExportToExcel from '../../utils/ExportToExcel'
import { Menu as MenuIcon } from '@mui/icons-material';
import AlertBar from '../../components/snacks/AlertBar'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { IShoeWeight } from '../../types/production.types'
import { GetShoeWeights } from '../../services/ProductionServices'
import ShoeWeightsTable from '../../components/tables/production/ShoeWeightsTable'
import { ChoiceContext, ProductionChoiceActions } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'
import NewShoeWeightDialog from '../../components/dialogs/production/CreateShoeWeightDialog'


type SelectedData = {
  shoe_weight: number,
  machine?: string,
  article?: string,
  size?: string,
  created_at?: string,
  updated_at?: string
}
let template: SelectedData[] = [
  {
    shoe_weight: 0,
    machine: "v1",
    article: "power",
    size: "6",
    created_at: new Date().toLocaleDateString(),
    updated_at: new Date().toLocaleDateString()
  }
]

export default function ShoeWeightPage() {
  const { user } = useContext(UserContext)
  const { setChoice } = useContext(ChoiceContext)
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IShoeWeight[]>, BackendError>("shoe_weights", GetShoeWeights)
  const [shoe_weight, setShoeWeight] = useState<IShoeWeight>()
  const [shoe_weights, setShoeWeights] = useState<IShoeWeight[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => shoe_weights, [shoe_weights])
  const [preFilteredData, setPreFilteredData] = useState<IShoeWeight[]>([])
  const [selectedShoeWeights, setSelectedShoeWeights] = useState<IShoeWeight[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<SelectedData[]>(template)
  const [sent, setSent] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);


  function handleExcel() {
    setAnchorEl(null)
    try {
      ExportToExcel(selectedData, "shoe_weights_data")
      setSent(true)
      setSelectAll(false)
      setSelectedData([])
      setSelectedShoeWeights([])
    }
    catch (err) {
      console.log(err)
      setSent(false)
    }
  }

  // refine data
  useEffect(() => {
    let data: SelectedData[] = []
    selectedShoeWeights.map((shoe_weight) => {
      return data.push({
        shoe_weight: shoe_weight.shoe_weight1,
        machine: shoe_weight.machine.name,
        article: shoe_weight.article.name,
        size: shoe_weight.dye.size,
        created_at: new Date().toLocaleDateString(),
        updated_at: new Date().toLocaleDateString()
      })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedShoeWeights])

  useEffect(() => {
    if (isSuccess) {
      setShoeWeights(data.data)
      setPreFilteredData(data.data)
    }
  }, [isSuccess, shoe_weights, data])


  useEffect(() => {
    if (filter) {
      if (shoe_weights) {
        const searcher = new FuzzySearch(shoe_weights, ["article.name", "machine.name", "month"], {
          caseSensitive: false,
        });
        const result = searcher.search(filter);
        setShoeWeights(result)
      }
    }
    if (!filter)
      setShoeWeights(preFilteredData)

  }, [filter, shoe_weights])
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
          ShoeWeights
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
            >
              {user?.assigned_permissions.includes('shoe_weight_create') && < MenuItem onClick={() => {
                setChoice({ type: ProductionChoiceActions.create_shoe_weight })
              }}
              >New Weight</MenuItem>}
              {user?.assigned_permissions.includes('shoe_weight_export') && <MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>}


            </Menu>
          </>
          <NewShoeWeightDialog useddyes={shoe_weights.map((v) => v.dye._id)} />
        </Stack>
      </Stack>
      {/*  table */}
      {isLoading && <TableSkeleton />}
      {!isLoading &&
        <ShoeWeightsTable
          shoe_weight={shoe_weight}
          selectAll={selectAll}
          selectedShoeWeights={selectedShoeWeights}
          setSelectedShoeWeights={setSelectedShoeWeights}
          setSelectAll={setSelectAll}
          shoe_weights={MemoData}
          setShoeWeight={setShoeWeight}
        />}

    </>

  )

}

