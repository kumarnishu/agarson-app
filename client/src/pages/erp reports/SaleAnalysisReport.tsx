import {  LinearProgress, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { GetSaleAnalysisReports } from '../../services/ErpServices'
import { MaterialReactTable, MRT_ColumnDef, MRT_RowVirtualizer, MRT_SortingState, useMaterialReactTable } from 'material-react-table'
import { onlyUnique } from '../../utils/UniqueArray'
import { toTitleCase } from '../../utils/TitleCase'
import { months } from '../../utils/months'
import { GetSaleAnalysisReportDto } from '../../dtos/erp reports/erp.reports.dto'



export default function SaleAnalysisReport() {
  const [reports, setReports] = useState<GetSaleAnalysisReportDto[]>([])
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const { data, isLoading, isSuccess } = useQuery<AxiosResponse<GetSaleAnalysisReportDto[]>, BackendError>(["sale_analysis_reports", month], async () => GetSaleAnalysisReports(month))
  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const columns = useMemo<MRT_ColumnDef<GetSaleAnalysisReportDto>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'state',
        header: 'State',
        width: '50',
        filterVariant: 'multi-select',
        aggregationFn: 'count',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        filterSelectOptions: reports.map((i) => { return i.state }).filter(onlyUnique)
      },
      {
        accessorKey: 'monthly_target',
        header: 'MONTHLY TARGET', 
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.monthly_target) }, 0).toFixed(2)}</b>
      },
      {
        accessorKey: 'monthly_achivement',
        header: 'MONTHLY ACHIVEMENT',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.monthly_achivement) }, 0).toFixed(2)}</b>
      },
      {
        accessorKey: 'monthly_percentage',
        header: 'MONTHLY PERCENTAGE',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.monthly_percentage) }, 0).toFixed(2)}</b>
      },
      {
        accessorKey: 'annual_target',
        header: 'ANNUAL TARGET',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.annual_target) }, 0).toFixed(2)}</b>
      },
      {
        accessorKey: 'annual_achivement',
        header: 'ANNUAL ACHIVEMENT',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.annual_achivement) }, 0).toFixed(2)}</b>
      },
      {
        accessorKey: 'annual_percentage',
        header: 'ANNUAL PERCENTAGE',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.annual_percentage) }, 0).toFixed(2)}</b>
      },
      {
        accessorKey: 'last_year_sale',
        header: 'LAST YEAR SALE',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
         Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.last_year_sale) }, 0).toFixed(2)}</b>},
      {
        accessorKey: 'last_year_sale_percentage_comparison',
        header: 'LAST YEAR PERCENTAGE COMPARISON',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
         Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.last_year_sale_percentage_comparison) }, 0).toFixed(2)}</b>
      }
    ],
    [reports,],
    //end
  );


  useEffect(() => {
    if (typeof window !== 'undefined' && isSuccess) {
      setReports(data.data);
    }
  }, [isSuccess]);

  useEffect(() => {
    //scroll to the top of the table when the sorting changes
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting]);

  const table = useMaterialReactTable({
    columns,
    data: reports, //10,000 rows
    defaultDisplayColumn: { enableResizing: true },
    enableBottomToolbar: false,
    enableColumnResizing: true,
    enableColumnVirtualization: true,
    muiTableHeadRowProps: () => ({
      sx: {
        backgroundColor: 'whitesmoke',
        color: 'white'
      },
    }),
    muiTableFooterRowProps:()=>({
      sx: {
        backgroundColor: 'whitesmoke',
        color: 'white',
        paddingBottom:2
      }
    }),
    muiTableBodyCellProps: () => ({
      sx: {
        fontSize: '13px',
        border: '1px solid #ddd;'
      },
    }), initialState: { density: 'compact' },
    enableGrouping: true,
    enableRowSelection: true, enableStickyFooter: true,
    enableGlobalFilterModes: true,
    enablePagination: false,
    enableColumnPinning: true,
    enableTableFooter: true,
    enableRowNumbers: true,
    enableRowVirtualization: true,
    muiTableContainerProps: { sx: { maxHeight: '450px' } },
    onSortingChange: setSorting,
    state: { isLoading, sorting },
    rowVirtualizerInstanceRef, //optional
    rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
    columnVirtualizerOptions: { overscan: 2 }, //optionally customize the column virtualizer
  });


  return (
    <>

      {
        isLoading && <LinearProgress />
      }


      <Stack
        spacing={4}
        padding={2}
        direction="row"
        justifyContent="space-between"
        alignItems={'center'}
      >
        <Typography
          variant={'h6'}
          component={'h1'}
          sx={{ pl: 1 }}
        >
          Sale Analysis {new Date().getMonth() < 3 ? `${new Date().getFullYear() - 1}-${new Date().getFullYear()}` : `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`}
        </Typography>
        < TextField
          select
          SelectProps={{
            native: true
          }}
          focused
          size='small'
          id="month"
          label="Month"
          sx={{width:'50%'}}
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          <option key={0} value={undefined}>
            Select Month
          </option>
          {
            months.map(month => {
              return (<option key={month.month} value={month.month}>
                {toTitleCase(month.label)}
              </option>)
            })
          }
        </TextField>
        <Stack direction={'row'} gap={2} alignItems={'center'}>
         
        </Stack>


      </Stack >
     
        {/* table */}
        {!isLoading && data && <MaterialReactTable table={table} />}
    </>

  )

}

