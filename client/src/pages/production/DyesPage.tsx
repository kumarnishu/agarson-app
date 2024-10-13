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
import { GetDyeDto } from '../../dtos/production/production.dto'
import { GetDyes } from '../../services/ProductionServices'
import UploadDyesFromExcelButton from '../../components/buttons/UploadDyesButton'
import ToogleDyeDialog from '../../components/dialogs/production/ToogleDyeDialog'
import CreateOrEditDyeDialog from '../../components/dialogs/production/CreateOrEditDyeDialog'



export default function DyePage() {
  const [dye, setDye] = useState<GetDyeDto>()
  const [dyes, setDyes] = useState<GetDyeDto[]>([])
  const [hidden, setHidden] = useState(false)
  const { user: LoggedInUser } = useContext(UserContext)
  const { data, isLoading, isSuccess } = useQuery<AxiosResponse<GetDyeDto[]>, BackendError>(["dyes", hidden], async () => GetDyes(String(hidden)))

  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const columns = useMemo<MRT_ColumnDef<GetDyeDto>[]>(
    //column definitions...
    () => dyes && [
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

                {LoggedInUser?.assigned_permissions.includes('dye_edit') && <Tooltip title="Toogle">
                  <IconButton color="primary"

                    onClick={() => {
                      setDye(cell.row.original)
                      setChoice({ type: ProductionChoiceActions.toogle_dye })

                    }}
                  >
                    <RestartAlt />
                  </IconButton>
                </Tooltip>}

                {LoggedInUser?.assigned_permissions.includes('dye_edit') && <Tooltip title="edit">
                  <IconButton

                    onClick={() => {
                      setDye(cell.row.original)
                      setChoice({ type: ProductionChoiceActions.create_or_edit_dye })
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
        accessorKey: 'active',
        header: 'Status',
        size: 120,
        filterVariant: 'multi-select',
        Cell: (cell) => <>{cell.row.original.active ? "active" : "inactive"}</>,
        filterSelectOptions: dyes && dyes.map((i) => {
          return i.active ? "active" : "inactive";
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'dye_number',
        header: 'Dye',
        size: 120,
        filterVariant: 'multi-select',
        Cell: (cell) => <>{cell.row.original.dye_number.toString() || "" ? cell.row.original.dye_number.toString() || "" : ""}</>,
        filterSelectOptions: dyes && dyes.map((i) => {
          return i.dye_number.toString() || "";
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'size',
        header: 'Size',
        size: 200,
        filterVariant: 'multi-select',
        Cell: (cell) => <>{cell.row.original.size ? cell.row.original.size : ""}</>,
        filterSelectOptions: dyes && dyes.map((i) => {
          return i.size;
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'articles',
        header: 'Articles',
        size: 720,
        filterVariant: 'multi-select',
        Cell: (cell) => <>{cell.row.original.articles.toString() ? cell.row.original.articles.map((a) => { return a.value }).toString() : ""}</>,
        filterSelectOptions: dyes && dyes.map((i) => {
          return i.articles.toString();
        }).filter(onlyUnique)
      }
    ],
    [dyes],
    //end
  );


  const table = useMaterialReactTable({
    columns,
    data: dyes, //10,000 rows       
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
    enableRowNumbers: true,
    enableColumnPinning: true,
    enableTableFooter: true,
    enableRowVirtualization: true,
    onSortingChange: setSorting,
    state: { isLoading, sorting }
  });


  useEffect(() => {
    if (isSuccess) {
      setDyes(data.data);
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
          Dyes
        </Typography>
        <Stack
          spacing={2}
          padding={1}
          direction="row"
          justifyContent="space-between"
          alignItems={'end'}
        >
          {LoggedInUser?.assigned_permissions.includes('dye_create') &&
            < UploadDyesFromExcelButton />}
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
            {LoggedInUser?.assigned_permissions.includes("dye_create") && <MenuItem
              onClick={() => {
                setDye(undefined)
                setAnchorEl(null)
                setChoice({ type: ProductionChoiceActions.create_or_edit_dye })
              }}

            > Add New</MenuItem>}
            {LoggedInUser?.assigned_permissions.includes('dye_export') && < MenuItem onClick={() => ExportToExcel(table.getRowModel().rows.map((row) => { return row.original }), "Exported Data")}

            >Export All</MenuItem>}
            {LoggedInUser?.assigned_permissions.includes('dye_export') && < MenuItem disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} onClick={() => ExportToExcel(table.getSelectedRowModel().rows.map((row) => { return row.original }), "Exported Data")}

            >Export Selected</MenuItem>}

          </Menu >
        </Stack>

        <CreateOrEditDyeDialog dye={dye} />
        {
          dye ?
            <>
              <ToogleDyeDialog dye={dye} />
            </>
            : null
        }
      </Stack >

      {/* table */}
      <MaterialReactTable table={table} />
    </>

  )

}

