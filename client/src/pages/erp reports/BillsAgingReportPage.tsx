import { Box, LinearProgress, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import DBPagination from '../../components/pagination/DBpagination';
import { BackendError } from '../..'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { GetBillsAgingReports } from '../../services/ErpServices'
import { IBillsAgingReport } from '../../types/erp_report.types'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../components/styled/STyledTable'


export default function BillsAgingReportsPage() {
    const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [reports, setBillsAgingReports] = useState<IBillsAgingReport[]>([])
    const [filterCount, setFilterCount] = useState(0)

    const { data, isLoading } = useQuery<AxiosResponse<{ reports: IBillsAgingReport[], page: number, total: number, limit: number }>, BackendError>(["reports", paginationData], async () => GetBillsAgingReports({ limit: paginationData?.limit, page: paginationData?.page }))

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
                                Account
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
                                            {report.account}
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

