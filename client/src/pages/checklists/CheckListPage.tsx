import { useContext, useEffect, useMemo, useState } from 'react'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { Button, Fade, IconButton, LinearProgress, Menu, MenuItem, Select, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { UserContext } from '../../contexts/userContext'
import { GetUsers } from '../../services/UserServices'
import moment from 'moment'
import { toTitleCase } from '../../utils/TitleCase'
import { GetUserDto } from '../../dtos/users/user.dto'
import { DropDownDto } from '../../dtos/common/dropdown.dto'
import { MaterialReactTable, MRT_ColumnDef, MRT_SortingState, useMaterialReactTable } from 'material-react-table'
import { CheckListChoiceActions, ChoiceContext } from '../../contexts/dialogContext'
import PopUp from '../../components/popup/PopUp'
import { Delete, Edit, FilterAlt, FilterAltOff, Fullscreen, FullscreenExit } from '@mui/icons-material'
import { DownloadFile } from '../../utils/DownloadFile'
import DBPagination from '../../components/pagination/DBpagination'
import { Menu as MenuIcon } from '@mui/icons-material';
import ExportToExcel from '../../utils/ExportToExcel'
import { GetAllCheckCategories, GetChecklists } from '../../services/CheckListServices'
import { GetChecklistBoxDto, GetChecklistDto } from '../../dtos/checklist/checklist.dto'
import DeleteCheckListDialog from '../../components/dialogs/checklists/DeleteCheckListDialog'
import CreateOrEditCheckListDialog from '../../components/dialogs/checklists/CreateOrEditCheckListDialog'
import ToogleMyCheckListDialog from '../../components/forms/checklists/ToogleMyCheckListDialog'

function ChecklistPage() {
  const { user: LoggedInUser } = useContext(UserContext)
  const [users, setUsers] = useState<GetUserDto[]>([])
  const [checklist, setChecklist] = useState<GetChecklistDto>()
  const [checklists, setChecklists] = useState<GetChecklistDto[]>([])
  const [paginationData, setPaginationData] = useState({ limit: 500, page: 1, total: 1 });
  const [checklistBox, setChecklistBox] = useState<GetChecklistBoxDto>()
  const [category, setCategory] = useState<string>('undefined');
  const [categories, setCategories] = useState<DropDownDto[]>([])
  const [userId, setUserId] = useState<string>()
  const [dates, setDates] = useState<{ start_date?: string, end_date?: string }>({
    start_date: moment(new Date().setDate(new Date().getDate() - 6)).format("YYYY-MM-DD")
    , end_date: moment(new Date().setDate(new Date().getDate() + 4)).format("YYYY-MM-DD")
  })
  const { data: categorydata, isSuccess: categorySuccess } = useQuery<AxiosResponse<DropDownDto[]>, BackendError>("checklist_categories", GetAllCheckCategories)
  const { choice, setChoice } = useContext(ChoiceContext)
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  let previous_date = new Date()
  let day = previous_date.getDate() - 1
  previous_date.setDate(day)
  const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<GetUserDto[]>, BackendError>("users", async () => GetUsers({ hidden: 'false', permission: 'checklist_menu', show_assigned_only: true }))
  const { data, isLoading, refetch, isRefetching } = useQuery<AxiosResponse<{ result: GetChecklistDto[], page: number, total: number, limit: number }>, BackendError>(["checklists", userId, dates?.start_date, dates?.end_date], async () => GetChecklists({ limit: paginationData?.limit, page: paginationData?.page, id: userId, start_date: dates?.start_date, end_date: dates?.end_date }))
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const columns = useMemo<MRT_ColumnDef<GetChecklistDto>[]>(
    //column definitions...
    () => checklists && [
      {
        accessorKey: 'actions',
        header: '',
        maxSize: 50,
        size: 120,
        Cell: ({ cell }) => <PopUp
          element={
            <Stack direction="row" spacing={1}>
              {LoggedInUser?.assigned_permissions.includes('checklist_delete') && <Tooltip title="delete">
                <IconButton color="error"

                  onClick={() => {

                    setChoice({ type: CheckListChoiceActions.delete_checklist })
                    setChecklist(cell.row.original)


                  }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>}
              {LoggedInUser?.assigned_permissions.includes('checklist_edit') &&
                <Tooltip title="Edit">
                  <IconButton
                    onClick={() => {

                      setChoice({ type: CheckListChoiceActions.create_or_edit_checklist })
                      setChecklist(cell.row.original)

                    }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>}

            </Stack>}
        />
      },
      {
        accessorKey: 'work_title',
        header: ' Work Title',
        size: 320,
        Cell: (cell) => <>{cell.row.original.work_title ? cell.row.original.work_title : ""}</>
      },
      {
        accessorKey: 'created_by.label',
        header: 'Responsible',
        size: 100,
        Cell: (cell) => <>{cell.row.original.user.label ? cell.row.original.user.label : ""}</>
      },
      {
        accessorKey: 'category',
        header: ' Category',
        size: 320,
        Cell: (cell) => <>{cell.row.original.category ? cell.row.original.category : ""}</>
      },
      {
        accessorKey: 'frequency',
        header: ' Frequency',
        size: 320,
        Cell: (cell) => <>{cell.row.original.frequency ? cell.row.original.frequency : ""}</>
      },
      {
        accessorKey: 'boxes',
        header: 'Dates',
        size: 200,
        Cell: (cell) => <>{
          cell.row.original && cell.row.original.boxes.map((b) => {
            return <Tooltip title={b.remarks}>
              <Button sx={{ borderRadius: 5, minWidth: '10px', m: 0.3, pl: 0.3 }} onClick={() => {
                if (b) {
                  setChecklistBox(b)
                  setChoice({ type: CheckListChoiceActions.toogle_checklist })
                }

              }} size="small" disabled={new Date(b.date).getDate() > new Date().getDate()} variant={'contained'} color={b.checked ? 'success' : 'error'}>


                {new Date(b.date).getDate().toString()}
              </Button>
            </Tooltip>
          })
        }</>
      },
      {
        accessorKey: 'done_date',
        header: 'Last Checked Date',
        size: 140,
        Cell: (cell) => <>{cell.row.original.done_date ? cell.row.original.done_date : ""}</>
      },
      {
        accessorKey: 'next_date',
        header: 'Next Check Date',
        size: 120,
        Cell: (cell) => <>{cell.row.original.next_date}</>
      },


      {
        accessorKey: 'photo',
        header: 'Photo',
        size: 120,
        Cell: (cell) => <span onDoubleClick={() => {
          if (cell.row.original.photo && cell.row.original.photo) {
            DownloadFile(cell.row.original.photo, 'photo')
          }
        }}>
          {cell.row.original.photo && cell.row.original.photo ? < img height="20" width="55" src={cell.row.original.photo && cell.row.original.photo} alt="visiting card" /> : "na"}</span>
      },
    ],
    [checklists],
  );
  const table = useMaterialReactTable({
    columns, columnFilterDisplayMode: 'popover',
    data: checklists, //10,000 rows       
    enableColumnResizing: true,
    enableColumnVirtualization: true, enableStickyFooter: true,
    muiTableFooterRowProps: () => ({
      sx: {
        backgroundColor: 'whitesmoke',
        color: 'white',
        fontSize: '14px'
      }
    }),
    muiTableContainerProps: (table) => ({
      sx: { height: table.table.getState().isFullScreen ? 'auto' : '65vh' }
    }),
    muiTableHeadRowProps: () => ({
      sx: {
        backgroundColor: 'whitesmoke',
        color: 'white',
        border: '1px solid lightgrey;',
      },
    }),
    renderTopToolbarCustomActions: ({ table }) => (

      <Stack
        sx={{ width: '100%' }}
        pt={1}
        direction="row"
        alignItems={'center'}
        justifyContent="space-between">
        <Stack direction={'row'} gap={1}>
          {categories.map((category, index) => (
            <span
              key={index}
            >
              <span key={category.id} style={{ paddingLeft: '25px' }}>{toTitleCase(category.label)} : {checklists.filter((r) => r.category.id == category.id.toLowerCase()).length || 0}</span>
            </span>
          ))}
        </Stack>

        <Stack justifyContent={'right'} direction={'row'} gap={1}>
          <Tooltip title="Toogle Filter">
            <Button size="small" color="inherit" variant='contained'
              onClick={() => {
                if (table.getState().showColumnFilters)
                  table.resetColumnFilters(true)
                table.setShowColumnFilters(!table.getState().showColumnFilters)
              }
              }
            >
              {table.getState().showColumnFilters ? <FilterAltOff /> : <FilterAlt />}
            </Button>
          </Tooltip>
          <Tooltip title="Toogle FullScreen">
            <Button size="small" color="inherit" variant='contained'
              onClick={() => table.setIsFullScreen(!table.getState().isFullScreen)
              }
            >
              {table.getState().isFullScreen ? <FullscreenExit /> : <Fullscreen />}
            </Button>
          </Tooltip>
          <Tooltip title="Menu">
            <Button size="small" color="inherit" variant='contained'
              onClick={(e) => setAnchorEl(e.currentTarget)
              }
            >
              <MenuIcon />
              <Typography pl={1}> Menu</Typography>
            </Button>
          </Tooltip>
        </Stack>
      </Stack>
    ),
    renderBottomToolbarCustomActions: () => (
      <DBPagination paginationData={paginationData} refetch={refetch} setPaginationData={setPaginationData} />

    ),
    muiTableBodyCellProps: () => ({
      sx: {
        border: '1px solid lightgrey;',
        fontSize: '13px'
      },
    }),
    enableToolbarInternalActions: false,
    initialState: { density: 'compact' },
    enableRowSelection: true,
    enableRowNumbers: true,
    enableColumnPinning: true,
    onSortingChange: setSorting,
    enableTableFooter: true,
    enableRowVirtualization: true,
    state: { sorting, isLoading: isLoading },
    enableBottomToolbar: true,
    enableGlobalFilter: false,
    enablePagination: false,
    manualPagination: true
  });

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

      {
        isLoading || isRefetching && <LinearProgress color='secondary' />
      }
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

        {LoggedInUser?.assigned_permissions.includes('activities_export') && < MenuItem onClick={() => ExportToExcel(table.getRowModel().rows.map((row) => { return row.original }), "Exported Data")}

        >Export All</MenuItem>}
        {LoggedInUser?.assigned_permissions.includes('activities_export') && < MenuItem disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} onClick={() => ExportToExcel(table.getSelectedRowModel().rows.map((row) => { return row.original }), "Exported Data")}

        >Export Selected</MenuItem>}
      </Menu>
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
        {LoggedInUser?.assigned_users && LoggedInUser?.assigned_users.length > 0 && <Select
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

        {LoggedInUser?.assigned_users && LoggedInUser?.assigned_users.length > 0 &&
          < TextField
            select

            size="small"
            SelectProps={{
              native: true,
            }}
            onChange={(e) => {
              setUserId(e.target.value)
            }}
            required
            id="checklist_owners"
            label="Person"
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
      {checklist && <DeleteCheckListDialog checklist={checklist} />}
      {checklist && <CreateOrEditCheckListDialog checklist={checklist} setChecklist={setChecklist} />}
      {choice === CheckListChoiceActions.toogle_checklist && checklistBox && <ToogleMyCheckListDialog box={checklistBox} />}
      <MaterialReactTable table={table} />


    </>
  )
}

export default ChecklistPage