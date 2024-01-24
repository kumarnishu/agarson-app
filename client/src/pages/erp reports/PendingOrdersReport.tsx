import { Box, Button, LinearProgress, Typography } from '@mui/material'
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
import { Download } from '@mui/icons-material'
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'

export default function PendingOrdersReportPage() {
    const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [reports, setPendingOrdersReport] = useState<IPendingOrdersReport[]>([])
    const [filterCount, setFilterCount] = useState(0)
    const { user } = useContext(UserContext)
    const [sent, setSent] = useState(false)
    const { data, isLoading } = useQuery<AxiosResponse<{ reports: IPendingOrdersReport[], page: number, total: number, limit: number }>, BackendError>(["reports", paginationData], async () => GetPendingOrdersReports({ limit: paginationData?.limit, page: paginationData?.page }))

    function handleExcel() {
        try {
            let data = [
                {
                    report_owner: "Goa",
                    account: "agarson safety",
                    product_family: "REXIN SD-CTN",
                    article: "PV0705GP-BLACK/ORANGE",
                    sum_total: 0,
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
        if (data) {
            setPendingOrdersReport(data.data.reports)
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
                    Pending orders
                </Typography>
                {user?.erp_access_fields.is_editable && <>
                    <UploadPendingOrdersButton disabled={!user?.erp_access_fields.is_editable} />
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
                                No
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
                                Sum Total
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                5
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                6
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                7
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                8
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                9
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                10
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                11
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                12(24PS)
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                13
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                11x12
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                3
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                4
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                6x10
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                7x10
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                4x8
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                6x9
                            </STableHeadCell>

                            <STableHeadCell
                            >
                                5x8
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                6x10A
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                7x10B
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                6x9A
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                11Close
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                11x13
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                3x8
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
                                            {report.article}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.sum_total) ? report.sum_total : ""}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.size5) ? report.size5 : ""}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.size6) ? report.size6 : ""}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.size7) ? report.size7 : ""}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.size8) ? report.size8 : ""}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.size9) ? report.size9 : ""}
                                        </STableCell>

                                        <STableCell>
                                            {Boolean(report.size10) ? report.size10 : ""}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.size11) ? report.size11 : ""}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.size12_24pairs) ? report.size12_24pairs : ""}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.size13) ? report.size13 : ""}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.size11x12) ? report.size11x12 : ""}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.size3) ? report.size3 : ""}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.size4) ? report.size4 : ""}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.size6to10) ? report.size6to10 : ""}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.size7to10) ? report.size7to10 : ""}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.size4to8) ? report.size4to8 : ""}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.size6to9) ? report.size6to9 : ""}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.size5to8) ? report.size5to8 : ""}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.size6to10A) ? report.size6to10A : ""}
                                        </STableCell>

                                        <STableCell>
                                            {Boolean(report.size7to10B) ? report.size7to10B : ""}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.size6to9A) ? report.size6to9A : ""}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.size11close) ? report.size11close : ""}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.size11to13) ? report.size11to13 : ""}
                                        </STableCell>
                                        <STableCell>
                                            {Boolean(report.size3to8) ? report.size3to8 : ""}
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

