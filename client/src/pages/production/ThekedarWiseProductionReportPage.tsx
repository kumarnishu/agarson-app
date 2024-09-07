import {  LinearProgress, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { MaterialReactTable, MRT_ColumnDef, MRT_RowVirtualizer, MRT_SortingState, useMaterialReactTable } from 'material-react-table'
import { IColumnRowData } from '../../types/production.types'
import moment from 'moment'
import { GetproductionThekedarWise } from '../../services/ProductionServices'
import { onlyUnique } from '../../utils/UniqueArray'


export default function ThekedarWiseProductionReportPage() {
  const [reports, setReports] = useState<IColumnRowData['rows']>([])
  const [reportcolumns, setReportColumns] = useState<IColumnRowData['columns']>([])
  const [dates, setDates] = useState<{ start_date?: string, end_date?: string }>({
    start_date: moment(new Date().setDate(1)).format("YYYY-MM-DD")
    , end_date: moment(new Date().setDate(31)).format("YYYY-MM-DD")
  })
  const { data, isLoading, isSuccess } = useQuery<AxiosResponse<IColumnRowData>, BackendError>(["thekedarwisereports", dates.start_date, dates.end_date], async () => GetproductionThekedarWise({ start_date: dates.start_date, end_date: dates.end_date }))

  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);


  const columns = useMemo<MRT_ColumnDef<IColumnRowData['columns']>[]>(
    () => reportcolumns && reportcolumns.map((item) => {
      if (item.type == "string")
        return { accessorKey: item.key, header: item.header, Footer: "" }
      if (item.type == "date")
        return {
          accessorKey: item.key, header: item.header, Footer: <b>Total</b>,
          filterVariant: 'multi-select', filterSelectOptions: reports && reports.map((i) => { return i['date'].toString() }).filter(onlyUnique)
}
      return {
        accessorKey: item.key, header: item.header,
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        //@ts-ignore
        Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original[item.key]) }, 0).toFixed()}</b>
      }
    })
    ,
    [reports, reportcolumns],
    //end
  );

  useEffect(() => {
    if ( isSuccess) {
      setReports(data.data.rows);
      setReportColumns(data.data.columns)
    }
  }, [isSuccess]);

 

  const table = useMaterialReactTable({
    //@ts-ignore
    columns,
    //@ts-ignore
    data: reports, //10,000 rows
    defaultDisplayColumn: { enableResizing: true },
    enableBottomToolbar: false,
    enableColumnResizing: true,
    enableColumnVirtualization: true, enableStickyFooter: true,
    muiTableFooterRowProps: () => ({
      sx: {
        backgroundColor: 'whitesmoke',
        color: 'white',
        paddingBottom: 2
      }
    }),
    muiTableHeadRowProps: () => ({
      sx: {
        backgroundColor: 'whitesmoke',
        color: 'white'
      },
    }),
    muiTableBodyCellProps: () => ({
      sx: {
        fontSize: '13px',
        border: '1px solid #ddd;'
      },
    }),
    initialState: { density: 'comfortable' },
    enableGrouping: true,
    enableRowSelection: true,
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

  console.log(columns)
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
          Thekedar Wise
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
    
        {/* table */}
        {!isLoading && data && <MaterialReactTable table={table} />}
    </>

  )

}

