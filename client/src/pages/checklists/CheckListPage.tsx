import { useContext, useEffect, useState } from 'react'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { Box, Fade, IconButton, LinearProgress, Menu, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { UserContext } from '../../contexts/userContext'
import { GetUsers } from '../../services/UserServices'
import moment from 'moment'
import DBPagination from '../../components/pagination/DBpagination'
import { Menu as MenuIcon } from '@mui/icons-material';
import { toTitleCase } from '../../utils/TitleCase'
import { GetUserDto } from '../../dtos/users/user.dto'
import { DropDownDto } from '../../dtos/common/dropdown.dto'
import { GetAllCheckCategories, GetChecklists } from '../../services/CheckListServices'
import { GetChecklistDto } from '../../dtos/checklist/checklist.dto'
import CheckListsTable from '../../components/tables/checklists/CheckListsTable'
import { CheckListChoiceActions, ChoiceContext } from '../../contexts/dialogContext'
import CreateOrEditCheckListDialog from '../../components/dialogs/checklists/CreateOrEditCheckListDialog'
import FuzzySearch from 'fuzzy-search'

function CheckListPage() {
  const { user } = useContext(UserContext)
  const [users, setUsers] = useState<GetUserDto[]>([])
  const [checklist, setChecklist] = useState<GetChecklistDto>()
  const [checklists, setChecklists] = useState<GetChecklistDto[]>([])
  const [preFilteredChecklists, setPreFilteredChecklists] = useState<GetChecklistDto[]>([])
  const [paginationData, setPaginationData] = useState({ limit: 500, page: 1, total: 1 });
  const [category, setCategory] = useState<string>('undefined');
  const [categories, setCategories] = useState<DropDownDto[]>([])
  const [userId, setUserId] = useState<string>()
  const [dates, setDates] = useState<{ start_date?: string, end_date?: string }>({
    start_date: moment(new Date().setDate(new Date().getDate() - 6)).format("YYYY-MM-DD")
    , end_date: moment(new Date().setDate(new Date().getDate() + 4)).format("YYYY-MM-DD")
  })
  const { data: categorydata, isSuccess: categorySuccess } = useQuery<AxiosResponse<DropDownDto[]>, BackendError>("checklist_categories", GetAllCheckCategories)
  const { setChoice } = useContext(ChoiceContext)

  let previous_date = new Date()
  let day = previous_date.getDate() - 1
  previous_date.setDate(day)
  const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<GetUserDto[]>, BackendError>("users", async () => GetUsers({ hidden: 'false', permission: 'checklist_menu', show_assigned_only: true }))
  const { data, isLoading, refetch: ReftechChecklists } = useQuery<AxiosResponse<{ result: GetChecklistDto[], page: number, total: number, limit: number }>, BackendError>(["checklists", paginationData, userId, dates?.start_date, dates?.end_date], async () => GetChecklists({ limit: paginationData?.limit, page: paginationData?.page, id: userId, start_date: dates?.start_date, end_date: dates?.end_date }))
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  console.log(checklist)

  useEffect(() => {
    if (category != 'undefined') {
      const searcher = new FuzzySearch(preFilteredChecklists, ["category.value"], {
        caseSensitive: false,
      });
      const result = searcher.search(category);
      setChecklists(result)
    }
    if (category == 'undefined')
      setChecklists(preFilteredChecklists)

  }, [category])

  useEffect(() => {
    if (categorySuccess)
      setCategories(categorydata?.data)
  }, [categorySuccess])

  useEffect(() => {
    if (isUsersSuccess)
      setUsers(usersData?.data)
  }, [users, isUsersSuccess, usersData])

  useEffect(() => {
    if (data) {
      setChecklists(data.data.result)
      setPreFilteredChecklists(data.data.result)
      setPaginationData({
        ...paginationData,
        page: data.data.page,
        limit: data.data.limit,
        total: data.data.total
      })
    }
  }, [data])

  return (
    <>

      <Stack
        spacing={1}
        padding={1}
        direction="row"
        justifyContent="space-between"

      >

        <Typography
          variant={'h6'}
          component={'h1'}
          sx={{ pl: 1 }}
        >
          Checklists
        </Typography>

        <Stack
          direction="row"
        >
          {/* search bar */}
          < Stack direction="row" spacing={2} >
            <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
              {categories.map((category, index) => (
                <span
                  key={index}
                >
                  <span key={category.id} style={{ paddingLeft: '25px' }}>{toTitleCase(category.label)} : {checklists.filter((r) => r.category.id == category.id.toLowerCase()).length || 0}</span>
                </span>
              ))}

            </Stack>
          </Stack >
          <>
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
              {user?.assigned_permissions.includes('checklist_create') && <MenuItem
                onClick={() => {
                  setChoice({ type: CheckListChoiceActions.create_or_edit_checklist })
                  setChecklist(undefined)
                  setAnchorEl(null)
                }}

              > Add New</MenuItem>}
            </Menu >
          </>
        </Stack >
      </Stack >

      <CreateOrEditCheckListDialog checklist={checklist} setChecklist={setChecklist} />
      <Stack sx={{ px: 2 }} direction='row' gap={1} pb={1} alignItems={'center'} justifyContent={'center'}>
        < TextField
          size="small"
          type="date"
          id="start_date"
          label="Start Date"
          fullWidth
          focused
          value={dates.start_date}
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
          type="date"
          id="end_date"
          size="small"
          label="End Date"
          value={dates.end_date}
          focused
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
        {user?.assigned_users && user?.assigned_users.length > 0 && <Select
          sx={{ m: 1, width: 300 }}
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
          size='small'
        >
          <MenuItem
            key={'00'}
            value={'undefined'}
            onChange={() => setCategory('undefined')}
          >
            All
          </MenuItem>
          {categories.map((category, index) => (
            <MenuItem
              key={index}
              value={category.value}
            >
              {toTitleCase(category.label)}
            </MenuItem>
          ))}
        </Select>}

        {user?.assigned_users && user?.assigned_users.length > 0 &&
          < TextField
            select

            size="small"
            SelectProps={{
              native: true,
            }}
            onChange={(e) => {
              setUserId(e.target.value)
              ReftechChecklists()
            }}
            required
            id="lead_owners"
            label="Filter Checklists Of Indivdual"
            fullWidth
          >
            <option key={'00'} value={undefined}>

            </option>
            {
              users.map((user, index) => {

                return (<option key={index} value={user._id}>
                  {user.username}
                </option>)

              })
            }
          </TextField>}
      </Stack>
      <>
        {isLoading && <LinearProgress />}

        {!isLoading && checklists.length > 0 &&
          <Box sx={{ px: 2 }}> <CheckListsTable checklist={checklist} checklists={checklists} setChecklist={setChecklist} /></Box>
        }
        {!isLoading && checklists.length == 0 && <p style={{ textAlign: 'center' }}>No Activity Found</p>}
      </>
      <DBPagination paginationData={paginationData} refetch={ReftechChecklists} setPaginationData={setPaginationData} />    </>
  )
}

export default CheckListPage