import { Box, Button, LinearProgress, Typography } from '@mui/material'
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
import { Download } from '@mui/icons-material'
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'


export default function BillsAgingReportsPage() {
    const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [reports, setBillsAgingReports] = useState<IBillsAgingReport[]>([])
    const [filterCount, setFilterCount] = useState(0)
    const { user } = useContext(UserContext)
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
        if (data) {
            setBillsAgingReports(data.data.reports)
            setPaginationData({
                ...paginationData,
                page: data.data.page,
                limit: data.data.limit,
                total: data.data.total
            })
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
                justifyContent="center"
                width="100vw"
            >

                <Typography
                    variant={'h6'}
                    component={'h1'}
                    sx={{ pl: 1 }}
                >
                    Bills Aging Reports
                </Typography>
                {user?.erp_access_fields.is_editable && <>
                    <UploadBillsAgingFromExcelButton disabled={!user?.erp_access_fields.is_editable} />
                    <Button variant="outlined" onClick={handleExcel}> <Download /> Template</Button>
                </>}
            </Stack >

            {/* table */}
            {isLoading && <TableSkeleton />}
            {!isLoading && <Box sx={{
                overflow: "scroll",
                height: '80vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>

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
                                            {report.account}
                                        </STableCell>
                                        <STableCell>
                                            {String(report.plu70)}
                                        </STableCell>
                                        <STableCell>
                                            {String(report.in70to90)}
                                        </STableCell>
                                        <STableCell>
                                            {String(report.in90to120)}
                                        </STableCell>
                                        <STableCell>
                                            {String(report.plus120)}
                                        </STableCell>
                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>

            </Box>}
            <DBPagination filterCount={filterCount} paginationData={paginationData} setPaginationData={setPaginationData} setFilterCount={setFilterCount} />
        </>

    )

}

