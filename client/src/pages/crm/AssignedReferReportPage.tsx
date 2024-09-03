import { Box, LinearProgress, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { MaterialReactTable, MRT_ColumnDef, MRT_RowVirtualizer, MRT_SortingState, useMaterialReactTable } from 'material-react-table'
import { onlyUnique } from '../../utils/UniqueArray'
import moment from 'moment'
import { GetAssignedRefers } from '../../services/LeadsServices'
import { GetAssignedReferDto } from '../../dtos/crm/crm.dto'


export default function AssignedReferReportPage() {
  const [reports, setReports] = useState<GetAssignedReferDto[]>([])
  const [dates, setDates] = useState<{ start_date?: string, end_date?: string }>({
    start_date: moment(new Date().setDate(1)).format("YYYY-MM-DD")
    , end_date: moment(new Date().setDate(31)).format("YYYY-MM-DD")
  })

  const { data, isLoading, isSuccess } = useQuery<AxiosResponse<GetAssignedReferDto[]>, BackendError>(["assign_refer_reports", dates.start_date, dates.end_date], async () => GetAssignedRefers({ start_date: dates.start_date, end_date: dates.end_date }))

  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const columns = useMemo<MRT_ColumnDef<GetAssignedReferDto>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'lead.value',
        header: 'Lead',
        size: 350,
        filterVariant: 'multi-select',
        filterSelectOptions: reports.map((i) => { return i.lead.label }).filter(onlyUnique)

      },
      {
        accessorKey: 'remark',
        header: 'Remark',
        size: 350,
        filterVariant: 'multi-select',
        filterSelectOptions: reports.map((i) => { return i.remark }).filter(onlyUnique)
      },
      {
        accessorKey: 'lead_mobile1',
        header: 'Mobile1',
        size: 300,
        filterVariant: 'multi-select',
        filterSelectOptions: reports.map((i) => { return i.lead_mobile1 }).filter(onlyUnique)

      },
      {
        accessorKey: 'lead_mobile2',
        header: 'Mobile2',
        size: 300,
        filterVariant: 'multi-select',
        filterSelectOptions: reports.map((i) => { return i.lead_mobile2 }).filter(onlyUnique)

      },
      {
        accessorKey: 'lead_mobile3',
        header: 'Mobile3',
        size: 300,
        filterVariant: 'multi-select',
        filterSelectOptions: reports.map((i) => { return i.lead_mobile3 }).filter(onlyUnique)

      },
      {
        accessorKey: 'refer.value',
        header: 'Refer Party',
        size: 300,
        filterVariant: 'multi-select',
        filterSelectOptions: reports.map((i) => { return i.refer?.value || "" }).filter(onlyUnique)
      },
      {
        accessorKey: 'refer_mobile1',
        header: 'Refer Mobile',
        filterVariant: 'multi-select',
        filterSelectOptions: reports.map((i) => { return i.refer_mobile1 || "" }).filter(onlyUnique)
      },
      {
        accessorKey: 'refer_mobile2',
        header: 'Refer Mobile',
        filterVariant: 'multi-select',
        filterSelectOptions: reports.map((i) => { return i.refer_mobile2 || "" }).filter(onlyUnique)
      },
      {
        accessorKey: 'refer_mobile3',
        header: 'Refer Mobile2',
        filterVariant: 'multi-select',
        filterSelectOptions: reports.map((i) => { return i.refer_mobile3 || "" }).filter(onlyUnique)
      },
      {
        accessorKey: 'refer_date',
        header: 'Refer Date',
        filterVariant: 'multi-select',
        //@ts-ignore
        Cell: (val) => <span>{moment(val.cell.getValue()).format("DD/MM/YYYY")}</span>,
        filterSelectOptions: reports.map((i) => { return moment(i.refer_date).format("DD/MM/YYYY") }).filter(onlyUnique)
      }
    ],
    [reports],
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
    muiTableBodyCellProps: () => ({
      sx: {
        border: '1px solid #ddd;'
      },
    }),
    initialState: { density: 'compact' },
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
          Assigned Refers : {reports && reports.length}
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
      <Box sx={{
        overflow: "auto",
        height: '80vh'
      }}
      >
        {/* table */}
        {!isLoading && data && <MaterialReactTable table={table} />}
      </Box>
    </>

  )

}

