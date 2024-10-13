import { Button, Fade, IconButton, LinearProgress, Menu, MenuItem, TextField, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { UserContext } from '../../contexts/userContext'
import { BackendError } from '../..'
import { MaterialReactTable, MRT_ColumnDef, MRT_RowVirtualizer, MRT_SortingState, useMaterialReactTable } from 'material-react-table'
import { onlyUnique } from '../../utils/UniqueArray'
import { ChoiceContext, ProductionChoiceActions } from '../../contexts/dialogContext'
import { Check, Delete, FilterAlt, FilterAltOff, Fullscreen, FullscreenExit, Menu as MenuIcon } from '@mui/icons-material';
import DBPagination from '../../components/pagination/DBpagination'
import ExportToExcel from '../../utils/ExportToExcel'
import PopUp from '../../components/popup/PopUp'
import { GetUsers } from '../../services/UserServices'
import moment from 'moment'
import { GetShoeWeightDto } from '../../dtos/production/production.dto'
import { GetUserDto } from '../../dtos/users/user.dto'
import { GetShoeWeights } from '../../services/ProductionServices'
import CreateOrEditShoeWeightDialog from '../../components/dialogs/production/CreateOrEditShoeWeightDialog'
import DeleteProductionItemDialog from '../../components/dialogs/production/DeleteProductionItemDialog'
import ValidateShoeWeightDialog from '../../components/dialogs/production/ValidateShoeWeightDialog'


export default function ShoeWeightPage() {
  const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
  const { user: LoggedInUser } = useContext(UserContext)
  const [weight, setWeight] = useState<GetShoeWeightDto>()
  const [weights, setWeights] = useState<GetShoeWeightDto[]>([])
  const [users, setUsers] = useState<GetUserDto[]>([])
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [userId, setUserId] = useState<string>()
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
  const [dates, setDates] = useState<{ start_date?: string, end_date?: string }>({
    start_date: moment(new Date()).format("YYYY-MM-DD")
      , end_date: moment(new Date().setDate(new Date().getDate() + 1)).format("YYYY-MM-DD")
  })
  const { data, isLoading, isSuccess, isRefetching, refetch } = useQuery<AxiosResponse<{ result: GetShoeWeightDto[], page: number, total: number, limit: number }>, BackendError>(["shoe_weights", userId, dates?.start_date, dates?.end_date], async () => GetShoeWeights({ limit: paginationData?.limit, page: paginationData?.page, id: userId, start_date: dates?.start_date, end_date: dates?.end_date }))

  const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<GetUserDto[]>, BackendError>("users", async () => GetUsers({ hidden: 'false', permission: 'shoe_weight_view', show_assigned_only: true }))

  useEffect(() => {
    if (isUsersSuccess)
      setUsers(usersData?.data)
  }, [users, isUsersSuccess, usersData])



  useEffect(() => {
    if (data && isSuccess) {
      setWeights(data.data.result)
      setPaginationData({
        ...paginationData,
        page: data.data.page,
        limit: data.data.limit,
        total: data.data.total
      })
    }
  }, [data, isSuccess])


  const columns = useMemo<MRT_ColumnDef<GetShoeWeightDto>[]>(
    () => weights && [
      {
        accessorKey: 'actions',
        header: '',
        maxSize: 50,
        enableColumnFilter: false,
        size: 120,
        Cell: ({ cell }) => <PopUp
          element={
            <Stack direction="row" spacing={1}>

              <>
                {LoggedInUser?.assigned_permissions.includes('shoe_weight_edit') && <>
                  <IconButton color="info"
                    onClick={() => {
                      setChoice({ type: ProductionChoiceActions.create_or_edit_shoe_weight })
                      setWeight(cell.row.original)
                    }}

                  >
                    1
                  </IconButton>
                  <IconButton color="info"
                    onClick={() => {
                      setChoice({ type: ProductionChoiceActions.update_shoe_weight2 })
                      setWeight(cell.row.original)
                    }}

                  >
                    2
                  </IconButton>
                  <IconButton color="info"
                    onClick={() => {
                      setChoice({ type: ProductionChoiceActions.update_shoe_weight3 })
                      setWeight(cell.row.original)
                    }}

                  >
                    3
                  </IconButton>
                </>}
                {LoggedInUser?.assigned_permissions.includes('shoe_weight_edit') && <Tooltip title="validate">
                  <IconButton color="error"
                    onClick={() => {
                      setChoice({ type: ProductionChoiceActions.validate_weight })
                      setWeight(cell.row.original)
                    }}
                  >
                    <Check />
                  </IconButton>
                </Tooltip>}
                {LoggedInUser?.is_admin && LoggedInUser?.assigned_permissions.includes('shoe_weight_delete') && <Tooltip title="delete">
                  <IconButton color="error"

                    onClick={() => {
                      setChoice({ type: ProductionChoiceActions.delete_production_item })
                      setWeight(cell.row.original)
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>}
              </>


            </Stack>}
        />
      },

      {
        accessorKey: 'weight',
        header: 'Weight',
        size: 350,
        filterVariant: 'multi-select',
        Cell: (cell) => <>{cell.row.original.shoe_weight1.toString() || "" ? cell.row.original.shoe_weight1.toString() || "" : ""}</>,
        filterSelectOptions: weights && weights.map((i) => {
          return i.shoe_weight1.toString() || "";
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'dye',
        header: 'Dye',
        size: 350,
        filterVariant: 'multi-select',
        Cell: (cell) => <>{cell.row.original.dye.value.toString() || "" ? cell.row.original.dye.value.toString() || "" : ""}</>,
        filterSelectOptions: weights && weights.map((i) => {
          return i.dye.value.toString() || "";
        }).filter(onlyUnique)
      }
    ],
    [weights],
  );


  const table = useMaterialReactTable({
    columns,
    data: weights,
    enableColumnResizing: true,
    enableColumnVirtualization: true, enableStickyFooter: true,
    muiTableFooterRowProps: () => ({
      sx: {
        backgroundColor: 'whitesmoke',
        color: 'white',
        fontSize: '14px'
      }
    }),
    muiTableHeadRowProps: () => ({
      sx: {
        backgroundColor: 'whitesmoke',
        color: 'white',
        border: '1px solid lightgrey;',
      },
    }),
    muiTableContainerProps: (table) => ({
      sx: { height: table.table.getState().isFullScreen ? 'auto' : '72vh' }
    }),
    positionToolbarAlertBanner: 'none',
    renderTopToolbarCustomActions: ({ table }) => (

      <Stack
        spacing={2}
        direction="row"
        sx={{ width: '100%' }}
        justifyContent="space-between"

      >
        <Typography
          variant={'h6'}
          component={'h1'}
          sx={{ pl: 1 }}

        >
          Weight
        </Typography>
        {/* filter dates and person */}
        <Stack direction="row" gap={2} justifyContent={'end'}>
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
          {LoggedInUser?.assigned_users && LoggedInUser?.assigned_users.length > 0 && < TextField
            focused
            size="small"
            select
            SelectProps={{
              native: true,
            }}
            onChange={(e) => {
              setUserId(e.target.value)
            }}
            required
            id="weight_owner"
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
      </Stack >
    ),
    rowVirtualizerInstanceRef,
    mrtTheme: (theme) => ({
      baseBackgroundColor: theme.palette.background.paper, //change default background color
    }),
    renderBottomToolbarCustomActions: () => (
      <DBPagination paginationData={paginationData} refetch={() => { refetch() }} setPaginationData={setPaginationData} />

    ),
    muiTableBodyCellProps: () => ({
      sx: {
        border: '1px solid lightgrey;',
        fontSize: '13px'
      },
    }),
    initialState: { density: 'compact' },
    enableRowSelection: true,
    enableRowNumbers: true,
    enableColumnPinning: true,
    onSortingChange: setSorting,
    enableTopToolbar: true,
    enableTableFooter: true,
    enableRowVirtualization: true,
    state: { sorting, isLoading: isLoading },
    enableBottomToolbar: true,
    enableGlobalFilter: false,
    manualPagination: true,
    enablePagination: false,
    enableToolbarInternalActions: false
  });

  useEffect(() => {
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting]);

  return (
    <>
      {
        isLoading || isRefetching && <LinearProgress color='secondary' />
      }
      <>
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
          {LoggedInUser?.assigned_permissions.includes('shoe_weight_create') && <MenuItem
            onClick={() => {
              setChoice({ type: ProductionChoiceActions.create_or_edit_shoe_weight })
              setWeight(undefined);
              setAnchorEl(null)
            }}


          > Add New</MenuItem>}

          {LoggedInUser?.assigned_permissions.includes('shoe_weight_export') && < MenuItem onClick={() => ExportToExcel(table.getRowModel().rows.map((row) => { return row.original }), "Exported Data")}

          >Export All</MenuItem>}
          {LoggedInUser?.assigned_permissions.includes('shoe_weight_export') && < MenuItem disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} onClick={() => ExportToExcel(table.getSelectedRowModel().rows.map((row) => { return row.original }), "Exported Data")}

          >Export Selected</MenuItem>}

        </Menu >
        <CreateOrEditShoeWeightDialog shoe_weight={weight} />
      </>
      {
        weight ?
          <>

            <DeleteProductionItemDialog weight={weight} />
            <ValidateShoeWeightDialog weight={weight} />
          </>
          : null
      }
      <MaterialReactTable table={table} />

    </>

  )

}