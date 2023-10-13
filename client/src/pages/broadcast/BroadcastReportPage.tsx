import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem,  TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React, { useEffect, useState } from 'react'
import BroadcastsReportsTable from '../../components/tables/BroadcastsReportsTable'
import { useQuery } from 'react-query'
import { AxiosResponse } from 'axios'
import { GetBroadcastPaginatedReports, GetBroadcastReportsByMobile } from '../../services/BroadCastServices'
import { BackendError } from '../..'
import DBPagination from '../../components/pagination/DBpagination'
import { Menu as MenuIcon } from '@mui/icons-material';
import FileSaver from 'file-saver'
import AlertBar from '../../components/snacks/AlertBar'
import { IBroadcast, IBroadcastReport } from '../../types/broadcast.types'


export default function BroadcastReportPage({ broadcast }: { broadcast: IBroadcast }) {
    const [paginationData, setPaginationData] = useState({ limit: 10, page: 1, total: 1 });
    const { data, isSuccess, isLoading, refetch } = useQuery<AxiosResponse<{ reports: IBroadcastReport[], page: number, total: number, limit: number }>, BackendError>(["paginated_reports", paginationData], async () => GetBroadcastPaginatedReports({ id: broadcast._id, limit: paginationData?.limit, page: paginationData?.page }))

    const { data: filteredReports, isSuccess: isSearchSuccess, refetch: Refetchsearch } = useQuery<AxiosResponse<IBroadcastReport[]>, BackendError>(["search_reports", paginationData], async () => GetBroadcastReportsByMobile({ id: broadcast._id, mobile: filter }), { enabled: false })

    const [filter, setFilter] = useState<string | undefined>()
    const [report, setReport] = useState<IBroadcastReport>()
    const [reports, setReports] = useState<IBroadcastReport[]>([])
    const MemoData = React.useMemo(() => reports, [reports])
    const [sent, setSent] = useState(false)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    function HandleExport() {
        if (broadcast)
            FileSaver.saveAs(`/api/v1/download/reports/broadcasts?id=${broadcast._id}`, "broadcast_report.xlsx")
    }

    function handleExcel() {
        setAnchorEl(null)
        HandleExport()
        setSent(true)
    }
    useEffect(() => {
        if (isSuccess) {
            setReports(data.data.reports)
            setPaginationData({
                ...paginationData,
                page: data.data.page,
                limit: data.data.limit,
                total: data.data.total
            })
        }
    }, [isSuccess, data])

    useEffect(() => {
        setReport(report)
    }, [report])

    useEffect(() => {
        if (!filter) {
            refetch()
        }
    }, [filter])


    useEffect(() => {
        if (isSearchSuccess) {
            setReports(filteredReports.data)
        }
    }, [isSearchSuccess, filteredReports])

    return (
        <>
            {isLoading && <LinearProgress />}
            {/*heading, search bar and table menu */}
            <Stack
                spacing={2}
                padding={1}
                direction="row"
                justifyContent="space-between"
                width="100vw"
            >
                <Typography
                    variant={'h6'}
                    component={'h1'}
                    sx={{ pl: 1 }}
                >
                    Broadcast Reports
                </Typography>

                <Stack
                    direction="row"
                >
                    {/* search bar */}
                    < Stack direction="row" spacing={2}>
                        <TextField
                            fullWidth
                            size="small"
                            onChange={(e) => setFilter(e.currentTarget.value)}
                            autoFocus
                            onKeyUp={(e) => {
                                if (e.key === "Enter") {
                                    Refetchsearch()
                                }
                            }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>,
                            }}
                            placeholder={`${MemoData?.length} records...`}
                            style={{
                                fontSize: '1.1rem',
                                border: '0',
                            }}
                        />
                        <IconButton
                            sx={{ bgcolor: 'whitesmoke' }}
                            onClick={() => {
                                Refetchsearch()
                            }}
                        >
                            <Search />
                        </IconButton>
                    </Stack >
                    {/* menu */}
                    <>

                        {sent && <AlertBar message="File Exported Successfuly" color="success" />}

                        <IconButton size="medium"
                            onClick={(e) => setAnchorEl(e.currentTarget)
                            }
                            sx={{ border: 1, borderRadius: 2, marginLeft: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)
                            }
                            TransitionComponent={Fade}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem onClick={handleExcel}
                            >Export To Excel</MenuItem>

                        </Menu>
                    </>

                </Stack>
            </Stack>

            {/*  table */}
            <BroadcastsReportsTable
                setReport={setReport}
                report={report}
                reports={MemoData}
            />
            <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} />
        </>
    )

}

