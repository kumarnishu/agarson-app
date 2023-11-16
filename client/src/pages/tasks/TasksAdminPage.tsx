import { Search } from '@mui/icons-material'
import { Fade, IconButton, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FuzzySearchTasks, GetTasks } from '../../services/TaskServices'
import DBPagination from '../../components/pagination/DBpagination';
import TasksTable from '../../components/tables/TasksTable';
import { BackendError } from '../..'
import { Menu as MenuIcon } from '@mui/icons-material';
import { ChoiceContext, TaskChoiceActions } from '../../contexts/dialogContext'
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import { ITask } from '../../types/task.types'
import { IUser } from '../../types/user.types'
import { GetUsers } from '../../services/UserServices'
import moment from 'moment'
import { UserContext } from '../../contexts/userContext'
import NewTaskDialog from '../../components/dialogs/tasks/NewTaskDialog'




export default function TasksAdminPage() {
    const { user } = useContext(UserContext)
    const [users, setUsers] = useState<IUser[]>([])
    const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [filter, setFilter] = useState<string | undefined>()
    const [task, setTask] = useState<ITask>()
    const [tasks, setTasks] = useState<ITask[]>([])
    const [selectAll, setSelectAll] = useState(false)
    const MemoData = React.useMemo(() => tasks, [tasks])
    const [preFilteredData, setPreFilteredData] = useState<ITask[]>([])
    const [preFilteredPaginationData, setPreFilteredPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [filterCount, setFilterCount] = useState(0)
    const [selectedTasks, setSelectedTasks] = useState<ITask[]>([])
    const [userId, setUserId] = useState<string>()
    const [dates, setDates] = useState<{ start_date?: string, end_date?: string }>()
    const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", GetUsers)

    const { data, isLoading, refetch: ReftechTasks } = useQuery<AxiosResponse<{ tasks: ITask[], page: number, total: number, limit: number }>, BackendError>(["tasks", paginationData, userId, dates?.start_date, dates?.end_date], async () => GetTasks({ limit: paginationData?.limit, page: paginationData?.page, id: userId, start_date: dates?.start_date, end_date: dates?.end_date }))

    const { data: fuzzytasks, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<{ tasks: ITask[], page: number, total: number, limit: number }>, BackendError>(["fuzzytasks", filter], async () => FuzzySearchTasks({ searchString: filter, limit: paginationData?.limit, page: paginationData?.page }), {
        enabled: false
    })
    const [selectedData, setSelectedData] = useState<{
        task_description: string,
        person: string,
        created_at: string,
        updated_at: string,
        created_by: string,
        updated_by: string,
    }[]>()
    const [sent, setSent] = useState(false)
    const { setChoice } = useContext(ChoiceContext)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    function handleExcel() {
        setAnchorEl(null)
        try {
            selectedData && ExportToExcel(selectedData, "tasks_data")
            setSent(true)
            setSelectAll(false)
            setSelectedData([])
            setSelectedTasks([])
        }
        catch (err) {
            console.log(err)
            setSent(false)
        }
    }


    // refine data
    useEffect(() => {
        let data: {
            task_description: string,
            person: string,
            created_at: string,
            updated_at: string,
            updated_by: string,
            created_by: string,
        }[] = []
        selectedTasks.map((task) => {
            return data.push(
                {
                    task_description: task.task_description,
                    person: task.person.username,
                    created_at: task.created_at.toLocaleString(),
                    created_by: task.created_by.username,
                    updated_by: task.updated_by.username,
                    updated_at: task.updated_at.toLocaleString(),
                })
        })
        if (data.length > 0)
            setSelectedData(data)
    }, [selectedTasks])

    useEffect(() => {
        if (isUsersSuccess)
            setUsers(usersData?.data)
    }, [users, isUsersSuccess, usersData])

    useEffect(() => {
        if (!filter) {
            setTasks(preFilteredData)
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
            setTasks(data.data.tasks)
            setPreFilteredData(data.data.tasks)
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
        if (fuzzytasks && filter) {
            setTasks(fuzzytasks.data.tasks)
            let count = filterCount
            if (count === 0)
                setPaginationData({
                    ...paginationData,
                    page: fuzzytasks.data.page,
                    limit: fuzzytasks.data.limit,
                    total: fuzzytasks.data.total
                })
            count = filterCount + 1
            setFilterCount(count)
        }
    }, [fuzzytasks])

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
                    Tasks Admin
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
                            <MenuItem
                                onClick={() => {
                                    setChoice({ type: TaskChoiceActions.create_task })
                                    setAnchorEl(null)
                                }}
                            > Add New</MenuItem>
                            < MenuItem onClick={handleExcel}
                            >Export To Excel</MenuItem>

                        </Menu >
                        <NewTaskDialog />
                    </>
                </Stack >
            </Stack >

            {/* filter dates and person */}
            <Stack padding={2} gap={2}>
                <Stack direction='row' gap={2} alignItems={'center'} justifyContent={'center'}>
                    < TextField
                        type="date"
                        id="start_date"
                        label="Start Date"
                        fullWidth
                        focused
                        onChange={(e) => setDates({
                            ...dates,
                            start_date: moment(e.target.value).format("YYYY-MM-DD")
                        })}
                    />
                    < TextField
                        type="date"
                        id="end_date"
                        label="End Date"
                        focused
                        fullWidth
                        onChange={(e) => setDates({
                            ...dates,
                            end_date: moment(e.target.value).format("YYYY-MM-DD")
                        })}
                    />
                </Stack>
                {user?.is_admin &&
                    < TextField
                        select
                        SelectProps={{
                            native: true,
                        }}
                        onChange={(e) => {
                            setUserId(e.target.value)
                            ReftechTasks()
                        }}
                        required
                        id="task_owner"
                        label="Filter Tasks Of Indivdual"
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
            < TasksTable
                task={task}
                setTask={setTask}
                selectAll={selectAll}
                selectedTasks={selectedTasks}
                setSelectedTasks={setSelectedTasks}
                setSelectAll={setSelectAll}
                tasks={MemoData}
            />
            <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} setFilterCount={setFilterCount} />
        </>

    )

}

