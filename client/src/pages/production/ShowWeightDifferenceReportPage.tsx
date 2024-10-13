import { Box, Button, LinearProgress, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { UserContext } from '../../contexts/userContext'
import ExportToExcel from '../../utils/ExportToExcel'
import { MaterialReactTable, MRT_ColumnDef, MRT_RowVirtualizer, MRT_SortingState, useMaterialReactTable } from 'material-react-table'
import { onlyUnique } from '../../utils/UniqueArray'
import moment from 'moment'
import { GetShoeWeightDiffReportDto } from '../../dtos/production/production.dto'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { GetShoeWeightDiffReports } from '../../services/ProductionServices'


export default function ShowWeightDifferenceReportPage() {
  const [reports, setReports] = useState<GetShoeWeightDiffReportDto[]>([])
  const { user } = useContext(UserContext)
  const [dates, setDates] = useState<{ start_date?: string, end_date?: string }>({
    start_date: moment(new Date()).format("YYYY-MM-DD")
    , end_date: moment(new Date().setDate(new Date().getDate() + 1)).format("YYYY-MM-DD")
  })
  const { data, isLoading, isSuccess } = useQuery<AxiosResponse<GetShoeWeightDiffReportDto[]>, BackendError>(["shoeweight_diffreports", dates.start_date, dates.end_date], async () => GetShoeWeightDiffReports({ start_date: dates.start_date, end_date: dates.end_date }))

  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
  const columns = useMemo<MRT_ColumnDef<GetShoeWeightDiffReportDto>[]>(
    //column definitions...
    () => reports && [
      {
        accessorKey: 'date',
        size: 140,
        header: 'Date',
        filterVariant: 'multi-select',
        filterSelectOptions: reports && reports.map((i) => { return i.date.toString() }).filter(onlyUnique)
      },
      {
        accessorKey: 'dye_no',
        size: 140,
        header: 'Dye',
        aggregationFn: 'count',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        filterVariant: 'multi-select',
        filterSelectOptions: reports && reports.map((i) => {
          if (i.dye_no)
            return i.dye_no.toString()
          else return ""
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'article',
        size: 140,
        header: 'Article',
        aggregationFn: 'count',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        filterVariant: 'multi-select',
        filterSelectOptions: reports && reports.map((i) => {
          if (i.article)
            return i.article.toString()
          else return ""
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'size',
        size: 140,
        header: 'Size',
        aggregationFn: 'count',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        filterVariant: 'multi-select',
        filterSelectOptions: reports && reports.map((i) => {
          if (i.size)
            return i.size.toString()
          else return ""
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'st_weight',
        size: 140,
        header: 'St Weight',
        aggregationFn: 'count',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        filterVariant: 'multi-select',
        filterSelectOptions: reports && reports.map((i) => {
          if (i.st_weight)
            return i.st_weight.toString()
          else return ""
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'machine',
        size: 140,
        header: 'Machine',
        aggregationFn: 'count',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        filterVariant: 'multi-select',
        filterSelectOptions: reports && reports.map((i) => {
          if (i.machine)
            return i.machine.toString()
          else return ""
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'w1',
        size: 140,
        header: 'Weight1',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
      },
      {
        accessorKey: 'u1',
        size: 140,
        header: 'Upper1',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
      },
      {
        accessorKey: 'd1',
        size: 140,
        header: 'Diff-1',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
      },
      {
        accessorKey: 'w2',
        size: 140,
        header: 'Weight2',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
      },
      {
        accessorKey: 'u2',
        size: 140,
        header: 'Upper2',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
      },
      {
        accessorKey: 'd2',
        size: 140,
        header: 'Diff-2',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
      },
      {
        accessorKey: 'w3',
        size: 140,
        header: 'Weight3',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
      },
      {
        accessorKey: 'u3',
        size: 140,
        header: 'Upper3',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
      },
      {
        accessorKey: 'd3',
        size: 140,
        header: 'Diff-3',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
      },
      {
        accessorKey: 'person',
        size: 140,
        header: 'Person',
        aggregationFn: 'count',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        filterVariant: 'multi-select',
        filterSelectOptions: reports && reports.map((i) => {
          if (i.person)
            return i.person.toString()
          else return ""
        }).filter(onlyUnique)
      }
    ],
    [reports],
    //end
  );

  useEffect(() => {
    if (isSuccess && data) {
      setReports(data.data);
    }
  }, [isSuccess]);

  const table = useMaterialReactTable({
    columns,
    data: reports, //10,000 rows       
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
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        {user?.assigned_permissions.includes("shoe_weight_report_export") && <Button
          //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
          onClick={() => {
            ExportToExcel(table.getRowModel().rows.map((row) => { return row.original }), "shoe_weight_difference")
          }}
          startIcon={<FileDownloadIcon />}
        >
          Export All Data
        </Button>}


        {user?.assigned_permissions.includes("shoe_weight_report_export") && <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          //only export selected rows
          onClick={() => ExportToExcel(table.getSelectedRowModel().rows.map((row) => { return row.original }), "shoe_weight_difference")}
          startIcon={<FileDownloadIcon />}
        >
          Export Selected Rows
        </Button>}
      </Box>
    ),
    muiTableBodyCellProps: () => ({
      sx: {
        border: '1px solid #c2beba;',
        fontSize: '13px'
      },
    }),
    muiPaginationProps: {
      rowsPerPageOptions: [100, 200, 500, 1000, 2000, 5000, 7000, 10000],
      shape: 'rounded',
      variant: 'outlined',
    },
    initialState: {
      density: 'compact', pagination: { pageIndex: 0, pageSize: 7000 }
    },
    enableGrouping: true,
    enableRowSelection: true,
    manualPagination: false,
    enablePagination: true,
    enableRowNumbers: true,
    enableColumnPinning: true,
    enableTableFooter: true,
    enableRowVirtualization: true,
    rowVirtualizerInstanceRef, //optional
    rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
    columnVirtualizerOptions: { overscan: 2 }, //optionally customize the column virtualizer
    onSortingChange: setSorting,
    state: { isLoading, sorting }
  });
  useEffect(() => {
    //scroll to the top of the table when the sorting changes
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting]);
  return (
    <>
      {
        isLoading && <LinearProgress />
      }


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
          Show Weight Difference
        </Typography>
        <Stack direction="row" gap={2}>
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
        </Stack>
      </Stack >

      <MaterialReactTable table={table} />
    </>

  )

}

