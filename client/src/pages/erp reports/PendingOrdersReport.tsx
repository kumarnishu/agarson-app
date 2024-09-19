import { Button, LinearProgress, Typography } from '@mui/material'
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
import { GetPendingOrdersReportFromExcelDto } from '../../dtos/erp reports/erp.reports.dto'


export default function PendingOrdersReport() {
    const [reports, setReports] = useState<GetPendingOrdersReportFromExcelDto[]>([])
    const { user } = useContext(UserContext)
    const [sent, setSent] = useState(false)
    const { data, isLoading, isSuccess } = useQuery<AxiosResponse<GetPendingOrdersReportFromExcelDto[]>, BackendError>("pending_order_reports", GetPendingOrdersReports)
    const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
    const [sorting, setSorting] = useState<MRT_SortingState>([]);

    const columns = useMemo<MRT_ColumnDef<GetPendingOrdersReportFromExcelDto>[]>(
        //column definitions...
        () => [
            {
                accessorKey: 'created_at',
                size: 100,
                header: 'Created On',
                filterVariant: 'multi-select',
                filterSelectOptions: reports.map((i) => { return i.created_at || "" }).filter(onlyUnique)
            },
            {
                accessorKey: 'report_owner',
                size: 100,
                header: 'State',
                filterVariant: 'multi-select',
                aggregationFn: 'count',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                filterSelectOptions: reports.map((i) => { return i.report_owner }).filter(onlyUnique)
            },
            {
                accessorKey: 'account',
                size: 200,
                header: 'Account',
                aggregationFn: 'count',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                filterVariant: 'multi-select',
                filterSelectOptions: reports.map((i) => { return i.account }).filter(onlyUnique)
            },
            {
                accessorKey: 'product_family',
                size: 200,
                header: 'Product Family',
                aggregationFn: 'count',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                filterVariant: 'multi-select',
                filterSelectOptions: reports.map((i) => { return i.product_family }).filter(onlyUnique)
            },

            {
                accessorKey: 'article',
                size: 200,
                header: 'Article',

                aggregationFn: 'count',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                filterVariant: 'multi-select',
                filterSelectOptions: reports.map((i) => { return i.article }).filter(onlyUnique)
            },
            {
                accessorKey: 'total',
                size: 100,
                header: 'Total',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.total) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },

            {
                accessorKey: 'size5',
                size: 100,
                header: '5',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size5) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size6',
                size: 100,
                header: '6',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size6) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size7',
                size: 100,
                header: '7',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size7) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size8',
                size: 100,
                header: '8',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size8) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size9',
                size: 100,
                header: '9',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size9) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size10',
                size: 100,
                header: '10',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size10) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size11',
                size: 100,
                header: '11',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size11) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size12_24pairs',
                size: 100,
                header: '12x24',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size12_24pairs) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size13',
                size: 100,
                header: '13',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size13) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size11x12',
                size: 100,
                header: '11x12',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size11x12) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size3',
                size: 100,
                header: '3',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size3) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size4',
                size: 100,
                header: '4',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size4) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size6to10',
                size: 100,
                header: '6-10',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size6to10) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size7to10',
                size: 100,
                header: '7-10',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size7to10) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size8to10',
                size: 100,
                header: '8-10',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size8to10) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size4to8',
                size: 100,
                header: '4-8',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size4to8) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size6to9',
                size: 100,
                header: '6-9',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size6to9) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size5to8',
                size: 100,
                header: '5-8',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size5to8) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size6to10A',
                size: 100,
                header: '6-10A',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size6to10A) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size7to10B',
                size: 100,
                header: '7-10B',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size7to10B) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size6to9A',
                size: 100,
                header: '6-9A',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size6to9A) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size11close',
                size: 100,
                header: '11 Close',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size11close) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size11to13',
                size: 100,
                header: '11-13',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.size11to13) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'size3to8',
                size: 100,
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
            let data: GetPendingOrdersReportFromExcelDto[] = [
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
                        {user?.assigned_permissions.includes("pending_orders_create") && <UploadPendingOrdersButton />}
                        {user?.assigned_permissions.includes("pending_orders_create") && <Button variant="outlined" startIcon={<Download />} onClick={handleExcel}> Template</Button>}
                    </>}
                </Stack>


            </Stack >

            {/* table */}
            {!isLoading && data && <MaterialReactTable table={table} />}
        </>

    )

}

