import { Box, Button, LinearProgress, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { GetBillsAgingReports } from '../../services/ErpServices'
import { UserContext } from '../../contexts/userContext'
import { Download } from '@mui/icons-material'
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import { MaterialReactTable, MRT_ColumnDef, MRT_RowVirtualizer, MRT_SortingState, useMaterialReactTable } from 'material-react-table'
import { onlyUnique } from '../../utils/UniqueArray'
import UploadBillsAgingFromExcelButton from '../../components/buttons/UploadBillsAgingButton'


export type IBillsAgingReportTemplate = {
    report_owner: string
    account: string,
    total?: number,
    plu70: number,
    in70to90: number,
    in90to120: number,
    plus120: number
    status?: string,
    created_at?: string,
}
export default function BillsAgingReportPage() {
    const [reports, setReports] = useState<IBillsAgingReportTemplate[]>([])
    const { user } = useContext(UserContext)
    const [sent, setSent] = useState(false)
    const { data, isLoading, isSuccess } = useQuery<AxiosResponse<IBillsAgingReportTemplate[]>, BackendError>("reports", GetBillsAgingReports)
    const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
    const [sorting, setSorting] = useState<MRT_SortingState>([]);

    const columns = useMemo<MRT_ColumnDef<IBillsAgingReportTemplate>[]>(
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
                size: 150,
                filterVariant: 'multi-select',
                filterSelectOptions: reports.map((i) => { return i.report_owner }).filter(onlyUnique)
            },
            {
                accessorKey: 'account',
                header: 'Account',
                size: 350,
                filterVariant: 'multi-select',
                filterSelectOptions: reports.map((i) => { return i.account }).filter(onlyUnique)

            },
            {
                accessorKey: 'total',
                header: 'Total'
            },
            {
                accessorKey: 'plu70',
                header: '>70',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.plu70) }, 0).toFixed(2)}</b>
            },
            {
                accessorKey: 'in70to90',
                header: '70-90',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.in70to90) }, 0).toFixed(2)}</b>
            },
            {
                accessorKey: 'in90to120',
                header: '90-120',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.in90to120) }, 0).toFixed(2)}</b>
            },
            {
                accessorKey: 'plus120',
                header: '>120',
                aggregationFn: 'sum',
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: ({ table }) => <b>{table.getFilteredRowModel().rows.reduce((a, b) => { return Number(a) + Number(b.original.plus120) }, 0).toFixed(2)}</b>
            }
        ],
        [reports],
        //end
    );


    function handleExcel() {
        try {
            let data: IBillsAgingReportTemplate[] = [
                {
                    report_owner: "Goa",
                    account: "agarson safety",
                    plu70: 0,
                    in70to90: 0,
                    in90to120: 0,
                    plus120: 0
                }
            ]
            ExportToExcel(data, "bills_ageing_template")
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
                    Bills Ageing {new Date().getMonth() < 3 ? `${new Date().getFullYear() - 1}-${new Date().getFullYear()}` : `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`}
                </Typography>
               
                <Stack direction={'row'} gap={2} alignItems={'center'}>
                    <>

                        {user?.assigned_permissions.includes("bills_ageing_create") && <UploadBillsAgingFromExcelButton />}

                        {user?.assigned_permissions.includes("bills_ageing_create") && <Button variant="outlined" startIcon={<Download />} onClick={handleExcel}> Template</Button>}
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

