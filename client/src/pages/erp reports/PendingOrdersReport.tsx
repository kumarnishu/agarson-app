import { Box, Button, InputAdornment, LinearProgress, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import DBPagination from '../../components/pagination/DBpagination';
import { BackendError } from '../..'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { IPendingOrdersReport } from '../../types/erp_report.types'
import { GetPendingOrdersReports } from '../../services/ErpServices'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../components/styled/STyledTable'
import UploadPendingOrdersButton from '../../components/buttons/UploadPendingOrdersButton'
import { UserContext } from '../../contexts/userContext'
import { Download, Search } from '@mui/icons-material'
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import FuzzySearch from 'fuzzy-search'
import moment from 'moment'

export default function PendingOrdersReportPage() {
    const [paginationData, setPaginationData] = useState({ limit: 1000, page: 1, total: 1 });
    const [reports, setPendingOrdersReport] = useState<IPendingOrdersReport[]>([])
    const [filterCount, setFilterCount] = useState(0)
    const { user } = useContext(UserContext)
    const [sent, setSent] = useState(false)
    const [filter, setFilter] = useState<string | undefined>()
    const [preFilteredData, setPreFilteredData] = useState<IPendingOrdersReport[]>([])
    const { data, isLoading } = useQuery<AxiosResponse<{ reports: IPendingOrdersReport[], page: number, total: number, limit: number }>, BackendError>(["reports", paginationData], async () => GetPendingOrdersReports({ limit: paginationData?.limit, page: paginationData?.page }))

    function handleExcel() {
        try {
            let data = [
                {
                    report_owner: "Goa",
                    account: "agarson safety",
                    product_family: "REXIN SD-CTN",
                    article: "PV0705GP-BLACK/ORANGE",
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
                    size3to8: 0,
                }
            ]
            ExportToExcel(data, "pending_orders_template")
            setSent(true)
        }
        catch (err) {
            console.log(err)
            setSent(false)
        }
    }
    useEffect(() => {
        if (filter) {
            const searcher = new FuzzySearch(reports, ["report_owner.state", "account", "article"], {
                caseSensitive: false,
            });
            const result = searcher.search(filter);
            setPendingOrdersReport(result)
        }
        if (!filter)
            setPendingOrdersReport(preFilteredData)

    }, [filter])

    useEffect(() => {
        if (data && !filter) {
            setPendingOrdersReport(data.data.reports)
            setPaginationData({
                ...paginationData,
                page: data.data.page,
                limit: data.data.limit,
                total: data.data.total
            })
            setPreFilteredData(data.data.reports)
        }
    }, [data])

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
                    Pending orders
                </Typography>
                <Stack direction={'row'} gap={2} alignItems={'center'}>
                    {user?.erp_access_fields.is_editable && <>
                        <UploadPendingOrdersButton disabled={!user?.erp_access_fields.is_editable} />
                        <Button onClick={handleExcel}> <Download /> Template</Button>

                    </>}
                    <TextField
                        fullWidth
                        size="small"
                        onChange={(e) => {
                            setFilter(e.currentTarget.value)
                        }}
                        placeholder={`${reports?.length} records...`}
                        style={{
                            fontSize: '1.1rem',
                            border: '0',
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>


            </Stack >

            {/* table */}
            {isLoading && <TableSkeleton />}
            {!isLoading && <Box sx={{
                overflow: "auto",
                height: '78vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>
                            <STableHeadCell style={{ padding: '8px' }}
                            >
                                Date
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                State
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                Account
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                Article
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                Total
                            </STableHeadCell>
                            {reports.find((r) => r.size5 > 0) && <STableHeadCell
                            >
                                5
                            </STableHeadCell>}
                            {reports.find((r) => r.size6 > 0) && <STableHeadCell
                            >
                                6
                            </STableHeadCell>}
                            {reports.find((r) => r.size7 > 0) && <STableHeadCell
                            >
                                7
                            </STableHeadCell>}
                            {reports.find((r) => r.size8 > 0) && <STableHeadCell
                            >
                                8
                            </STableHeadCell>}
                            {reports.find((r) => r.size9 > 0) && <STableHeadCell
                            >
                                9
                            </STableHeadCell>}
                            {reports.find((r) => r.size10 > 0) && <STableHeadCell
                            >
                                10
                            </STableHeadCell>}
                            {reports.find((r) => r.size11 > 0) && <STableHeadCell
                            >
                                11
                            </STableHeadCell>}
                            {reports.find((r) => r.size12_24pairs > 0) && <STableHeadCell
                            >
                                12(24PS)
                            </STableHeadCell>}
                            {reports.find((r) => r.size13 > 0) && <STableHeadCell
                            >
                                13
                            </STableHeadCell>}
                            {reports.find((r) => r.size11x12 > 0) && <STableHeadCell
                            >
                                11x12
                            </STableHeadCell>}
                            {reports.find((r) => r.size3 > 0) && <STableHeadCell
                            >
                                3
                            </STableHeadCell>}
                            {reports.find((r) => r.size4 > 0) && <STableHeadCell
                            >
                                4
                            </STableHeadCell>}
                            {reports.find((r) => r.size6to10 > 0) && <STableHeadCell
                            >
                                6x10
                            </STableHeadCell>}
                            {reports.find((r) => r.size7to10 > 0) && <STableHeadCell
                            >
                                7x10
                            </STableHeadCell>}
                            {reports.find((r) => r.size8to10 > 0) && <STableHeadCell
                            >
                                8x10
                            </STableHeadCell>}
                            {reports.find((r) => r.size4to8 > 0) && <STableHeadCell
                            >
                                4x8
                            </STableHeadCell>}
                            {reports.find((r) => r.size6to9 > 0) && <STableHeadCell
                            >
                                6x9
                            </STableHeadCell>}

                            {reports.find((r) => r.size5to8 > 0) && <STableHeadCell
                            >
                                5x8
                            </STableHeadCell>}
                            {reports.find((r) => r.size6to10A > 0) && <STableHeadCell
                            >
                                6x10A
                            </STableHeadCell>}
                            {reports.find((r) => r.size7to10B > 0) && <STableHeadCell
                            >
                                7x10B
                            </STableHeadCell>}
                            {reports.find((r) => r.size6to9A > 0) && <STableHeadCell
                            >
                                6x9A
                            </STableHeadCell>}
                            {reports.find((r) => r.size11close > 0) && <STableHeadCell
                            >
                                11Close
                            </STableHeadCell>}
                            {reports.find((r) => r.size11to13 > 0) && <STableHeadCell
                            >
                                11x13
                            </STableHeadCell>}
                            {reports.find((r) => r.size3to8 > 0) && <STableHeadCell
                            >
                                3x8
                            </STableHeadCell>}
                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {
                            reports && reports.map((report, index) => {
                                return (
                                    <STableRow
                                        key={index}
                                    >
                                        <STableCell style={{ padding: '10px' }}>
                                            {report.created_at && moment(new Date(report.created_at)).format('DD/MM/YY')}
                                        </STableCell>
                                        <STableCell>
                                            {report.report_owner && report.report_owner.state && report.report_owner.state}
                                        </STableCell>
                                        <STableCell>
                                            {report.account && report.account.slice(0, 60)}
                                        </STableCell>
                                        <STableCell>
                                            {report.article && report.article.slice(0, 60)}
                                        </STableCell>
                                        <STableCell>
                                            <b style={{ fontSize: 12, letterSpacing: '1px' }}>{
                                                Number(report.size5) +
                                                Number(report.size6) +
                                                Number(report.size7) +
                                                Number(report.size8) +
                                                Number(report.size9) +
                                                Number(report.size10) +
                                                Number(report.size11) +
                                                Number(report.size12_24pairs) +
                                                Number(report.size13) +
                                                Number(report.size11x12) +
                                                Number(report.size3) +
                                                Number(report.size4) +
                                                Number(report.size6to10) +
                                                Number(report.size7to10) +
                                                Number(report.size4to8) +
                                                Number(report.size6to9) +
                                                Number(report.size5to8) +
                                                Number(report.size6to10A) +
                                                Number(report.size7to10B) +
                                                Number(report.size6to9A) +
                                                Number(report.size11close) +
                                                Number(report.size11to13) +
                                                Number(report.size3to8)
                                            }</b>
                                        </STableCell>
                                        {reports.find((r) => r.size5 > 0) && <STableCell
                                        >
                                            {report.size5 ? report.size5 : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size6 > 0) && <STableCell
                                        >
                                            {report.size6 ? report.size6 : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size7 > 0) && <STableCell
                                        >
                                            {report.size7 ? report.size7 : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size8 > 0) && <STableCell
                                        >
                                            {report.size8 ? report.size8 : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size9 > 0) && <STableCell
                                        >
                                            {report.size9 ? report.size9 : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size10 > 0) && <STableCell
                                        >
                                            {report.size10 ? report.size10 : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size11 > 0) && <STableCell
                                        >
                                            {report.size11 ? report.size11 : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size12_24pairs > 0) && <STableCell
                                        >
                                            {report.size12_24pairs ? report.size12_24pairs : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size13 > 0) && <STableCell
                                        >
                                            {report.size13 ? report.size13 : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size11x12 > 0) && <STableCell
                                        >
                                            {report.size11x12 ? report.size11x12 : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size3 > 0) && <STableCell
                                        >
                                            {report.size3 ? report.size3 : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size4 > 0) && <STableCell
                                        >
                                            {report.size4 ? report.size4 : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size6to10 > 0) && <STableCell
                                        >
                                            {report.size6to10 ? report.size6to10 : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size7to10 > 0) && <STableCell
                                        >
                                            {report.size7to10 ? report.size7to10 : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size8to10 > 0) && <STableCell
                                        >
                                            {report.size8to10 ? report.size8to10 : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size4to8 > 0) && <STableCell
                                        >
                                            {report.size4to8 ? report.size4to8 : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size6to9 > 0) && <STableCell
                                        >
                                            {report.size6to9 ? report.size6to9 : ""}
                                        </STableCell>}

                                        {reports.find((r) => r.size5to8 > 0) && <STableCell
                                        >
                                            {report.size5to8 ? report.size5to8 : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size6to10A > 0) && <STableCell
                                        >
                                            {report.size6to10A ? report.size6to10A : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size7to10B > 0) && <STableCell
                                        >
                                            {report.size7to10B ? report.size7to10B : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size6to9A > 0) && <STableCell
                                        >
                                            {report.size6to9A ? report.size6to9A : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size11close > 0) && <STableCell
                                        >
                                            {report.size11close ? report.size11close : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size11to13 > 0) && <STableCell
                                        >
                                            {report.size11to13 ? report.size11to13 : ""}
                                        </STableCell>}
                                        {reports.find((r) => r.size3to8 > 0) && <STableCell
                                        >
                                            {report.size3to8 ? report.size3to8 : ""}
                                        </STableCell>}
                                    </STableRow>
                                )
                            })}
                        <STableRow>
                            <STableCell>

                            </STableCell>
                            <STableCell>

                            </STableCell>
                            <STableCell>

                            </STableCell>
                            <STableCell>
                            </STableCell>
                            <STableCell>
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size5) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size6) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size7) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size8) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size9) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size10) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size11) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size12_24pairs) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size13) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size11x12) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size3) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size4) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size6to10) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size7to10) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size8to10) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size4to8) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size6to9) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size5to8) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size6to10A) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size7to10B) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size6to9A) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size11close) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size11to13) }, 0).toFixed()) +
                                    Number(reports.reduce((a, b) => { return Number(a) + Number(b.size3to8) }, 0).toFixed())
                                }</b>
                            </STableCell>
                            {reports.find((r) => r.size5 > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size5) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size6 > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size6) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size7 > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size7) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size8 > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size8) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size9 > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size9) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size10 > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size10) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size11 > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size11) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size12_24pairs > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size12_24pairs) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size13 > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size13) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size11x12 > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size11x12) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size3 > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size3) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size4 > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size4) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size6to10 > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size6to10) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size7to10 > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size7to10) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size8to10 > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size8to10) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size4to8 > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size4to8) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size6to9 > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size6to9) }, 0).toFixed()}</b>
                            </STableCell>}

                            {reports.find((r) => r.size5to8 > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size5to8) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size6to10A > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size6to10A) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size7to10B > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size7to10B) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size6to9A > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size6to9A) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size11close > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size11close) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size11to13 > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size11to13) }, 0).toFixed()}</b>
                            </STableCell>}
                            {reports.find((r) => r.size3to8 > 0) && <STableCell
                            >
                                <b style={{ fontSize: 12, letterSpacing: '1px' }}>{reports.reduce((a, b) => { return Number(a) + Number(b.size3to8) }, 0).toFixed()}</b>
                            </STableCell>}
                        </STableRow>
                    </STableBody>
                </STable>
            </Box >}
            {window.screen.width > 500 && <DBPagination filterCount={filterCount} paginationData={paginationData} setPaginationData={setPaginationData} setFilterCount={setFilterCount} />}
        </>

    )

}

