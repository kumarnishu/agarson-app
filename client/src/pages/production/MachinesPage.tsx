import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { MaterialReactTable, MRT_ColumnDef, MRT_SortingState, useMaterialReactTable } from 'material-react-table'
import { onlyUnique } from '../../utils/UniqueArray'
import { UserContext } from '../../contexts/userContext'
import { ChoiceContext, ProductionChoiceActions } from '../../contexts/dialogContext'
import { Edit, RestartAlt } from '@mui/icons-material'
import { Fade, FormControlLabel, IconButton, Menu, MenuItem, Switch, Tooltip, Typography } from '@mui/material'
import PopUp from '../../components/popup/PopUp'
import ExportToExcel from '../../utils/ExportToExcel'
import { Menu as MenuIcon } from '@mui/icons-material';
import { GetMachineDto } from '../../dtos/production/production.dto'
import { GetMachines } from '../../services/ProductionServices'
import UploadMachinesFromExcelButton from '../../components/buttons/UploadMachinesButton'
import CreateOrEditMachineDialog from '../../components/dialogs/production/CreateOrEditMachineDialog'
import ToogleMachineDialog from '../../components/dialogs/production/ToogleMachineDialog'



export default function MachinePage() {
  const [machine, setMachine] = useState<GetMachineDto>()
  const [machines, setMachines] = useState<GetMachineDto[]>([])
  const [hidden, setHidden] = useState(false)
  const { user: LoggedInUser } = useContext(UserContext)
  const { data, isLoading, isSuccess } = useQuery<AxiosResponse<GetMachineDto[]>, BackendError>(["machines", hidden], async () => GetMachines(String(hidden)))

  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const columns = useMemo<MRT_ColumnDef<GetMachineDto>[]>(
    //column definitions...
    () => machines && [
      {
        accessorKey: 'actions',
        header: '',
        maxSize: 50,
        enableColumnFilter: false,
        size: 120,
        Cell: ({ cell }) => <PopUp
          element={
            <Stack direction="row">
              <>

                {LoggedInUser?.assigned_permissions.includes('machine_edit') && <Tooltip title="Toogle">
                  <IconButton color="primary"

                    onClick={() => {
                      setMachine(cell.row.original)
                      setChoice({ type: ProductionChoiceActions.toogle_machine })

                    }}
                  >
                    <RestartAlt />
                  </IconButton>
                </Tooltip>}

                {LoggedInUser?.assigned_permissions.includes('machine_edit') && <Tooltip title="edit">
                  <IconButton

                    onClick={() => {
                      setMachine(cell.row.original)
                      setChoice({ type: ProductionChoiceActions.create_or_edit_machine })
                    }}

                  >
                    <Edit />
                  </IconButton>
                </Tooltip>}

              </>

            </Stack>}
        />
      },
      {
        accessorKey: 'serialno',
        header: 'Serial No',
        size: 120,
        filterVariant: 'multi-select',
        Cell: (cell) => <>{cell.row.original.serial_no.toString() || "" ? cell.row.original.serial_no.toString() || "" : ""}</>,
        filterSelectOptions: machines && machines.map((i) => {
          return i.serial_no.toString() || "";
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'active',
        header: 'Status',
        size: 120,
        filterVariant: 'multi-select',
        Cell: (cell) => <>{cell.row.original.active ? "active" : "inactive"}</>,
        filterSelectOptions: machines && machines.map((i) => {
          return i.active ? "active" : "inactive";
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 220,
        filterVariant: 'multi-select',
        Cell: (cell) => <>{cell.row.original.name ? cell.row.original.name : ""}</>,
        filterSelectOptions: machines && machines.map((i) => {
          return i.name;
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'display_name',
        header: 'Display Name',
        size: 220,
        filterVariant: 'multi-select',
        Cell: (cell) => <>{cell.row.original.display_name ? cell.row.original.display_name : ""}</>,
        filterSelectOptions: machines && machines.map((i) => {
          return i.display_name;
        }).filter(onlyUnique)
      },


      {
        accessorKey: 'category',
        header: 'Category',
        size: 220,
        filterVariant: 'multi-select',
        Cell: (cell) => <>{cell.row.original.category ? cell.row.original.category : ""}</>,
        filterSelectOptions: machines && machines.map((i) => {
          return i.category;
        }).filter(onlyUnique)
      }
    ],
    [machines],
    //end
  );


  const table = useMaterialReactTable({
    columns,
    data: machines, //10,000 rows       
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
      sx: { height: table.table.getState().isFullScreen ? 'auto' : '62vh' }
    }),
    muiTableHeadRowProps: () => ({
      sx: {
        backgroundColor: 'whitesmoke',
        color: 'white'
      },
    }),
    muiTableBodyCellProps: () => ({
      sx: {
        border: '1px solid #c2beba;',
        fontSize: '13px'
      },
    }),
    muiPaginationProps: {
      rowsPerPageOptions: [100, 200, 500, 1000, 2000],
      shape: 'rounded',
      variant: 'outlined',
    },
    initialState: {
      density: 'compact', showGlobalFilter: true, pagination: { pageIndex: 0, pageSize: 500 }
    },
    enableGrouping: true,
    enableRowSelection: true,
    manualPagination: false,
    enablePagination: true,
    //enableRowNumbers: true,
    enableColumnPinning: true,
    enableTableFooter: true,
    enableRowVirtualization: true,
    onSortingChange: setSorting,
    state: { isLoading, sorting }
  });


  useEffect(() => {
    if (isSuccess) {
      setMachines(data.data);
    }
  }, [data, isSuccess]);


  return (
    <>


      <Stack
        spacing={2}
        padding={1}
        direction="row"
        justifyContent="space-between"
        alignItems={'center'}
      >
        <Typography
          variant={'h6'}
          component={'h1'}
          sx={{ pl: 1 }}
        >
          Machines
        </Typography>
        <Stack
          spacing={2}
          padding={1}
          direction="row"
          justifyContent="space-between"
          alignItems={'end'}
        >
          {LoggedInUser?.assigned_permissions.includes('machine_create') &&
            < UploadMachinesFromExcelButton />}
          <FormControlLabel control={<Switch
            defaultChecked={Boolean(hidden)}
            onChange={() => setHidden(!hidden)}
          />} label="Show Inactive" />
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
            {LoggedInUser?.assigned_permissions.includes("machine_create") && <MenuItem
              onClick={() => {
                setMachine(undefined)
                setAnchorEl(null)
                setChoice({ type: ProductionChoiceActions.create_or_edit_machine })
              }}

            > Add New</MenuItem>}
            {LoggedInUser?.assigned_permissions.includes('machine_export') && < MenuItem onClick={() => ExportToExcel(table.getRowModel().rows.map((row) => { return row.original }), "Exported Data")}

            >Export All</MenuItem>}
            {LoggedInUser?.assigned_permissions.includes('machine_export') && < MenuItem disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} onClick={() => ExportToExcel(table.getSelectedRowModel().rows.map((row) => { return row.original }), "Exported Data")}

            >Export Selected</MenuItem>}

          </Menu >
        </Stack>

        <CreateOrEditMachineDialog machine={machine} />
        {
          machine ?
            <>
              <ToogleMachineDialog machine={machine} />
            </>
            : null
        }
      </Stack >

      {/* table */}
      <MaterialReactTable table={table} />
    </>

  )

}

