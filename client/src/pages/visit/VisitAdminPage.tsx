import { Check, Search } from '@mui/icons-material'
import { Fade, IconButton, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
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
import { UserContext } from '../../contexts/userContext'
import VisitTable from '../../components/tables/VisitTable'
import { IVisitReport } from '../../types/visit.types'


export default function VisitAdminPage() {
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
        start_date: moment(new Date().setDate(1)).format("YYYY-MM-DD")
        , end_date: moment(new Date().setDate(30)).format("YYYY-MM-DD")
    })
    const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", GetUsers)

    const { data, isLoading, refetch: ReftechVisits } = useQuery<AxiosResponse<{ visits: IVisitReport[], page: number, total: number, limit: number }>, BackendError>(["visits", paginationData, userId, dates?.start_date, dates?.end_date], async () => GetVisits({ limit: paginationData?.limit, page: paginationData?.page, id: userId, start_date: dates?.start_date, end_date: dates?.end_date }))

    const { data: fuzzyvisits, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<{ visits: IVisitReport[], page: number, total: number, limit: number }>, BackendError>(["fuzzyvisits", filter], async () => FuzzySearchVisits({ searchString: filter, limit: paginationData?.limit, page: paginationData?.page }), {
        enabled: false
    })
    const [selectedData, setSelectedData] = useState<{
        party_name: string,
        person: string,
        created_at: string,
        updated_at: string,
        created_by: string,
        updated_by: string,
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
            party_name: string,
            person: string,
            created_at: string,
            updated_at: string,
            updated_by: string,
            created_by: string,
        }[] = []
        selectedVisits.map((visit) => {
            return data.push(
                {
                    party_name: visit.party_name,
                    person: visit.person.username,
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
                width="100vw"
            >
                <Typography
                    variant={'h6'}
                    component={'h1'}
                    sx={{ pl: 1 }}
                >
                    {window.screen.width > 450 ? "Visits Admin" : <Check />}
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
                    </Stack >
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

                            < MenuItem onClick={handleExcel}
                            >Export To Excel</MenuItem>

                        </Menu >
                    </>
                </Stack >
            </Stack >

            {/* filter dates and person */}
            <Stack padding={2} gap={2}>
                <Stack direction='row' gap={2} alignItems={'center'} justifyContent={'center'}>
                    < TextField
                        size="small"
                        type="date"
                        id="start_date"
                        label="Start Date"
                        fullWidth
                        value={dates.start_date}
                        focused
                        onChange={(e) => setDates({
                            ...dates,
                            start_date: moment(e.target.value).format("YYYY-MM-DD")
                        })}
                    />
                    < TextField
                        size="small"
                        type="date"
                        id="end_date"
                        label="End Date"
                        focused
                        value={dates.end_date}
                        fullWidth
                        onChange={(e) => setDates({
                            ...dates,
                            end_date: moment(e.target.value).format("YYYY-MM-DD")
                        })}
                    />
                </Stack>
                {user?.is_admin &&
                    < TextField
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
                        label="Filter Visits Of Indivdual"
                        fullWidth
                    >
                        <option key={'00'} value={undefined}>

                        </option>
                        {
                            users.map((user, index) => {
                                return (<option key={index} value={user._id}>
                                    {user.username}
                                </option>)
                            })
                        }
                    </TextField>}
            </Stack>

            {/* table */}
            <VisitTable
                visit={visit}
                setVisit={setVisit}
                selectAll={selectAll}
                selectedVisits={selectedVisits}
                setSelectedVisits={setSelectedVisits}
                setSelectAll={setSelectAll}
                visits={MemoData}
            />
            <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} setFilterCount={setFilterCount} />
        </>

    )

}

