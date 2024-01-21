import { Search } from '@mui/icons-material'
import { Fade, IconButton, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FuzzySearchCheckLists, GetCheckLists } from '../../services/CheckListServices'
import DBPagination from '../../components/pagination/DBpagination';
import { BackendError } from '../..'
import { Menu as MenuIcon } from '@mui/icons-material';
import { ChoiceContext, CheckListChoiceActions } from '../../contexts/dialogContext'
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import { IChecklist } from '../../types/checklist.types'
import { IUser } from '../../types/user.types'
import { GetUsers } from '../../services/UserServices'
import moment from 'moment'
import { UserContext } from '../../contexts/userContext'
import NewCheckListDialog from '../../components/dialogs/checklists/NewCheckListDialog'
import CheckListTable from '../../components/tables/CheckListTable'
import TableSkeleton from '../../components/skeleton/TableSkeleton'


export default function CheckListAdminPage() {
  const { user } = useContext(UserContext)
  const [users, setUsers] = useState<IUser[]>([])
  const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
  const [filter, setFilter] = useState<string | undefined>()
  const [checklist, setCheckList] = useState<IChecklist>()
  const [checklists, setCheckLists] = useState<IChecklist[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => checklists, [checklists])
  const [preFilteredData, setPreFilteredData] = useState<IChecklist[]>([])
  const [preFilteredPaginationData, setPreFilteredPaginationData] = useState({ limit: 100, page: 1, total: 1 });
  const [filterCount, setFilterCount] = useState(0)
  const [selectedCheckLists, setSelectedCheckLists] = useState<IChecklist[]>([])
  const [userId, setUserId] = useState<string>()
  const [dates, setDates] = useState<{ start_date?: string, end_date?: string }>({
    start_date: moment(new Date().setDate(1)).format("YYYY-MM-DD")
    , end_date: moment(new Date().setDate(30)).format("YYYY-MM-DD")
  })
  const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())

  const { data, isLoading, refetch: ReftechCheckLists } = useQuery<AxiosResponse<{ checklists: IChecklist[], page: number, total: number, limit: number }>, BackendError>(["checklists", paginationData, userId, dates?.start_date, dates?.end_date], async () => GetCheckLists({ limit: paginationData?.limit, page: paginationData?.page, id: userId, start_date: dates?.start_date, end_date: dates?.end_date }))

  const { data: fuzzychecklists, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<{ checklists: IChecklist[], page: number, total: number, limit: number }>, BackendError>(["fuzzychecklists", filter], async () => FuzzySearchCheckLists({ searchString: filter, limit: paginationData?.limit, page: paginationData?.page }), {
    enabled: false
  })
  const [selectedData, setSelectedData] = useState<{
    title: string,
    person: string,
    created_at: string,
    updated_at: string,
    created_by: string,
    updated_by: string,
  }[]>()
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  function handleExcel() {
    setAnchorEl(null)
    try {
      selectedData && ExportToExcel(selectedData, "checklists_data")
      setSent(true)
      setSelectAll(false)
      setSelectedData([])
      setSelectedCheckLists([])
    }
    catch (err) {
      console.log(err)
      setSent(false)
    }
  }


  // refine data
  useEffect(() => {
    let data: {
      title: string,
      person: string,
      created_at: string,
      updated_at: string,
      updated_by: string,
      created_by: string,
    }[] = []
    selectedCheckLists.map((checklist) => {
      return data.push(
        {
          title: checklist.title,
          person: checklist.owner.username,
          created_at: checklist.created_at.toLocaleString(),
          created_by: checklist.created_by.username,
          updated_by: checklist.updated_by.username,
          updated_at: checklist.updated_at.toLocaleString(),
        })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedCheckLists])

  useEffect(() => {
    if (isUsersSuccess)
      setUsers(usersData?.data)
  }, [users, isUsersSuccess, usersData])

  useEffect(() => {
    if (!filter) {
      setCheckLists(preFilteredData)
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
      setCheckLists(data.data.checklists)
      setPreFilteredData(data.data.checklists)
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
    if (fuzzychecklists && filter) {
      setCheckLists(fuzzychecklists.data.checklists)
      let count = filterCount
      if (count === 0)
        setPaginationData({
          ...paginationData,
          page: fuzzychecklists.data.page,
          limit: fuzzychecklists.data.limit,
          total: fuzzychecklists.data.total
        })
      count = filterCount + 1
      setFilterCount(count)
    }
  }, [fuzzychecklists])

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
          {window.screen.width > 450 ? "CheckLists Admin" : "Admin"}
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
              {
                user?.checklists_access_fields.is_editable && <>
                  <MenuItem
                    onClick={() => {
                      setChoice({ type: CheckListChoiceActions.create_checklist })
                      setAnchorEl(null)
                    }}
                  > Add New</MenuItem>
                </>}
              < MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>

            </Menu >
            <NewCheckListDialog />
          </>
        </Stack >
      </Stack >

      {/* filter dates and person */}
      <Stack direction='row' gap={2} p={2} alignItems={'center'} justifyContent={'center'}>
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

        {user?.assigned_users && user?.assigned_users.length > 0 &&< TextField
          size="small"
          select
          SelectProps={{
            native: true,
          }}
          onChange={(e) => {
            setUserId(e.target.value)
            ReftechCheckLists()
          }}
          required
          id="checklist_owner"
          label="Filter CheckLists Of Indivdual"
          fullWidth
        >
          <option key={'00'} value={undefined}>

          </option>
          {
            users.map((user, index) => {
              if (!user.checklists_access_fields.is_hidden)
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
        < CheckListTable
          dates={dates}
          checklist={checklist}
          setCheckList={setCheckList}
          selectAll={selectAll}
          selectedCheckLists={selectedCheckLists}
          setSelectedCheckLists={setSelectedCheckLists}
          setSelectAll={setSelectAll}
          checklists={MemoData}
        />}
      <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} setFilterCount={setFilterCount} />
    </>

  )

}

