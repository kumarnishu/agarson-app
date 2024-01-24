import { Box, Button, InputAdornment, LinearProgress, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import DBPagination from '../../components/pagination/DBpagination';
import { BackendError } from '../..'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { GetBillsAgingReports } from '../../services/ErpServices'
import { IBillsAgingReport } from '../../types/erp_report.types'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../components/styled/STyledTable'
import UploadBillsAgingFromExcelButton from '../../components/buttons/UploadBillsAgingButton'
import { UserContext } from '../../contexts/userContext'
import { Download, Search } from '@mui/icons-material'
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import FuzzySearch from 'fuzzy-search'


export default function BillsAgingReportsPage() {
    const [paginationData, setPaginationData] = useState({ limit: 500, page: 1, total: 1 });
    const [reports, setBillsAgingReports] = useState<IBillsAgingReport[]>([])
    const [filterCount, setFilterCount] = useState(0)
    const { user } = useContext(UserContext)
    const [filter, setFilter] = useState<string | undefined>()
    const [preFilteredData, setPreFilteredData] = useState<IBillsAgingReport[]>([])
    const [sent, setSent] = useState(false)
    const { data, isLoading } = useQuery<AxiosResponse<{ reports: IBillsAgingReport[], page: number, total: number, limit: number }>, BackendError>(["reports", paginationData], async () => GetBillsAgingReports({ limit: paginationData?.limit, page: paginationData?.page }))


    function handleExcel() {
        try {
            let data = [
                {
                    report_owner: "Goa",
                    account: "agarson safety",
                    plu70: 2323,
                    in70to90: 34334,
                    in90to120: 343434,
                    plus120: 343434344,
                }
            ]
            ExportToExcel(data, "bills_aging_template")
            setSent(true)
        }
        catch (err) {
            console.log(err)
            setSent(false)
        }
    }
    useEffect(() => {
        if (filter) {
            const searcher = new FuzzySearch(reports, ["report_owner.state", "account"], {
                caseSensitive: false,
            });
            const result = searcher.search(filter);
            setBillsAgingReports(result)
        }
        if (!filter)
            setBillsAgingReports(preFilteredData)

    }, [filter])

    useEffect(() => {
        if (data) {
            setBillsAgingReports(data.data.reports)
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
                    Bills Aging
                </Typography>
                <Stack direction={'row'} gap={2} alignItems={'center'}>
                    {user?.erp_access_fields.is_editable && <>
                        <UploadBillsAgingFromExcelButton disabled={!user?.erp_access_fields.is_editable} />
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
                overflow: "scroll",
                height: '76vh'
            }}>
                <STable
                >
                    <STableHead

                    >
                        <STableRow >

                            <STableHeadCell
                            >
                                No.
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
                                {'<70'}
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                {'70-90'}
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                {'90-120'}
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                {'>120'}
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                Total
                            </STableHeadCell>
                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {
                            reports && reports.map((report, index) => {
                                return (
                                    <STableRow
                                        key={index}
                                    >
                                        <STableCell>
                                            {index + 1}
                                        </STableCell>
                                        <STableCell>
                                            {report.report_owner && report.report_owner.state}
                                        </STableCell>
                                        <STableCell>
                                            {report.account && report.account.slice(0, 20)}
                                        </STableCell>
                                        <STableCell>
                                            {report.plu70 ? String(report.plu70) : ""}
                                        </STableCell>
                                        <STableCell>
                                            {report.in70to90 ? String(report.in70to90) : ""}
                                        </STableCell>
                                        <STableCell>
                                            {report.in90to120 ? String(report.in90to120) : ""}
                                        </STableCell>
                                        <STableCell>
                                            {report.plus120 ? String(report.plus120) : ""}
                                        </STableCell>
                                        <STableCell>
                                            <b> {Number(report.plu70) + Number(report.in70to90) + Number(report.in90to120) + Number(report.plus120)}</b>
                                        </STableCell>
                                    </STableRow>
                                )
                            })}
                        <STableCell>

                        </STableCell>
                        <STableCell>
                            <b> Total</b>
                        </STableCell>
                        <STableCell>

                        </STableCell>
                        <STableCell>
                            <b> {reports.reduce((a, b) => { return Number(a) + Number(b.plu70) }, 0).toFixed()}</b>
                        </STableCell>
                        <STableCell>
                            <b> {reports.reduce((a, b) => { return Number(a) + Number(b.in70to90) }, 0).toFixed()}</b>
                        </STableCell>
                        <STableCell>
                            <b> {reports.reduce((a, b) => { return Number(a) + Number(b.in90to120) }, 0).toFixed()}</b>
                        </STableCell>
                        <STableCell>
                            <b> {reports.reduce((a, b) => { return Number(a) + Number(b.plus120) }, 0).toFixed()}</b>
                        </STableCell>
                        <STableCell>
                            <b> {(reports.reduce((a, b) => { return Number(a) + Number(b.plu70) }, 0) + reports.reduce((a, b) => { return Number(a) + Number(b.in70to90) }, 0) + reports.reduce((a, b) => { return Number(a) + Number(b.in90to120) }, 0) + reports.reduce((a, b) => { return Number(a) + Number(b.plus120) }, 0)).toFixed()
                            }</b>
                        </STableCell>
                    </STableBody>
                </STable>

            </Box>}
            <DBPagination filterCount={filterCount} paginationData={paginationData} setPaginationData={setPaginationData} setFilterCount={setFilterCount} />
        </>

    )

}

