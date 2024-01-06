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
import { IProduction } from '../../types/production.types'
import { GetProductions } from '../../services/ProductionServices'
import NewProductionDialog from '../../components/dialogs/production/CreateProductionDialog'
import ProductionsTable from '../../components/tables/ProductionTable'


type SelectedData = {
  machine?: string,
  thekedar?: string,
  articles?: string,
  manpower?: number,
  production?: number,
  small_repair?: number,
  big_repair?: number,
  created_at?: string,
  updated_at?: string
}
let template: SelectedData[] = [
  {
    machine: "",
    thekedar: "",
    articles: '',
    manpower: 0,
    production: 0,
    small_repair: 0,
    big_repair: 0,
    created_at: new Date().toLocaleTimeString(),
    updated_at: new Date().toLocaleTimeString()
  }
]

export default function ProductionAdminPage() {
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IProduction[]>, BackendError>("productions", GetProductions)
  const [production, setProduction] = useState<IProduction>()
  const [productions, setProductions] = useState<IProduction[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => productions, [productions])
  const [preFilteredData, setPreFilteredData] = useState<IProduction[]>([])
  const [selectedProductions, setSelectedProductions] = useState<IProduction[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<SelectedData[]>(template)
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { user: LoggedInUser } = useContext(UserContext)


  function handleExcel() {
    setAnchorEl(null)
    try {
      ExportToExcel(selectedData, "productions_data")
      setSent(true)
      setSelectAll(false)
      setSelectedData([])
      setSelectedProductions([])
    }
    catch (err) {
      console.log(err)
      setSent(false)
    }
  }

  // refine data
  useEffect(() => {
    let data: SelectedData[] = []
    selectedProductions.map((production) => {
      return data.push({
        machine: production.machine.name,
        thekedar: production.thekedar.username,
        articles: production.articles.map((a) => { return a.display_name }).toString(),
        manpower: production.manpower,
        production: production.production,
        small_repair: production.small_repair,
        big_repair: production.big_repair,
        created_at: new Date(production.created_at).toLocaleDateString(),
        updated_at: new Date(production.updated_at).toLocaleDateString()
      })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedProductions])

  useEffect(() => {
    if (isSuccess) {
      setProductions(data.data)
      setPreFilteredData(data.data)
    }
  }, [isSuccess, productions, data])


  useEffect(() => {
    if (filter) {
      if (productions) {
        const searcher = new FuzzySearch(productions, ["machine.name", "thekedar.username", "article.name", "small_repair", "big_repair", "manpower", "production", "created_by.username", "updated_by.username"], {
          caseSensitive: false,
        });
        const result = searcher.search(filter);
        setProductions(result)
      }
    }
    if (!filter)
      setProductions(preFilteredData)

  }, [filter, productions])
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
          Productions
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
                setChoice({ type: ProductionChoiceActions.create_production })
                setAnchorEl(null)
              }}
              >New Production</MenuItem>}
              <MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>
            </Menu>
            <NewProductionDialog />
          </>

        </Stack>
      </Stack>
      {/*  table */}
      {isLoading && <TableSkeleton />}
      {!isLoading &&
        <ProductionsTable
          production={production}
          selectAll={selectAll}
          selectedProductions={selectedProductions}
          setSelectedProductions={setSelectedProductions}
          setSelectAll={setSelectAll}
          productions={MemoData}
          setProduction={setProduction}
        />}

    </>

  )

}

