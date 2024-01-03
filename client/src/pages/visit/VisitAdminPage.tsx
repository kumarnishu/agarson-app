import { Search } from '@mui/icons-material'
import { Box, Fade, FormControlLabel, IconButton, LinearProgress, Menu, MenuItem, Switch, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FuzzySearchVisits, GetVisitAttendences, GetVisits } from '../../services/VisitServices'
import DBPagination from '../../components/pagination/DBpagination';
import { BackendError } from '../..'
import { Menu as MenuIcon } from '@mui/icons-material';
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import { IUser } from '../../types/user.types'
import { GetUsers } from '../../services/UserServices'
import moment from 'moment'
import VisitTable from '../../components/tables/VisitTable'
import { IVisit, IVisitReport } from '../../types/visit.types'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import AttendenceTable from '../../components/tables/AttendenceTable'
import { UserContext } from '../../contexts/userContext'
import sortBy from "sort-by"

export default function VisitAdminPage() {
    const [display, setDisplay] = useState(false)
    const [sorted, setSorted] = useState(false)
    const [attendences, setAttendences] = useState<{
        _id: string; date: Date; visits: IVisit[]
    }[]>([])
    const { user } = useContext(UserContext)
    const [users, setUsers] = useState<IUser[]>([])
    const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [filter, setFilter] = useState<string | undefined>()
    const [attendence, setAttendence] = useState<{
        _id: string; date: Date; visits: IVisit[]
    }>()
    const [visit, setVisit] = useState<IVisitReport>()
    const [visits, setVisits] = useState<IVisitReport[]>([])
    const [selectAll, setSelectAll] = useState(false)
    const AttendenceMemoData = React.useMemo(() => attendences, [attendences])
    const MemoData = React.useMemo(() => visits, [visits])
    const [preFilteredData, setPreFilteredData] = useState<IVisitReport[]>([])
    const [preFilteredAttendenceData, setPreFiltereAttendencedData] = useState<{
        _id: string; date: Date; visits: IVisit[]
    }[]>([])
    const [preFilteredPaginationData, setPreFilteredPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [filterCount, setFilterCount] = useState(0)
    const [selectedVisits, setSelectedVisits] = useState<IVisitReport[]>([])
    const [selectedAttendeces, setSelectedAttendeces] = useState<{
        _id: string; date: Date; visits: IVisit[]
    }[]>([])
    const [userId, setUserId] = useState<string>()
    const [dates, setDates] = useState<{ start_date?: string, end_date?: string }>({
        start_date: moment(new Date().setDate(new Date().getDate() - 1)).format("YYYY-MM-DD")
        , end_date: moment(new Date().setDate(new Date().getDate())).format("YYYY-MM-DD")
    })
    const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())

    const { data, isLoading, refetch: ReftechVisits } = useQuery<AxiosResponse<{ visits: IVisitReport[], page: number, total: number, limit: number }>, BackendError>(["visits", paginationData, userId, dates?.start_date, dates?.end_date], async () => GetVisits({ limit: paginationData?.limit, page: paginationData?.page, id: userId, start_date: dates?.start_date, end_date: dates?.end_date }))

    const { data: attendencesData, isLoading: isAttendenceLoading, refetch: ReftechVisitAttendence } = useQuery<AxiosResponse<{
        result: {
            _id: string; date: Date; visits: IVisit[]
        }[], page: number, total: number, limit: number
    }>, BackendError>(["attendence", paginationData, userId, dates?.start_date, dates?.end_date], async () => GetVisitAttendences({ limit: paginationData?.limit, page: paginationData?.page, id: userId, start_date: dates?.start_date, end_date: dates?.end_date }))


    const { data: fuzzyvisits, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<{ visits: IVisitReport[], page: number, total: number, limit: number }>, BackendError>(["fuzzyvisits", filter], async () => FuzzySearchVisits({ searchString: filter, limit: paginationData?.limit, page: paginationData?.page }), {
        enabled: false
    })

    const [selectedData, setSelectedData] = useState<{
        date: string,
        start_day: string,
        start_day_location: string,
        start_day_coordinates: string,
        start_day_photo: string,
        end_day: string,
        end_day_location: string,
        end_day_coordinates: string,
        end_day_photo: string,
        visit_in: string,
        visit_in_location: string,
        visit_in_coordinates: string,
        visit_in_photo: string,
        visit_out: string,
        visit_out_location: string,
        visit_out_coordinates: string,
        person: string,
        party: string,
        mobile: string,
        station: string,
        is_validated: string,
        is_old: string,
        turnover: string,
        dealer_of: string,
        references_taken: string,
        reviews_taken: number,
        summary: string,
        ankit_input: string,
        brijesh_input: string,
        created_at: string,
        updated_at: string,
        updated_by: string,
        created_by: string,
    }[]>()
    const [selectedData2, setSelectedData2] = useState<{
        date: string,
        person: string,
        start_time: string,
        attendence: string,
        address: string,

    }[]>()
    const [sent, setSent] = useState(false)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    function handleExcel() {
        setAnchorEl(null)
        try {
            selectedData && ExportToExcel(selectedData, "visits_data")
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
    function handleExcel2() {
        setAnchorEl(null)
        try {
            selectedData2 && ExportToExcel(selectedData2, "attendence_data")
            setSent(true)
            setSelectAll(false)
            setSelectedData2([])
            setSelectedAttendeces([])
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
            start_day: string,
            start_day_location: string,
            start_day_coordinates: string,
            start_day_photo: string,
            end_day: string,
            end_day_location: string,
            end_day_coordinates: string,
            end_day_photo: string,
            visit_in: string,
            visit_in_location: string,
            visit_in_coordinates: string,
            visit_in_photo: string,
            visit_out: string,
            visit_out_location: string,
            visit_out_coordinates: string,
            person: string,
            party: string,
            station: string,
            mobile: string,
            is_validated: string,
            is_old: string,
            turnover: string,
            dealer_of: string,
            references_taken: string,
            reviews_taken: number,
            summary: string,
            ankit_input: string,
            brijesh_input: string,
            created_at: string,
            updated_at: string,
            updated_by: string,
            created_by: string,
        }[] = []
        selectedVisits.map((visit) => {
            return data.push(
                {
                    date: new Date(visit.visit.start_day_credientials && visit.visit.start_day_credientials.timestamp).toLocaleDateString(),
                    start_day: new Date(visit.visit.start_day_credientials && visit.visit.start_day_credientials.timestamp).toLocaleTimeString(),
                    start_day_location: visit.visit.start_day_credientials && visit.visit.start_day_credientials.address,
                    start_day_coordinates: visit.visit.start_day_credientials && visit.visit.start_day_credientials.latitude + "," + visit.visit.start_day_credientials.longitude,
                    start_day_photo: visit.visit.start_day_photo && visit.visit.start_day_photo?.public_url || "",
                    end_day: new Date(visit.visit.end_day_credentials && visit.visit.end_day_credentials.timestamp).toLocaleTimeString(),
                    end_day_location: visit.visit.end_day_credentials && visit.visit.end_day_credentials.address,
                    end_day_coordinates: visit.visit.end_day_credentials && visit.visit.end_day_credentials.latitude + "," + visit.visit.end_day_credentials.longitude,
                    end_day_photo: visit.visit.end_day_photo && visit.visit.end_day_photo?.public_url || "",
                    visit_in: new Date(visit.visit_in_credientials && visit.visit_in_credientials.timestamp).toLocaleTimeString(),
                    visit_in_location: visit.visit_in_credientials && visit.visit_in_credientials.address,
                    visit_in_coordinates: visit.visit_in_credientials && visit.visit_in_credientials.latitude + "," + visit.visit_in_credientials.longitude,
                    visit_in_photo: visit.visit_in_photo && visit.visit_in_photo?.public_url || "",
                    visit_out: new Date(visit.visit_out_credentials && visit.visit_out_credentials.timestamp).toLocaleTimeString(),
                    visit_out_location: visit.visit_out_credentials && visit.visit_out_credentials.address,
                    visit_out_coordinates: visit.visit_out_credentials && visit.visit_out_credentials.latitude + "," + visit.visit_out_credentials.longitude,
                    person: visit.person.username,
                    party: visit.party_name,
                    mobile: visit.mobile,
                    station: visit.city,
                    is_validated: visit.visit_validated ? "yes" : "no",
                    is_old: visit.is_old_party ? "old" : "new",
                    turnover: visit.turnover,
                    dealer_of: visit.dealer_of,
                    references_taken: visit.refs_given,
                    reviews_taken: visit.reviews_taken,
                    summary: visit.summary,
                    ankit_input: visit.ankit_input && visit.ankit_input.input,
                    brijesh_input: visit.brijesh_input && visit.brijesh_input.input,
                    created_at: visit.created_at.toLocaleString(),
                    created_by: visit.created_by.username,
                    updated_by: visit.updated_by.username,
                    updated_at: visit.updated_at.toLocaleString(),
                })
        })
        if (data.length > 0)
            setSelectedData(data)
    }, [selectedVisits])

    //refine data2
    useEffect(() => {
        let data: {
            date: string,
            person: string,
            start_time: string,
            attendence: string,
            address: string,
        }[] = []
        selectedAttendeces.forEach((attend) => {
            attend.visits.map((visit1: IVisit) => {
                data.push({
                    date: new Date(attend.date).toLocaleDateString(), person: visit1.created_by.username, attendence: visit1.is_present ? "Present" : "",
                    start_time: moment(new Date(visit1.start_day_credientials.timestamp)).format('LT'),
                    address: visit1.start_day_credientials.address
                })
            })
        })
        if (data.length > 0)
            setSelectedData2(data)
    }, [selectedAttendeces])

    useEffect(() => {
        if (isUsersSuccess)
            setUsers(usersData?.data)
    }, [users, isUsersSuccess, usersData])


    useEffect(() => {
        if (!filter) {
            setVisits(preFilteredData)
            setAttendences(preFilteredAttendenceData)
            setPaginationData(preFilteredPaginationData)
        }
    }, [filter])

    useEffect(() => {
        if (attendencesData && !filter && display) {
            setAttendences(attendencesData.data.result)
            setPreFiltereAttendencedData(attendencesData.data.result)
            setPreFilteredPaginationData({
                ...paginationData,
                page: attendencesData.data.page,
                limit: attendencesData.data.limit,
                total: attendencesData.data.total
            })
            setPaginationData({
                ...paginationData,
                page: attendencesData.data.page,
                limit: attendencesData.data.limit,
                total: attendencesData.data.total
            })
        }
    }, [attendencesData])

    useEffect(() => {
        if (filter) {
            refetchFuzzy()
        }
    }, [paginationData])

    useEffect(() => {
        if (display) {
            ReftechVisitAttendence()
        }
    }, [display, dates, userId])

    useEffect(() => {
        if (data && !filter && !display) {
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
    }, [data, display])

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

    useEffect(() => {
        if (sorted) {
            let result = visits.sort(sortBy('person.username'))
            setVisits(result)
        }else{
            let result = visits.sort(sortBy('-created_at'))
            setVisits(result)
        }
    }, [sorted])
    return (
        <>

            {
                isLoading && <LinearProgress />
            }
            {isAttendenceLoading && <LinearProgress />}
            {
                isFuzzyLoading && <LinearProgress />
            }
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
                    {display ? `Attendence : ${attendences.length} days` : "Visit"}
                </Typography>

                <Stack
                    direction="row"
                >
                    {/* search bar */}
                    < Stack direction="row" spacing={2}>
                        <FormControlLabel control={<Switch
                            checked={Boolean(display)}
                            onChange={() => setDisplay(!display)}
                        />} label="Attendence" />
                        {!display &&
                            <>
                                <TextField
                                    fullWidth
                                    size="small"
                                    onChange={(e) => {
                                        setFilter(e.currentTarget.value)
                                        setFilterCount(0)
                                    }}
                                    autoFocus
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
                                />
                                <IconButton
                                    sx={{ bgcolor: 'whitesmoke' }}
                                    onClick={() => {
                                        refetchFuzzy()
                                    }}
                                >
                                    <Search />
                                </IconButton>
                            </>
                        }

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
                                if (display) {
                                    handleExcel2()
                                }
                                else
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
            {!isLoading && !display &&
                <Box sx={{ px: 2 }}>
                    <VisitTable
                        visit={visit}
                        sorted={sorted}
                        setSorted={setSorted}
                        setVisit={setVisit}
                        selectAll={selectAll}
                        selectedVisits={selectedVisits}
                        setSelectedVisits={setSelectedVisits}
                        setSelectAll={setSelectAll}
                        visits={MemoData}
                    />
                </Box>}
            {!isLoading && display &&
                <Box sx={{ px: 2 }}>
                    <AttendenceTable
                        attendence={attendence}
                        setAttendence={setAttendence}
                        selectAll={selectAll}
                        selectedAttendeces={selectedAttendeces}
                        setSelectedAttendeces={setSelectedAttendeces}
                        setSelectAll={setSelectAll}
                        attendences={AttendenceMemoData}
                    />
                </Box>}
            <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} setFilterCount={setFilterCount} />
        </>

    )

}

