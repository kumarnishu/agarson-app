import { Button, LinearProgress, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { GetClientSaleReports } from '../../services/ErpServices'
import { UserContext } from '../../contexts/userContext'
import { Download } from '@mui/icons-material'
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import UploadClientSalesButton from '../../components/buttons/UploadClientSalesButton'
import { MaterialReactTable, MRT_ColumnDef, MRT_RowVirtualizer, MRT_SortingState, useMaterialReactTable } from 'material-react-table'
import { onlyUnique } from '../../utils/UniqueArray'
import { GetClientSaleReportFromExcelDto } from '../../dtos/erp reports/erp.reports.dto'



export default function ClientSaleReportsPage() {
    const [reports, setClientSaleReports] = useState<GetClientSaleReportFromExcelDto[]>([])
    const { user } = useContext(UserContext)
    const [sent, setSent] = useState(false)
    const { data, isLoading, isSuccess } = useQuery<AxiosResponse<GetClientSaleReportFromExcelDto[]>, BackendError>("reports", GetClientSaleReports)
    const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
    const [sorting, setSorting] = useState<MRT_SortingState>([]);

    const columns = useMemo<MRT_ColumnDef<GetClientSaleReportFromExcelDto>[]>(
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
                width: '50',
                aggregationFn: 'count',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                filterVariant: 'multi-select',
                filterSelectOptions: reports.map((i) => { return i.report_owner }).filter(onlyUnique)
            },
            {
                accessorKey: 'account',
                header: 'Account',
                size: 300,
                aggregationFn: 'count',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                filterVariant: 'multi-select',
                filterSelectOptions: reports.map((i) => { return i.account }).filter(onlyUnique)

            },
            {
                accessorKey: 'article',
                header: 'Article',
                Footer: <b>Total</b>,
                size: 300,
                aggregationFn: 'count',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                filterVariant: 'multi-select',
                filterSelectOptions: reports.map((i) => { return i.article }).filter(onlyUnique)
            },
            {
                accessorKey: 'oldqty',
                header: 'Old Qty',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.oldqty) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'newqty',
                header: 'New Qty',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.newqty) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            }, {
                accessorKey: 'total',
                header: 'Total',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.total) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'apr',
                header: 'APR',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.apr) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'may',
                header: 'MAY',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.may) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'jun',
                header: 'JUN',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.jun) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'jul',
                header: 'JUL',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.jul) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'aug',
                header: 'AUG',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.aug) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'sep',
                header: 'SEP',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.sep) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'oct',
                header: 'OCT',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.oct) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'nov',
                header: 'NOV',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.nov) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'dec',
                header: 'DEC',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.dec) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'jan',
                header: 'JAN',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.jan) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'feb',
                header: 'FEB',
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.feb) }, 0).toFixed()}</b>,
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
            },
            {
                accessorKey: 'mar',
                header: 'MAR',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.mar) }, 0).toFixed()}</b>
            }
        ],
        [reports,],
        //end
    );


    function handleExcel() {
        try {
            let data: GetClientSaleReportFromExcelDto[] = [
                {
                    report_owner: "Goa",
                    account: "agarson safety",
                    article: "power",
                    oldqty: 3434,
                    newqty: 4343,
                    apr: 23,
                    may: 34,
                    jun: 223,
                    jul: 445,
                    aug: 66,
                    sep: 34,
                    oct: 66,
                    nov: 34,
                    dec: 67,
                    jan: 7,
                    feb: 666,
                    mar: 555,
                }
            ]
            ExportToExcel(data, "client_sale_template")
            setSent(true)
        }
        catch (err) {
            console.log(err)
            setSent(false)
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined' && isSuccess) {
            setClientSaleReports(data.data);
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
        enableStickyFooter: true,
        enableColumnVirtualization: true,
        muiTableHeadRowProps: () => ({
            sx: {
                backgroundColor: 'whitesmoke',
                color: 'white'
            },
        }), muiTableFooterRowProps: () => ({
            sx: {
                backgroundColor: 'whitesmoke',
                color: 'white',
                paddingBottom: 2
            }
        }),
        muiTableBodyCellProps: () => ({
            sx: {
                fontSize: '13px',
                border: '1px solid #ddd;'
            },
        }), initialState: { density: 'compact' },
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
                    Client Sale {new Date().getMonth() < 3 ? `${new Date().getFullYear() - 1}-${new Date().getFullYear()}` : `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`}
                </Typography>
                <Stack direction={'row'} gap={2} alignItems={'center'}>
                    <>

                        {user?.assigned_permissions.includes("client_sale_report_create") && <UploadClientSalesButton />}

                        {user?.assigned_permissions.includes("client_sale_report_create") && <Button variant="outlined" startIcon={<Download />} onClick={handleExcel}> Template</Button>}
                    </>
                </Stack>


            </Stack >
            {/* table */}
            {!isLoading && data && <MaterialReactTable table={table} />}
        </>

    )

}

