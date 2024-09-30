import { Delete, Edit, Search, Upload, Visibility } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { UserContext } from '../../contexts/userContext'
import DBPagination from '../../components/pagination/DBpagination';
import { BackendError } from '../..'
import { Menu as MenuIcon } from '@mui/icons-material';
import { ChoiceContext, LeadChoiceActions } from '../../contexts/dialogContext'
import CreateOrEditReferDialog from '../../components/dialogs/crm/CreateOrEditReferDialog'
import UploadRefersExcelButton from '../../components/buttons/UploadRefersExcelButton'
import { GetReferDto } from '../../dtos/crm/crm.dto'
import { MaterialReactTable, MRT_ColumnDef, MRT_SortingState, useMaterialReactTable } from 'material-react-table'
import PopUp from '../../components/popup/PopUp'
import { onlyUnique } from '../../utils/UniqueArray'
import DeleteCrmItemDialog from '../../components/dialogs/crm/DeleteCrmItemDialog'
import AllReferralPageDialog from '../../components/dialogs/crm/AllReferralPageDialog'
import ViewReferRemarksDialog from '../../components/dialogs/crm/ViewReferRemarksDialog'
import { FuzzySearchRefers, GetPaginatedRefers } from '../../services/LeadsServices'
import ExportToExcel from '../../utils/ExportToExcel'
import CreateOrEditBillDialog from '../../components/dialogs/crm/CreateOrEditBillDialog'
import ViewRefersBillHistoryDialog from '../../components/dialogs/crm/ViewRefersBillHistoryDialog'

