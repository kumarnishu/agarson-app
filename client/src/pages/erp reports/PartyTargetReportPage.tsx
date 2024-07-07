import { Box, Button, InputAdornment, LinearProgress, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import DBPagination from '../../components/pagination/DBpagination';
import { BackendError } from '../..'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { GetPartyTargetReports } from '../../services/ErpServices'
import { IPartyTargetReport } from '../../types/erp_report.types'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../components/styled/STyledTable'
import { UserContext } from '../../contexts/userContext'
import { Download, Search } from '@mui/icons-material'
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import FuzzySearch from 'fuzzy-search'
import moment from 'moment'
import UploadPartyTargetButton from '../../components/buttons/UploadPartyTargetButton'


export default function PartyTargetReportsPage() {
    const [paginationData, setPaginationData] = useState({ limit: 1000, page: 1, total: 1 });
    const [reports, setPartyTargetReports] = useState<IPartyTargetReport[]>([])
    const { user } = useContext(UserContext)
    const [filter, setFilter] = useState<string | undefined>()
    const [preFilteredData, setPreFilteredData] = useState<IPartyTargetReport[]>([])
    const [sent, setSent] = useState(false)
    const { data, isLoading } = useQuery<AxiosResponse<{ reports: IPartyTargetReport[], page:0, total:0, limit:0 }>, BackendError>(["reports", paginationData], async () => GetPartyTargetReports({ limit: paginationData?.limit, page: paginationData?.page }))


    function handleExcel() {
        try {
            let data = [
                {
                    slno:"640",
                    PARTY:"LUCKY MACHINERY & TOOLS, PATNA",
                    Create_Date:"14-01-2022",
                    STATION:"PATNA",
                    SALES_OWNER:"BIHAR",
                    report_owner: "Goa",
                    All_TARGET:"10/2 - 15/3",
                    TARGET: 1000000,
                    PROJECTION: 338975.96,
                    GROWTH:"0.9",
                    TARGET_ACHIEVE:"0.34",
                    TOTAL_SALE_OLD:0,
                    TOTAL_SALE_NEW:0,
                    Last_Apr:0,
                    Cur_Apr:0,
                    Last_May:0,
                    Cur_May:0,
                    Last_Jun:0,
                    Cur_Jun:0,
                    Last_Jul:0,
                    Cur_Jul:0,
                    Last_Aug:0,
                    Cur_Aug:0,
                    Last_Sep:0,
                    Cur_Sep:0,
                    Last_Oct:0,
                    Cur_Oct:0,
                    Last_Nov:0,
                    Cur_Nov:0,
                    Last_Dec:0,
                    Cur_Dec:0,
                    Last_Jan:0,
                    Cur_Jan:0,
                    Last_Feb:0,
                    Cur_Feb:0,
                    Last_Mar:0,
                    Cur_Mar:0,
                }
            ]
            ExportToExcel(data, "party_target_template")
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
            setPartyTargetReports(result)
        }
        if (!filter)
            setPartyTargetReports(preFilteredData)

    }, [filter])

    useEffect(() => {
        if (data&&!filter) {
            setPartyTargetReports(data.data.reports)
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
                >
                    Party target
                </Typography>
                <Stack direction={'row'} gap={2} alignItems={'center'}>
                    {user?.erp_access_fields.is_editable && <>
                        <UploadPartyTargetButton disabled={!user?.erp_access_fields.is_editable} />
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
                               Upload Date
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                Sl.No
                            </STableHeadCell>

                            <STableHeadCell
                            >
                                Party
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                Create Date
                            </STableHeadCell>
                            <STableHeadCell
                            >
                               Station
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                Sales Owner
                            </STableHeadCell>
                            <STableHeadCell
                            >
                               All Target
                            </STableHeadCell>
                            <STableHeadCell
                            >
                               Target
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                Projection
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                Growth
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                Target Achieved
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                Total sale Old
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                Total sale New
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                L-Apr
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                C-Apr
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                L-May
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                C-May
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                L-Jun
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                C-Jun
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                L-Jul
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                C-Jul
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                L-Aug
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                C-Aug
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                L-Sep
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                C-Sep
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                L-Oct
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                C-Oct
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                L-Nov
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                C-Nov
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                L-Dec
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                C-Dec
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                L-Jan
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                C-Jan
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                L-Feb
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                C-Feb
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                L-Mar
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                C-Mar
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
                                     
                                        <STableCell
                                        >
                                           {report.slno||""}
                                        </STableCell>

                                        <STableCell 
                                        >
                                            {report.PARTY || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Create_Date || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.STATION || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.SALES_OWNER || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.All_TARGET || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.TARGET || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.PROJECTION || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.GROWTH || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.TARGET_ACHIEVE || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.TOTAL_SALE_OLD || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.TOTAL_SALE_NEW || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Last_Apr || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Cur_Apr || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Last_May || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Cur_May || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Last_Jun || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Cur_Jun || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Last_Jul || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Cur_Jul || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Last_Aug || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Cur_Aug || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Last_Sep || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Cur_Sep || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Last_Oct || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Cur_Oct || ""}
                                        </STableCell>
                                        <STableCell
                                        >{report.Last_Nov || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Cur_Nov || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Last_Dec || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Cur_Dec || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Last_Jan || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Cur_Jan || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Last_Feb || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Cur_Feb || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Last_Mar || ""}
                                        </STableCell>
                                        <STableCell
                                        >
                                            {report.Cur_Mar || ""}
                                        </STableCell>
                                    </STableRow>
                                )
                            })}

                    </STableBody>
                </STable>

            </Box>}
            {window.screen.width > 500 && <DBPagination  paginationData={paginationData} setPaginationData={setPaginationData} />}
        </>

    )

}

