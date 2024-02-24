import { Box, Button, InputAdornment, LinearProgress, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import DBPagination from '../../components/pagination/DBpagination';
import { BackendError } from '../..'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { GetClientSaleReports } from '../../services/ErpServices'
import { IClientSaleReport } from '../../types/erp_report.types'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../components/styled/STyledTable'
import { UserContext } from '../../contexts/userContext'
import { Download, Search } from '@mui/icons-material'
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import FuzzySearch from 'fuzzy-search'
import moment from 'moment'
import UploadClientSalesButton from '../../components/buttons/UploadClientSalesButton'


export default function ClientSaleReportsPage() {
    const [paginationData, setPaginationData] = useState({ limit: 1000, page: 1, total: 1 });
    const [reports, setClientSaleReports] = useState<IClientSaleReport[]>([])
    const [filterCount, setFilterCount] = useState(0)
    const { user } = useContext(UserContext)
    const [filter, setFilter] = useState<string>()
    const [preFilteredData, setPreFilteredData] = useState<IClientSaleReport[]>([])
    const [sent, setSent] = useState(false)
    const { data, isLoading } = useQuery<AxiosResponse<{ reports: IClientSaleReport[], page: number, total: number, limit: number }>, BackendError>(["reports", paginationData], async () => GetClientSaleReports({ limit: paginationData?.limit, page: paginationData?.page }))


    function handleExcel() {
        try {
            let data = [
                {
                    report_owner: "Goa",
                    account: "agarson safety",
                    article: "34",
                    oldqty: "3434",
                    newqty: "4343",
                    apr: "23",
                    may: "34",
                    jun: "223",
                    jul: "445",
                    aug: "66",
                    sep: "34",
                    oct: "66",
                    nov: "34",
                    dec: "67",
                    jan: "7",
                    feb: "666",
                    mar: "555",
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
        if (filter) {
            const searcher = new FuzzySearch(reports, ["report_owner.state", "account", "article"], {
                caseSensitive: false,
            });
            const result = searcher.search(filter);
            setClientSaleReports(result)
        }
        if (!filter)
            setClientSaleReports(preFilteredData)

    }, [filter])

    useEffect(() => {
        if (data && !filter) {
            setClientSaleReports(data.data.reports)
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
                    Client Sale {new Date().getMonth() < 3 ? `${new Date().getFullYear() - 1}-${new Date().getFullYear()}` : `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`}
                </Typography>
                <Stack direction={'row'} gap={2} alignItems={'center'}>
                    {user?.erp_access_fields.is_editable && <>
                        <UploadClientSalesButton disabled={!user?.erp_access_fields.is_editable} />
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
                        <STableRow >

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
                                Total Old Qty
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                Total New Qty
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                APR
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                MAY
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                JUN
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                JUL
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                AUG
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                SEP
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                OCT
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                NOV
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                DEC
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                JAN
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                FEB
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                MAR
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
                                        <STableCell style={{ padding: '10px' }}>
                                            {report.created_at && moment(new Date(report.created_at)).format('DD/MM/YY')}
                                        </STableCell>
                                        <STableCell>
                                            {report.report_owner && report.report_owner.state}
                                        </STableCell>
                                        <STableCell>
                                            {report.account && report.account.slice(0, 40)}
                                        </STableCell>

                                        <STableCell>
                                            {report.article ? report.article : "Na"}
                                        </STableCell>
                                        <STableCell>
                                            {report.oldqty ? report.oldqty : ""}
                                        </STableCell>
                                        <STableCell>
                                            {report.newqty ? report.newqty : ""}
                                        </STableCell>
                                        <STableCell>
                                            {report.apr ? report.apr : ""}
                                        </STableCell>
                                        <STableCell>
                                            {report.may ? report.may : ""}
                                        </STableCell>
                                        <STableCell>
                                            {report.jun ? report.jun : ""}
                                        </STableCell>
                                        <STableCell>
                                            {report.jul ? report.jul : ""}
                                        </STableCell>
                                        <STableCell>
                                            {report.aug ? report.aug : ""}
                                        </STableCell>
                                        <STableCell>
                                            {report.sep ? report.sep : ""}
                                        </STableCell>
                                        <STableCell>
                                            {report.oct ? report.oct : ""}
                                        </STableCell>
                                        <STableCell>
                                            {report.nov ? report.nov : ""}
                                        </STableCell>
                                        <STableCell>
                                            {report.dec ? report.dec : ""}
                                        </STableCell>
                                        <STableCell>
                                            {report.jan ? report.jan : ""}
                                        </STableCell>
                                        <STableCell>
                                            {report.feb ? report.feb : ""}
                                        </STableCell>
                                        <STableCell>
                                            {report.mar ? report.mar : ""}
                                        </STableCell>
                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>

            </Box>}
            {window.screen.width > 500 && <DBPagination filterCount={filterCount} paginationData={paginationData} setPaginationData={setPaginationData} setFilterCount={setFilterCount} />}
        </>

    )

}