export default function RefersPage() {
  const [paginationData, setPaginationData] = useState({ limit: 20, page: 1, total: 1 });
  const [filter, setFilter] = useState<string | undefined>()
  const { user: LoggedInUser } = useContext(UserContext)
  const [refer, setRefer] = useState<GetReferDto>()
  const [refers, setRefers] = useState<GetReferDto[]>([])

  const [preFilteredData, setPreFilteredData] = useState<GetReferDto[]>([])
  const [preFilteredPaginationData, setPreFilteredPaginationData] = useState({ limit: 20, page: 1, total: 1 });
  const [filterCount, setFilterCount] = useState(0)

  const { data, isLoading, refetch } = useQuery<AxiosResponse<{
    result: GetReferDto[], page: number, total: number, limit: number
  }>, BackendError>(["refers"], async () => GetPaginatedRefers({ limit: paginationData?.limit, page: paginationData?.page }))


  const { data: fuzzyrefers, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<{
    result: GetReferDto[], page: number, total: number, limit: number
  }>, BackendError>(["fuzzyrefers", filter], async () => FuzzySearchRefers({ searchString: filter, limit: paginationData?.limit, page: paginationData?.page }), {
    enabled: false
  })

  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);


  useEffect(() => {
    if (!filter) {
      setRefers(preFilteredData)
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
      setRefers(data.data.result)
      setPreFilteredData(data.data.result)
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
    if (fuzzyrefers && filter) {
      setRefers(fuzzyrefers.data.result)
      let count = filterCount
      if (count === 0)
        setPaginationData({
          ...paginationData,
          page: fuzzyrefers.data.page,
          limit: fuzzyrefers.data.limit,
          total: fuzzyrefers.data.total
        })
      count = filterCount + 1
      setFilterCount(count)
    }
  }, [fuzzyrefers])

  const columns = useMemo<MRT_ColumnDef<GetReferDto>[]>(
    //column definitions...
    () => refers && [
      {
        accessorKey: 'actions',
        header: '',
        maxSize: 50,
        Footer: <b></b>,
        size: 120,
        Cell: ({ cell }) => <PopUp
          element={
            <Stack direction="row" spacing={1}>

              {LoggedInUser?.is_admin && LoggedInUser.assigned_permissions.includes('refer_delete') &&
                <Tooltip title="delete">
                  <IconButton color="error"

                    onClick={() => {
                      setChoice({ type: LeadChoiceActions.delete_crm_item })
                      setRefer(cell.row.original)

                    }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>}
            
              {LoggedInUser?.assigned_permissions.includes('create_refer_bills') && <Tooltip title="upload bill">
                <IconButton color="error"

                  onClick={() => {
                    setChoice({ type: LeadChoiceActions.create_or_edit_bill })
                    setRefer(cell.row.original)

                  }}
                >
                  <Upload />
                </IconButton>
              </Tooltip>}

              {LoggedInUser?.assigned_permissions.includes('view_refer_bills') && <Tooltip title="view bills">
                <IconButton color="primary"

                  onClick={() => {

                    setChoice({ type: LeadChoiceActions.view_bills })
                    setRefer(cell.row.original)
                  }}
                >
                  <Visibility />
                </IconButton>
              </Tooltip>}
              {LoggedInUser?.assigned_permissions.includes('refer_edit') && <Tooltip title="edit">
                <IconButton color="secondary"

                  onClick={() => {

                    setChoice({ type: LeadChoiceActions.create_or_edit_refer })
                    setRefer(cell.row.original)
                  }}

                >
                  <Edit />
                </IconButton>
              </Tooltip>}


              {LoggedInUser?.assigned_permissions.includes('refer_view') && <Tooltip title="view all refer refers">
                <IconButton color="inherit"

                  onClick={() => {
                    setChoice({ type: LeadChoiceActions.view_referrals })
                    setRefer(cell.row.original)
                  }}
                >
                  <Visibility />
                </IconButton>
              </Tooltip>}
              {LoggedInUser?.assigned_permissions.includes('refer_view') && <Tooltip title="view remarks">
                <IconButton color="primary"

                  onClick={() => {
                    setChoice({ type: LeadChoiceActions.view_refer_remarks })
                    setRefer(cell.row.original)
                  }}
                >
                  <Visibility />
                </IconButton>
              </Tooltip>}

            </Stack>}
        />
      },

      {
        accessorKey: 'name',
        header: 'Name',
        size: 350,
        filterVariant: 'multi-select',
        Cell: (cell) => <>{cell.row.original.name ? cell.row.original.name : ""}</>,
        filterSelectOptions: refers && refers.map((i) => {
          return i.name;
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'refers',
        header: 'Refers',
        size: 100,
        filterVariant: 'multi-select',
        Cell: (cell) => <>{cell.row.original.refers ? cell.row.original.refers.toString() : ""}</>,
        filterSelectOptions: refers && refers.map((i) => {
          return i.refers.toString();
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'customer_name',
        header: 'Customer Name',
        size: 120,
        filterVariant: 'multi-select',
        Cell: (cell) => <>{cell.row.original.customer_name ? cell.row.original.customer_name : ""}</>,
        filterSelectOptions: refers && refers.map((i) => {
          return i.customer_name;
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'mobile',
        header: 'Mobile1',
        size: 120,
        Cell: (cell) => <>{cell.row.original.mobile ? cell.row.original.mobile : ""}</>
      }, {
        accessorKey: 'mobile2',
        header: 'Mobile2',
        size: 120,
        Cell: (cell) => <>{cell.row.original.mobile2 ? cell.row.original.mobile2 : ""}</>
      }, {
        accessorKey: 'mobile3',
        header: 'Mobile3',
        size: 120,
        Cell: (cell) => <>{cell.row.original.mobile3 ? cell.row.original.mobile3 : ""}</>
      },
      {
        accessorKey: 'city',
        header: 'City',
        filterVariant: 'multi-select',
        size: 120,
        Cell: (cell) => <>{cell.row.original.city ? cell.row.original.city : ""}</>,
        filterSelectOptions: refers && refers.map((i) => {
          return i.city;
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'state',
        header: 'State',
        filterVariant: 'multi-select',
        size: 120,
        Cell: (cell) => <>{cell.row.original.state ? cell.row.original.state : ""}</>,
        filterSelectOptions: refers && refers.map((i) => {
          return i.state;
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'gst',
        header: 'GST',
        size: 120,
        Cell: (cell) => <>{cell.row.original.gst ? cell.row.original.gst : ""}</>
      },

      {
        accessorKey: 'address',
        header: 'Address',
        size: 120,
        Cell: (cell) => <>{cell.row.original.address ? cell.row.original.address : ""}</>
      },

      {
        accessorKey: 'created_at',
        header: 'Created on',
        size: 120,
        Cell: (cell) => <>{cell.row.original.created_at ? cell.row.original.created_at : ""}</>
      },

      {
        accessorKey: 'created_by.label',
        header: 'Creator',
        size: 120,
        Cell: (cell) => <>{cell.row.original.created_by.label ? cell.row.original.created_by.label : ""}</>
      }
    ],
    [refers],
    //end
  );


  const table = useMaterialReactTable({
    columns,
    data: refers, //10,000 rows       
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
      sx: { height: table.table.getState().isFullScreen ? 'auto' : '400px' }
    }),
    muiTableHeadRowProps: () => ({
      sx: {
        backgroundColor: 'whitesmoke',
        color: 'white',
        border: '1px solid lightgrey;',
      },
    }),
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
    enableTableFooter: true,
    enableRowVirtualization: true,
    state: { isLoading, sorting },
    enableBottomToolbar: false,
    enableGlobalFilter: false,
    manualPagination: true
  });
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
          Refers
        </Typography>

        <TextField
          sx={{ width: '50vw' }}
          size="small"
          onChange={(e) => {
            setFilter(e.currentTarget.value)
            setFilterCount(0)
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search sx={{ cursor: 'pointer' }} onClick={() => {
                  refetchFuzzy()
                }} />
              </InputAdornment>
            ),
          }}
          placeholder={`Search Refers`}
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
        <Stack
          direction="row"
        >
          {/* search bar */}
          < Stack direction="row" spacing={2}>
            {LoggedInUser?.assigned_permissions.includes('refer_create') && <UploadRefersExcelButton />}
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
              {LoggedInUser?.assigned_permissions.includes('refer_create') && <MenuItem
                onClick={() => {
                  setChoice({ type: LeadChoiceActions.create_or_edit_refer })
                  setRefer(undefined);
                  setAnchorEl(null)
                }}

              > Add New</MenuItem>}
              {LoggedInUser?.assigned_permissions.includes('refer_export') && < MenuItem onClick={() => ExportToExcel(table.getRowModel().rows.map((row) => { return row.original }), "Exported Data")}

              >Export All</MenuItem>}
              {LoggedInUser?.assigned_permissions.includes('refer_export') && < MenuItem disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} onClick={() => ExportToExcel(table.getSelectedRowModel().rows.map((row) => { return row.original }), "Exported Data")}

              >Export Selected</MenuItem>}

            </Menu >
          </>
        </Stack >
      </Stack >
      <CreateOrEditReferDialog refer={refer} />
      <>
        {
          refer ?
            <>

              <DeleteCrmItemDialog refer={refer ? { id: refer._id, label: refer.name, value: refer.name } : undefined} />
              <AllReferralPageDialog refer={refer} />
              <ViewReferRemarksDialog id={refer._id} />
              <CreateOrEditBillDialog refer={refer} bill={undefined} />
              <ViewRefersBillHistoryDialog id={refer._id} />
            </>
            : null
        }
      </>
      <MaterialReactTable table={table} />
      <DBPagination paginationData={paginationData} refetch={refetch}setPaginationData={setPaginationData} />
    </>

  )

}

