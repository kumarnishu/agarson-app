import {  Button, LinearProgress, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { GetPendingOrdersReports } from '../../services/ErpServices'
import { UserContext } from '../../contexts/userContext'
import { Download } from '@mui/icons-material'
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import { MaterialReactTable, MRT_ColumnDef, MRT_RowVirtualizer, MRT_SortingState, useMaterialReactTable } from 'material-react-table'
import { onlyUnique } from '../../utils/UniqueArray'
import UploadPendingOrdersButton from '../../components/buttons/UploadPendingOrdersButton'


export type IPendingOrdersReportTemplate = {
    report_owner: string
    account: string,
    product_family: string,
    article: string,
    total?:number,
    size5: number,
    size6: number,
    size7: number,
    size8: number,
    size9: number,
    size10: number,
    size11: number,
    size12_24pairs: number,
    size13: number,
    size11x12: number,
    size3: number,
    size4: number,
    size6to10: number,
    size7to10: number,
    size8to10: number,
    size4to8: number,
    size6to9: number,
    size5to8: number,
    size6to10A: number,
    size7to10B: number,
    size6to9A: number,
    size11close: number,
    size11to13: number,
    size3to8: number,
    status?: string,
    created_at?: string,
}
export default function PendingOrdersReport() {
    const [reports, setReports] = useState<IPendingOrdersReportTemplate[]>([])
    const { user } = useContext(UserContext)
    const [sent, setSent] = useState(false)
    const { data, isLoading, isSuccess } = useQuery<AxiosResponse<IPendingOrdersReportTemplate[]>, BackendError>("pending_order_reports", GetPendingOrdersReports)
    const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
    const [sorting, setSorting] = useState<MRT_SortingState>([]);

    const columns = useMemo<MRT_ColumnDef<IPendingOrdersReportTemplate>[]>(
        //column definitions...
        () => [
            {
                accessorKey: 'created_at',
                header: 'Created On',
                filterVariant: 'multi-select',
                filterSelectOptions: reports.map((i) => { return i.created_at || "" }).filter(onlyUnique)
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
                accessorKey: 'account',
                header: 'Account',
                size: 350,
                aggregationFn: 'count',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                filterVariant: 'multi-select',
                filterSelectOptions: reports.map((i) => { return i.account }).filter(onlyUnique)
            },
            {
                accessorKey: 'product_family',
                header: 'Product Family',
                size: 350,
                aggregationFn: 'count',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                filterVariant: 'multi-select',
                filterSelectOptions: reports.map((i) => { return i.product_family }).filter(onlyUnique)
            },

            {
                accessorKey: 'article',
                header: 'Article',
                size: 350,
                aggregationFn: 'count',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                filterVariant: 'multi-select',
                filterSelectOptions: reports.map((i) => { return i.article }).filter(onlyUnique)
            },
            {
                accessorKey: 'total',
                header: 'Total',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.total) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            
            {
                accessorKey: 'size5',
                header: '5',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size5) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size6',
                header: '6',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size6) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size7',
                header: '7',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size7) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size8',
                header: '8',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size8) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size9',
                header: '9',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size9) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size10',
                header: '10',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size10) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size11',
                header: '11',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size11) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size12_24pairs',
                header: '12x24',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size12_24pairs) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size13',
                header: '13',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size13) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size11x12',
                header: '11x12',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size11x12) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size3',
                header: '3',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size3) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size4',
                header: '4',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size4) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size6to10',
                header: '6-10',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size6to10) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size7to10',
                header: '7-10',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size7to10) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size8to10',
                header: '8-10',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size8to10) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size4to8',
                header: '4-8',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size4to8) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size6to9',
                header: '6-9',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size6to9) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size5to8',
                header: '5-8',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size5to8) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size6to10A',
                header: '6-10A',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size6to10A) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size7to10B',
                header: '7-10B',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size7to10B) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size6to9A',
                header: '6-9A',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size6to9A) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size11close',
                header: '11 Close',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size11close) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size11to13',
                header: '11-13',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size11to13) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size3to8',
                header: '3-8',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size3to8) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            }
        ],
        [reports],
        //end
    );


    function handleExcel() {
        try {
            let data: IPendingOrdersReportTemplate[] = [
                {
                    report_owner: "DELHI",
                    account: "agarsoin safety",
                    product_family: "power black",
                    article: "power",
                    size5: 0,
                    size6: 0,
                    size7: 0,
                    size8: 0,
                    size9: 0,
                    size10: 0,
                    size11: 0,
                    size12_24pairs: 0,
                    size13: 0,
                    size11x12: 0,
                    size3: 0,
                    size4: 0,
                    size6to10: 0,
                    size7to10: 0,
                    size8to10: 0,
                    size4to8: 0,
                    size6to9: 0,
                    size5to8: 0,
                    size6to10A: 0,
                    size7to10B: 0,
                    size6to9A: 0,
                    size11close: 0,
                    size11to13: 0,
                    size3to8: 0
                }
            ]
            ExportToExcel(data, "pending_order_template")
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
        }), initialState: { density: 'compact' }, muiTableFooterRowProps: () => ({
            sx: {
                backgroundColor: 'whitesmoke',
                color: 'white',
                paddingBottom: 2
            }
        }),
        enableGrouping: true,
        enableRowSelection: true,
        enableGlobalFilterModes: true,
        enablePagination: false,
        enableColumnPinning: true, enableStickyFooter: true,
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
                    Pending Orders {new Date().getMonth() < 3 ? `${new Date().getFullYear() - 1}-${new Date().getFullYear()}` : `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`}
                </Typography>
                <Stack direction={'row'} gap={2} alignItems={'center'}>
                    {<>
                        {user?.assigned_permissions.includes("pending_orders_create") &&<UploadPendingOrdersButton />}
                        {user?.assigned_permissions.includes("pending_orders_create") && <Button variant="outlined" startIcon={<Download />} onClick={handleExcel}> Template</Button>}
                    </>}
                </Stack>


            </Stack >
           
                {/* table */}
                {!isLoading && data && <MaterialReactTable table={table} />}
        </>

    )

}

