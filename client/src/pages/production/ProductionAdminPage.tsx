import { Search } from '@mui/icons-material'
import { Box, Fade, IconButton, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import DBPagination from '../../components/pagination/DBpagination';
import { BackendError } from '../..'
import { Menu as MenuIcon } from '@mui/icons-material';
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import { IUser } from '../../types/user.types'
import { GetUsers } from '../../services/UserServices'
import moment from 'moment'
import ProductionTable from '../../components/tables/ProductionTable'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { UserContext } from '../../contexts/userContext'
import { IProduction } from '../../types/production.types'
import { FuzzySearchProductions, GetProductions } from '../../services/ProductionServices'
import { ChoiceContext, ProductionChoiceActions } from '../../contexts/dialogContext'
import NewProductionDialog from '../../components/dialogs/production/CreateProductionDialog'

export default function ProductionAdminPage() {
  const { user } = useContext(UserContext)
  const { setChoice } = useContext(ChoiceContext)
  const [users, setUsers] = useState<IUser[]>([])
  const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
  const [filter, setFilter] = useState<string | undefined>()
  const [production, setProduction] = useState<IProduction>()
  const [productions, setProductions] = useState<IProduction[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => productions, [productions])
  const [preFilteredData, setPreFilteredData] = useState<IProduction[]>([])
  const [preFilteredPaginationData, setPreFilteredPaginationData] = useState({ limit: 100, page: 1, total: 1 });
  const [filterCount, setFilterCount] = useState(0)
  const [selectedProductions, setSelectedProductions] = useState<IProduction[]>([])
  const [userId, setUserId] = useState<string>()
  const [dates, setDates] = useState<{ start_date?: string, end_date?: string }>({
    start_date: moment(new Date().setDate(new Date().getDate() - 1)).format("YYYY-MM-DD")
    , end_date: moment(new Date().setDate(new Date().getDate())).format("YYYY-MM-DD")
  })
  const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())

  const { data, isLoading, refetch: ReftechProductions } = useQuery<AxiosResponse<{ productions: IProduction[], page: number, total: number, limit: number }>, BackendError>(["productions", paginationData, userId, dates?.start_date, dates?.end_date], async () => GetProductions({ limit: paginationData?.limit, page: paginationData?.page, id: userId, start_date: dates?.start_date, end_date: dates?.end_date }))


  const { data: fuzzyproductions, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<{ productions: IProduction[], page: number, total: number, limit: number }>, BackendError>(["fuzzyproductions", filter], async () => FuzzySearchProductions({ searchString: filter, limit: paginationData?.limit, page: paginationData?.page }), {
    enabled: false
  })

  const [selectedData, setSelectedData] = useState<{
    machine?: string,
    thekedar?: string,
    articles?: string,
    manpower?: number,
    production?: number,
    production_hours?: number,
    small_repair?: number,
    big_repair?: number,
    created_at?: string,
    updated_at?: string
  }[]>()

  const [sent, setSent] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  function handleExcel() {
    setAnchorEl(null)
    try {
      if (selectedData && selectedData.length === 0) {
        alert("select some rows")
      }
      else {
        selectedData && ExportToExcel(selectedData, "productions_data")
        setSent(true)
        setSelectAll(false)
        setSelectedData([])
        setSelectedProductions([])
      }

    }
    catch (err) {
      console.log(err)
      setSent(false)
    }
  }


  // refine data
  useEffect(() => {
    let data: {
      machine?: string,
      thekedar?: string,
      articles?: string,
      manpower?: number,
      production?: number,
      production_hours?: number,
      small_repair?: number,
      big_repair?: number,
      created_at?: string,
      updated_at?: string
    }[] = []
    selectedProductions.map((production) => {
      return data.push(
        {
          machine: production.machine.name,
          thekedar: production.thekedar.username,
          articles: production.articles.map((a) => { return a.display_name }).toString(),
          manpower: production.manpower,
          production_hours: production.production_hours,
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
    if (isUsersSuccess)
      setUsers(usersData?.data)
  }, [users, isUsersSuccess, usersData])


  useEffect(() => {
    if (!filter) {
      setProductions(preFilteredData)
      setPaginationData(preFilteredPaginationData)
    }
  }, [filter])



  useEffect(() => {
    if (filter) {
      refetchFuzzy()
    }
  }, [paginationData])



  useEffect(() => {
    if (data && !filter) {
      setProductions(data.data.productions)
      setPreFilteredData(data.data.productions)
      setPreFilteredPaginationData({
        ...paginationData,
        page: data.data.page,
        limit: data.data.limit,
        total: data.data.total
      })
      setPaginationData({
        ...paginationData,
        page: data.data.page,
        limit: data.data.limit,
        total: data.data.total
      })
    }
  }, [data])

  useEffect(() => {
    if (fuzzyproductions && filter) {
      setProductions(fuzzyproductions.data.productions)
      let count = filterCount
      if (count === 0)
        setPaginationData({
          ...paginationData,
          page: fuzzyproductions.data.page,
          limit: fuzzyproductions.data.limit,
          total: fuzzyproductions.data.total
        })
      count = filterCount + 1
      setFilterCount(count)
    }
  }, [fuzzyproductions])


  return (
    <>
      {
        isLoading && <LinearProgress />
      }
      {
        isFuzzyLoading && <LinearProgress />
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
          Production
        </Typography>

        <Stack
          direction="row"
        >
          {/* search bar */}
          < Stack direction="row" spacing={2}>

            <TextField
              fullWidth
              size="small"
              onChange={(e) => {
                setFilter(e.currentTarget.value)
                setFilterCount(0)
              }}
              autoFocus
              placeholder={`${MemoData?.length} records...`}
              style={{
                fontSize: '1.1rem',
                border: '0',
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  refetchFuzzy()
                }
              }}
            />
            <IconButton
              sx={{ bgcolor: 'whitesmoke' }}
              onClick={() => {
                refetchFuzzy()
              }}
            >
              <Search />
            </IconButton>

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
              {user?.productions_access_fields.is_editable && < MenuItem onClick={() => {
                setChoice({ type: ProductionChoiceActions.create_production })
              }}
              >New Production</MenuItem>}
              < MenuItem onClick={() => {
                handleExcel()
              }}
              >Export To Excel</MenuItem>

            </Menu >
            <NewProductionDialog/>
          </>
        </Stack >
      </Stack >

      {/* filter dates and person */}
      <Stack direction="row" p={2} gap={2}>
        < TextField

          size="small"
          type="date"
          id="start_date"
          label="Start Date"
          fullWidth
          value={dates.start_date}
          focused
          onChange={(e) => {
            if (e.currentTarget.value) {
              setDates({
                ...dates,
                start_date: moment(e.target.value).format("YYYY-MM-DD")
              })
            }
          }}
        />
        < TextField

          size="small"
          type="date"
          id="end_date"
          label="End Date"
          focused
          value={dates.end_date}
          fullWidth
          onChange={(e) => {
            if (e.currentTarget.value) {
              setDates({
                ...dates,
                end_date: moment(e.target.value).format("YYYY-MM-DD")
              })
            }
          }}
        />
        {user?.assigned_users && user?.assigned_users.length > 0 && < TextField
          focused
          size="small"
          select
          SelectProps={{
            native: true,
          }}
          onChange={(e) => {
            setUserId(e.target.value)
            ReftechProductions()
          }}
          required
          id="production_owner"
          label="Person"
          fullWidth
        >
          <option key={'00'} value={undefined}>

          </option>
          {
            users.map((user, index) => {
              if (!user.productions_access_fields.is_hidden)
                return (<option key={index} value={user._id}>
                  {user.username}
                </option>)
              else
                return null
            })
          }
        </TextField>}
      </Stack>

      {/* table */}
      {isLoading && <TableSkeleton />}
      {!isLoading &&
        <Box sx={{ px: 2 }}>
          <ProductionTable
            production={production}
            setProduction={setProduction}
            selectAll={selectAll}
            selectedProductions={selectedProductions}
            setSelectedProductions={setSelectedProductions}
            setSelectAll={setSelectAll}
            productions={MemoData}
          />
        </Box>}
      <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} setFilterCount={setFilterCount} />
    </>

  )

}
