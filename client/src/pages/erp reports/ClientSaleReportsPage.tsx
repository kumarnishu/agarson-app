import { Box, Button, LinearProgress, Typography } from '@mui/material'
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


export type ClientSaleReportTemplate = {
    report_owner: string,
    account: string,
    article: string,
    oldqty: number,
    newqty: number,
    apr: number,
    may: number,
    jun: number,
    jul: number,
    aug: number,
    sep: number,
    oct: number,
    nov: number,
    dec: number,
    jan: number,
    feb: number,
    mar: number
}
export default function ClientSaleReportsPage() {
    const [reports, setClientSaleReports] = useState<ClientSaleReportTemplate[]>([])
    const { user } = useContext(UserContext)
    const [sent, setSent] = useState(false)
    const { data, isLoading, isSuccess } = useQuery<AxiosResponse<ClientSaleReportTemplate[]>, BackendError>("reports", GetClientSaleReports)
    const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
    const [sorting, setSorting] = useState<MRT_SortingState>([]);

    const columns = useMemo<MRT_ColumnDef<ClientSaleReportTemplate>[]>(
        //column definitions...
        () => [
            {
                accessorKey: 'report_owner',
                header: 'State',
                width:'50',
                filterVariant: 'multi-select',
                filterSelectOptions: reports.map((i) => { return i.report_owner }).filter(onlyUnique)
            },
            {
                accessorKey: 'account',
                header: 'Account',
                size:200
                
            },
            {
                accessorKey: 'article',
                header: 'Article',
                Footer: <b>Total</b>,
                size:150
            },
            {
                accessorKey: 'oldqty',
                header: 'Old Qty',
                Footer: <b>{reports.reduce((a, b) => { return Number(a) + Number(b.oldqty) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'newqty',
                header: 'New Qty',
                Footer: <b>{reports.reduce((a, b) => { return Number(a) + Number(b.newqty) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'apr',
                header: 'APR',
                Footer: <b>{reports.reduce((a, b) => { return Number(a) + Number(b.apr) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'may',
                header: 'MAY',
                Footer: <b>{reports.reduce((a, b) => { return Number(a) + Number(b.may) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'jun',
                header: 'JUN',
                Footer: <b>{reports.reduce((a, b) => { return Number(a) + Number(b.jun) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'jul',
                header: 'JUL',
                Footer: <b>{reports.reduce((a, b) => { return Number(a) + Number(b.jul) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'aug',
                header: 'AUG',
                Footer: <b>{reports.reduce((a, b) => { return Number(a) + Number(b.aug) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'sep',
                header: 'SEP',
                Footer: <b>{reports.reduce((a, b) => { return Number(a) + Number(b.sep) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'oct',
                header: 'OCT',
                Footer: <b>{reports.reduce((a, b) => { return Number(a) + Number(b.oct) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'nov',
                header: 'NOV',
                Footer: <b>{reports.reduce((a, b) => { return Number(a) + Number(b.nov) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'dec',
                header: 'DEC',
                Footer: <b>{reports.reduce((a, b) => { return Number(a) + Number(b.dec) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'jan',
                header: 'JAN',
                Footer: <b>{reports.reduce((a, b) => { return Number(a) + Number(b.jan) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'feb',
                header: 'FEB',
                Footer: <b>{reports.reduce((a, b) => { return Number(a) + Number(b.feb) }, 0).toFixed()}</b>
            },
            {
                accessorKey: 'mar',
                header: 'MAR',
                aggregationFn: 'sum', //calc total points for each team by adding up all the points for each player on the team
                AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
                Footer: <b>{reports.reduce((a, b) => { return Number(a) + Number(b.mar) }, 0).toFixed()}</b>
            }
        ],
        [reports,],
        //end
    );


    function handleExcel() {
        try {
            let data: ClientSaleReportTemplate[] = [
                {
                    report_owner: "Goa",
                    account: "agarson safety",
                    article: "34",
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
        enableColumnVirtualization: true,
        muiTableHeadRowProps: () => ({
            sx: {
               backgroundColor:'yellow',
               color:'white'
            },
        }),
        muiTableBodyCellProps: () => ({
            sx: {
                fontSize:'13px',
                border: '1px solid #ddd;'
            },
        }),
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
                    {user?.erp_access_fields.is_editable && <>
                        <UploadClientSalesButton disabled={!user?.erp_access_fields.is_editable} />
                        <Button variant="outlined" startIcon={<Download />} onClick={handleExcel}> Download</Button>
                    </>}
                </Stack>


            </Stack >
            <Box sx={{
                overflow: "auto",
                height: '80vh'
            }}
                className='hideme'
            >
                {/* table */}
                {!isLoading && data && <MaterialReactTable table={table} />}
            </Box>
        </>

    )

}

