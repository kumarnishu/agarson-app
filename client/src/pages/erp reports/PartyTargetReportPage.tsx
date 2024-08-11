import { Box, Button, LinearProgress, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import {   GetPartyTargetReports } from '../../services/ErpServices'
import { UserContext } from '../../contexts/userContext'
import { Download } from '@mui/icons-material'
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import { MaterialReactTable, MRT_ColumnDef, MRT_RowVirtualizer, MRT_SortingState, useMaterialReactTable } from 'material-react-table'
import { onlyUnique } from '../../utils/UniqueArray'
import UploadPartyTargetButton from '../../components/buttons/UploadPartyTargetButton'


export type IPartyTargetReportTemplate = {
    slno: string,
    PARTY: string,
    Create_Date: string,
    STATION: string,
    SALES_OWNER: string,
    report_owner: string
    All_TARGET: string,
    TARGET: number,
    PROJECTION: number,
    GROWTH: number,
    TARGET_ACHIEVE: number,
    TOTAL_SALE_OLD: number,
    TOTAL_SALE_NEW: number,
    Last_Apr: number,
    Cur_Apr: number,
    Last_May: number,
    Cur_May: number,
    Last_Jun: number,
    Cur_Jun: number,
    Last_Jul: number,
    Cur_Jul: number,
    Last_Aug: number,
    Cur_Aug: number,
    Last_Sep: number,
    Cur_Sep: number,
    Last_Oct: number,
    Cur_Oct: number,
    Last_Nov: number,
    Cur_Nov: number,
    Last_Dec: number,
    Cur_Dec: number,
    Last_Jan: number,
    Cur_Jan: number,
    Last_Feb: number,
    Cur_Feb: number,
    Last_Mar: number,
    Cur_Mar: number,
    status?: string
}
export default function PartyTargetReportPage() {
    const [reports, setReports] = useState<IPartyTargetReportTemplate[]>([])
    const { user } = useContext(UserContext)
    const [sent, setSent] = useState(false)
    const { data, isLoading, isSuccess } = useQuery<AxiosResponse<IPartyTargetReportTemplate[]>, BackendError>("party_target_reports", GetPartyTargetReports)
    const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
    const [sorting, setSorting] = useState<MRT_SortingState>([]);

    const columns = useMemo<MRT_ColumnDef<IPartyTargetReportTemplate>[]>(
        //column definitions...
        () => [
            {
                accessorKey: 'slno',
                header: 'Sl.No.',
                size: 50,
                aggregationFn: 'count',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                
            },
            {
                accessorKey: 'PARTY',
                header: 'PARTY',
                size: 350,
                filterVariant: 'multi-select',
                filterSelectOptions: reports.map((i) => { return i.PARTY }).filter(onlyUnique),
                aggregationFn: 'count',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'Create_Date',
                header: 'Create Date',
                Footer: <b>Total</b>, 
                filterVariant: 'multi-select',
                filterSelectOptions: reports.map((i) => { return i.PARTY }).filter(onlyUnique),
                aggregationFn: 'count',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                size: 150
            },
            {
                accessorKey: 'STATION',
                header: 'Station',
                filterVariant: 'multi-select',
                aggregationFn: 'count',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                filterSelectOptions: reports.map((i) => { return i.STATION }).filter(onlyUnique)
            },
            {
                accessorKey: 'SALES_OWNER',
                header: 'Sales Owner',
                filterVariant: 'multi-select',
                aggregationFn: 'count',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                filterSelectOptions: reports.map((i) => { return i.SALES_OWNER }).filter(onlyUnique)
            },
            {
                accessorKey: 'report_owner',
                header: 'State',
                filterVariant: 'multi-select',
                aggregationFn: 'count',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                filterSelectOptions: reports.map((i) => { return i.report_owner }).filter(onlyUnique)
            },
            {
                accessorKey: 'All_TARGET',
                header: 'ALL TARGET',
                aggregationFn: 'count',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'TARGET',
                header: 'TARGET',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => {return Number(a) + Number(b.original.TARGET)}, 0).toFixed()}</b>
            },
            {
                accessorKey: 'PROJECTION',
                header: 'Projection',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.PROJECTION) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'GROWTH',
                header: 'Growth',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.GROWTH) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'TARGET_ACHIEVE',
                header: 'Target Achieved',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.TARGET_ACHIEVE) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'TOTAL_SALE_OLD',
                header: 'Total Old Sale',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.TOTAL_SALE_OLD) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'TOTAL_SALE_NEW',
                header: 'Total Sale New',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.TOTAL_SALE_NEW) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Last_Apr',
                header: 'L-Apr',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Last_Apr) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Cur_Apr',
                header: 'C-APr',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Cur_Apr) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Last_May',
                header: 'L-May',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Last_May) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Cur_May',
                header: 'C-MAY',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Cur_May) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Last_Jun',
                header: 'L-JUN',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Last_Jun) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Cur_Jun',
                header: 'C-JUN',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Cur_Jun) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Last_Jul',
                header: 'L-JUL',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Last_Jul) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Cur_Jul',
                header: 'C-JUL',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Cur_Jul) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Last_Aug',
                header: 'L-AUG',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Last_Aug) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Cur_Aug',
                header: 'C-AUG',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Cur_Aug) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Last_Sep',
                header: 'L-SEP',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Last_Sep) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Cur_Sep',
                header: 'C-SEP',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Cur_Sep) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Last_Oct',
                header: 'L-OCT',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Last_Oct) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Cur_Oct',
                header: 'C-OCT',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Cur_Oct) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Last_Nov',
                header: 'L-NOV',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Last_Nov) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Cur_Nov',
                header: 'C-NOV',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Cur_Nov) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Last_Dec',
                header: 'L-DEC',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Last_Dec) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Cur_Dec',
                header: 'C-DEC',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Cur_Dec) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Last_Jan',
                header: 'L-JAN',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Last_Jan) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Cur_Jan',
                header: 'C-JAN',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Cur_Jan) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Last_Feb',
                header: 'L-FEB',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Last_Feb) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Cur_Feb',
                header: 'C-FEB',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Cur_Feb) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Last_Mar',
                header: 'L-MAR',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Last_Mar) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'Cur_Mar',
                header: 'C-,MAR',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.Cur_Mar) }, 0).toFixed()}</b>
            },
        ],
        [reports,],
        //end
    );


    function handleExcel() {
        try {
            let data: IPartyTargetReportTemplate[] = [
                {
                    slno: "1",
                    PARTY: "agarson shoes",
                    Create_Date: "20-07-2024",
                    STATION: "DELHI",
                    SALES_OWNER: "DELHI",
                    report_owner: "DELHI",
                    All_TARGET: "",
                    TARGET: 0,
                    PROJECTION: 0,
                    GROWTH: 0,
                    TARGET_ACHIEVE: 0,
                    TOTAL_SALE_OLD: 0,
                    TOTAL_SALE_NEW: 0,
                    Last_Apr: 0,
                    Cur_Apr: 0,
                    Last_May: 0,
                    Cur_May: 0,
                    Last_Jun: 0,
                    Cur_Jun: 0,
                    Last_Jul: 0,
                    Cur_Jul: 0,
                    Last_Aug: 0,
                    Cur_Aug: 0,
                    Last_Sep: 0,
                    Cur_Sep: 0,
                    Last_Oct: 0,
                    Cur_Oct: 0,
                    Last_Nov: 0,
                    Cur_Nov: 0,
                    Last_Dec: 0,
                    Cur_Dec: 0,
                    Last_Jan: 0,
                    Cur_Jan: 0,
                    Last_Feb: 0,
                    Cur_Feb: 0,
                    Last_Mar: 0,
                    Cur_Mar: 0,
                }
            ]
            ExportToExcel(data, "party_target_template")
            setSent(true)
        }
        catch (err) {
            console.log(err)
            setSent(false)
        }
    }

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
        initialState: { density: 'compact' },
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
        enableGrouping: true,
        enableRowSelection: true,
        enableGlobalFilterModes: true,
        enablePagination: false,
        enableColumnPinning: true,
        enableTableFooter: true,
        enableRowNumbers: false,
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

            {sent && <AlertBar message="File Exported Successfuly" color="success" />}

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
                   PARTY TARGET {new Date().getMonth() < 3 ? `${new Date().getFullYear() - 1}-${new Date().getFullYear()}` : `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`}
                </Typography>
                <Stack direction={'row'} gap={2} alignItems={'center'}>
                  <>
                        {user?.assigned_permissions.includes("party_target_create") &&<UploadPartyTargetButton />}
                        {user?.assigned_permissions.includes("party_target_create") && <Button variant="outlined" startIcon={<Download />} onClick={handleExcel}> Template</Button>}
                    </>
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

