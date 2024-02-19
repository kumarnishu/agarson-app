import { Search } from '@mui/icons-material'
import { Box, Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FuzzySearchVisits, GetVisits } from '../../services/VisitServices'
import DBPagination from '../../components/pagination/DBpagination';
import { BackendError } from '../..'
import { Menu as MenuIcon } from '@mui/icons-material';
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import { IUser } from '../../types/user.types'
import { GetUsers } from '../../services/UserServices'
import moment from 'moment'
import VisitTable from '../../components/tables/VisitTable'
import { IVisitReport } from '../../types/visit.types'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { UserContext } from '../../contexts/userContext'
import sortBy from "sort-by"

export default function VisitAdminPage() {
    const [sorted, setSorted] = useState(false)
    const { user } = useContext(UserContext)
    const [users, setUsers] = useState<IUser[]>([])
    const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [filter, setFilter] = useState<string | undefined>()
    const [visit, setVisit] = useState<IVisitReport>()
    const [visits, setVisits] = useState<IVisitReport[]>([])
    const [selectAll, setSelectAll] = useState(false)
    const MemoData = React.useMemo(() => visits, [visits])
    const [preFilteredData, setPreFilteredData] = useState<IVisitReport[]>([])
    const [preFilteredPaginationData, setPreFilteredPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [filterCount, setFilterCount] = useState(0)
    const [selectedVisits, setSelectedVisits] = useState<IVisitReport[]>([])
    const [userId, setUserId] = useState<string>()
    const [dates, setDates] = useState<{ start_date?: string, end_date?: string }>({
        start_date: moment(new Date().setDate(new Date().getDate())).format("YYYY-MM-DD")
        , end_date: moment(new Date().setDate(new Date().getDate() + 1)).format("YYYY-MM-DD")
    })
    const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())

    const { data, isLoading, refetch: ReftechVisits } = useQuery<AxiosResponse<{ visits: IVisitReport[], page: number, total: number, limit: number }>, BackendError>(["visits", paginationData, userId, dates?.start_date, dates?.end_date], async () => GetVisits({ limit: paginationData?.limit, page: paginationData?.page, id: userId, start_date: dates?.start_date, end_date: dates?.end_date }))


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
                    date: visit.visit.start_day_credientials && moment(new Date(visit.visit.start_day_credientials.timestamp)).format('DD/MM/YY'),
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

    useEffect(() => {
        if (sorted) {
            let result = visits.sort(sortBy('person.username'))
            setVisits(result)
        }
    }, [sorted])
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
                p={1}
                direction="row"
                justifyContent="space-between"
            >
                <Typography
                    variant={'h6'}
                    component={'h1'}
                >
                    Visit
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            onKeyUp={(e) => {
                                if (e.key === "Enter") {
                                    refetchFuzzy()
                                }
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
            <Stack direction="row" p={1} gap={2}>
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
                <Box sx={{ px: 1 }}>
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
            <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} setFilterCount={setFilterCount} />
        </>

    )

}
