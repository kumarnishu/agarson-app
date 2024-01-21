import { Search } from '@mui/icons-material'
import { Fade, IconButton, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import DBPagination from '../../components/pagination/DBpagination';
import TrackersTable from '../../components/tables/TrackersTable';
import { FuzzySearchTrackers, GetTrackers, ResetTrackers } from '../../services/BotServices'
import { BackendError } from '../..'
import { Menu as MenuIcon } from '@mui/icons-material';
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import { IMenuTracker } from '../../types/bot.types'
import { queryClient } from '../../main'
import { UserContext } from '../../contexts/userContext'
import TableSkeleton from '../../components/skeleton/TableSkeleton'


export default function TrackersPage() {
    const [paginationData, setPaginationData] = useState({ limit: 10, page: 1, total: 1 });
    const { user } = useContext(UserContext)
    const [reactPaginationData, setReactPaginationData] = useState({ limit: 10, page: 1, total: 1 });
    const [filter, setFilter] = useState<string | undefined>()
    const [tracker, setTracker] = useState<IMenuTracker>()
    const [trackers, setTrackers] = useState<IMenuTracker[]>([])

    const [allfuzzytrackers, setAllFuzzyTrackers] = useState<IMenuTracker[]>([])
    const FuzzyMemoData = React.useMemo(() => allfuzzytrackers, [allfuzzytrackers])

    // pagination  states
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + reactPaginationData.limit;
    const currentItems = FuzzyMemoData.slice(itemOffset, endOffset)


    const [selectAll, setSelectAll] = useState(false)
    const MemoData = React.useMemo(() => trackers, [trackers])
    const [preFilteredData, setPreFilteredData] = useState<IMenuTracker[]>([])
    const [selectedTrackers, setSelectedTrackers] = useState<IMenuTracker[]>([])
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [filterCount, setFilterCount] = useState(0)
    const { data, isSuccess, isLoading } = useQuery<AxiosResponse<{ trackers: IMenuTracker[], page: number, total: number, limit: number }>, BackendError>(["trackers", paginationData], async () => GetTrackers({ limit: paginationData?.limit, page: paginationData?.page }))

    const { data: fuzzyTrackers, isSuccess: isFuzzySuccess, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<IMenuTracker[]>, BackendError>(["fuzzytrackers", filter], async () => FuzzySearchTrackers(filter), {
        enabled: false
    })
    const { mutate, isSuccess: idResetSuccesss } = useMutation
        <AxiosResponse<IMenuTracker>, BackendError>
        (ResetTrackers, {
            onSuccess: () => {
                queryClient.invalidateQueries('trackers')
            }
        })
    const [selectedData, setSelectedData] = useState<any[]>([])
    const [sent, setSent] = useState(false)
    const [reset, setReset] = useState(false)


    function handleExcel() {
        setAnchorEl(null)
        try {
            if (selectedData.length === 0) {
                alert("select at least one row")
                return
            }
            ExportToExcel(selectedData, "trackers_data")
            setSent(true)
            setSelectAll(false)
            setSelectedData([])
            setSelectedTrackers([])
        }
        catch (err) {
            console.log(err)
            setSent(false)
        }
    }

    function handleResetTrackers() {
        setAnchorEl(null)
        try {
            mutate()
            setReset(true)
            setSelectAll(false)
            setSelectedData([])
            setSelectedTrackers([])
        }
        catch (err) {
            console.log(err)
            setSent(false)
        }
    }
    // refine data
    useEffect(() => {
        let data: any[] = []
        selectedTrackers.map((tracker) => {
            return data.push(

                {
                    flow_name: tracker.flow.flow_name,
                    customer_phone: tracker.phone_number,
                    customer_name: tracker.customer_name,
                    last_interaction: new Date(tracker.updated_at),
                    connected_numbers: tracker.flow.connected_users && tracker.flow.connected_users.map((user) => {
                        return user.username + ","
                    }).toString() || "",
                    connected_users: tracker.flow.connected_users && tracker.flow.connected_users.map((user) => {
                        return user.connected_number + ","
                    }).toString() || ""
                })
        })
        if (data.length > 0)
            setSelectedData(data)
    }, [selectedTrackers])


    useEffect(() => {
        if (isSuccess) {
            setTrackers((data.data.trackers))
            setPreFilteredData(data.data.trackers)
            setPaginationData({
                ...paginationData,
                page: data.data.page,
                limit: data.data.limit,
                total: data.data.total
            })
        }
    }, [isSuccess, data])


    useEffect(() => {
        if (!filter)
            setTrackers(preFilteredData)
    }, [filter])


    useEffect(() => {
        if (isFuzzySuccess) {
            setAllFuzzyTrackers(fuzzyTrackers.data)
            setReactPaginationData({
                ...reactPaginationData,
                total: Math.ceil(fuzzyTrackers.data.length / reactPaginationData.limit)
            })
        }
    }, [isFuzzySuccess, fuzzyTrackers])

    useEffect(() => {
        setItemOffset(reactPaginationData.page * reactPaginationData.limit % reactPaginationData.total)
    }, [reactPaginationData])
    console.log(filterCount)
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
                    Trackers
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
                        {reset && idResetSuccesss && <AlertBar message="trackers reset Successfuly" color="success" />}


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
                            {user?.is_admin && < MenuItem onClick={handleResetTrackers}
                            >Reset Trackers</MenuItem>}
                            < MenuItem onClick={handleExcel}
                            >Export To Excel</MenuItem>
                        </Menu >

                    </>
                </Stack>
            </Stack>
            {/* table */}
            {isLoading && <TableSkeleton />}
            {!isLoading &&
                <TrackersTable
                    tracker={tracker}
                    setTracker={setTracker}
                    selectAll={selectAll}
                    selectedTrackers={selectedTrackers}
                    setSelectedTrackers={setSelectedTrackers}
                    setSelectAll={setSelectAll}
                    trackers={filter ? currentItems : MemoData}
                    selectableTrackers={filter ? allfuzzytrackers : trackers}
                />}

            <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} setFilterCount={setFilterCount} />

        </>

    )

}

