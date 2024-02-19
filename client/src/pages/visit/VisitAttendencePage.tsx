import { Search } from '@mui/icons-material'
import { Box, Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FuzzySearchVisits, GetVisitAttendences } from '../../services/VisitServices'
import DBPagination from '../../components/pagination/DBpagination';
import { BackendError } from '../..'
import { Menu as MenuIcon } from '@mui/icons-material';
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import { IUser } from '../../types/user.types'
import { GetUsers } from '../../services/UserServices'
import moment from 'moment'
import { IVisit } from '../../types/visit.types'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { UserContext } from '../../contexts/userContext'
import AttendenceTable from '../../components/tables/AttendenceTable'

export default function VisitAdminPage() {
    const { user } = useContext(UserContext)
    const [users, setUsers] = useState<IUser[]>([])
    const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [filter, setFilter] = useState<string | undefined>()
    const [visit, setVisit] = useState<IVisit>()
    const [visits, setVisits] = useState<IVisit[]>([])
    const [selectAll, setSelectAll] = useState(false)
    const MemoData = React.useMemo(() => visits, [visits])
    const [preFilteredData, setPreFilteredData] = useState<IVisit[]>([])
    const [preFilteredPaginationData, setPreFilteredPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [filterCount, setFilterCount] = useState(0)
    const [selectedVisits, setSelectedVisits] = useState<IVisit[]>([])
    const [userId, setUserId] = useState<string>()
    const [dates, setDates] = useState<{ start_date?: string, end_date?: string }>({
        start_date: moment(new Date().setDate(new Date().getDate())).format("YYYY-MM-DD")
        , end_date: moment(new Date().setDate(new Date().getDate()+1)).format("YYYY-MM-DD")
    })
    const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())

    const { data, isLoading, refetch: ReftechVisits } = useQuery<AxiosResponse<{
        visits: IVisit[], page: number, total: number, limit: number
    }>, BackendError>(["attendence", paginationData, userId, dates?.start_date, dates?.end_date], async () => GetVisitAttendences({ limit: paginationData?.limit, page: paginationData?.page, id: userId, start_date: dates?.start_date, end_date: dates?.end_date }))


    const { data: fuzzyvisits, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<{ visits: IVisit[], page: number, total: number, limit: number }>, BackendError>(["fuzzyattendence", filter], async () => FuzzySearchVisits({ searchString: filter, limit: paginationData?.limit, page: paginationData?.page }), {
        enabled: false
    })

    const [selectedData, setSelectedData] = useState<{
        date: string,
        person: string,
        visit_in: string,
        geocity: string,
        attendence: string,
        address: string,
    }[]>()

    const [sent, setSent] = useState(false)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    function handleExcel() {
        setAnchorEl(null)
        try {
            selectedData && ExportToExcel(selectedData, "attendences_data")
            setSent(true)
            setSelectAll(false)
            setSelectedData([])
            setSelectedVisits([])
        }
        catch (err) {
            console.log(err)
            setSent(false)
        }
    }


    // refine data
    useEffect(() => {
        let data: {
            date: string,
            person: string,
            geocity: string,
            visit_in: string,
            attendence: string,
            address: string,
        }[] = []
        selectedVisits.map((visit) => {
            return data.push(
                {
                    date: visit.start_day_credientials && moment(new Date(visit.start_day_credientials.timestamp)).format('DD/MM/YY'),
                    person: visit.created_by.username,
                    geocity: visit.visit_reports[0] && visit.visit_reports[0].real_city,
                    visit_in: visit.visit_reports[0] && new Date(visit.visit_reports[0].visit_in_credientials.timestamp).toLocaleTimeString('Lt'),
                    attendence: visit.start_day_credientials ? "Present" : "Absent",
                    address: visit.visit_reports[0] && visit.visit_reports[0].visit_in_credientials.address,
                })
        })
        if (data.length > 0)
            setSelectedData(data)
    }, [selectedVisits])


    useEffect(() => {
        if (isUsersSuccess)
            setUsers(usersData?.data)
    }, [users, isUsersSuccess, usersData])


    useEffect(() => {
        if (!filter) {
            setVisits(preFilteredData)
            setPaginationData(preFilteredPaginationData)
        }
    }, [filter])



    useEffect(() => {
        if (filter) {
            refetchFuzzy()
        }
    }, [paginationData])



    useEffect(() => {
        if (data && !filter) {
            setVisits(data.data.visits)
            setPreFilteredData(data.data.visits)
            setPreFilteredPaginationData({
                ...paginationData,
                page: data.data.page,
                limit: data.data.limit,
                total: data.data.total
            })
            setPaginationData({
                ...paginationData,
                page: data.data.page,
                limit: data.data.limit,
                total: data.data.total
            })
        }
    }, [data])

    useEffect(() => {
        if (fuzzyvisits && filter) {
            setVisits(fuzzyvisits.data.visits)
            let count = filterCount
            if (count === 0)
                setPaginationData({
                    ...paginationData,
                    page: fuzzyvisits.data.page,
                    limit: fuzzyvisits.data.limit,
                    total: fuzzyvisits.data.total
                })
            count = filterCount + 1
            setFilterCount(count)
        }
    }, [fuzzyvisits])
    return (
        <>

            {
                isLoading && <LinearProgress />
            }
            {
                isFuzzyLoading && <LinearProgress />
            }
            {/*heading, search bar and table menu */}

            <Stack
                spacing={2}
                padding={1}
                direction="row"
                justifyContent="space-between"
            >
                <Typography
                    variant={'h6'}
                    component={'h1'}
                    sx={{ pl: 1 }}
                >
                    Attendence
                </Typography>

                <Stack
                    direction="row"
                >
                    {/* search bar */}
                    < Stack direction="row" spacing={2}>

                        <TextField
                            fullWidth
                            size="small"
                            onChange={(e) => {
                                setFilter(e.currentTarget.value)
                                setFilterCount(0)
                            }}
                            placeholder={`${MemoData?.length} records...`}
                            style={{
                                fontSize: '1.1rem',
                                border: '0',
                            }}
                            onKeyUp={(e) => {
                                if (e.key === "Enter") {
                                    refetchFuzzy()
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                       

                    </Stack >
                    <>

                        {sent && <AlertBar message="File Exported Successfuly" color="success" />}


                        <IconButton size="small" color="primary"
                            onClick={(e) => setAnchorEl(e.currentTarget)
                            }
                            sx={{ border: 2, borderRadius: 3, marginLeft: 1 }}
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

                            < MenuItem onClick={() => {
                                handleExcel()
                            }}
                            >Export To Excel</MenuItem>
                        </Menu >
                    </>
                </Stack >
            </Stack >

            {/* filter dates and person */}
            <Stack direction="row" p={2} gap={2}>
                < TextField

                    size="small"
                    type="date"
                    id="start_date"
                    label="Start Date"
                    fullWidth
                    value={dates.start_date}
                    focused
                    onChange={(e) => {
                        if (e.currentTarget.value) {
                            setDates({
                                ...dates,
                                start_date: moment(e.target.value).format("YYYY-MM-DD")
                            })
                        }
                    }}
                />
                < TextField

                    size="small"
                    type="date"
                    id="end_date"
                    label="End Date"
                    focused
                    value={dates.end_date}
                    fullWidth
                    onChange={(e) => {
                        if (e.currentTarget.value) {
                            setDates({
                                ...dates,
                                end_date: moment(e.target.value).format("YYYY-MM-DD")
                            })
                        }
                    }}
                />
                {user?.assigned_users && user?.assigned_users.length > 0 && < TextField
                    focused
                    size="small"
                    select
                    SelectProps={{
                        native: true,
                    }}
                    onChange={(e) => {
                        setUserId(e.target.value)
                        ReftechVisits()
                    }}
                    required
                    id="visit_owner"
                    label="Person"
                    fullWidth
                >
                    <option key={'00'} value={undefined}>

                    </option>
                    {
                        users.map((user, index) => {
                            if (!user.visit_access_fields.is_hidden)
                                return (<option key={index} value={user._id}>
                                    {user.username}
                                </option>)
                            else
                                return null
                        })
                    }
                </TextField>}
            </Stack>

            {/* table */}
            {isLoading && <TableSkeleton />}
            {!isLoading &&
                <Box sx={{ px: 2 }}>
                    <AttendenceTable
                        attendence={visit}
                        setAttendence={setVisit}
                        selectAll={selectAll}
                        selectedAttendeces={selectedVisits}
                        setSelectedAttendeces={setSelectedVisits}
                        setSelectAll={setSelectAll}
                        attendences={MemoData}
                    />
                </Box>}
            <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} setFilterCount={setFilterCount} />
        </>

    )

}


