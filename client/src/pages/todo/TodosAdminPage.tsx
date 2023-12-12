import { Search } from '@mui/icons-material'
import { Fade, FormControlLabel, IconButton, LinearProgress, Menu, MenuItem, Switch, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import DBPagination from '../../components/pagination/DBpagination';
import { BackendError } from '../..'
import { Menu as MenuIcon } from '@mui/icons-material';
import { ChoiceContext, TodoChoiceActions } from '../../contexts/dialogContext'
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import { ITodo } from '../../types/todo.types'
import { IUser } from '../../types/user.types'
import { GetUsers } from '../../services/UserServices'
import moment from 'moment'
import { UserContext } from '../../contexts/userContext'
import NewTodoDialog from '../../components/dialogs/todos/NewTodoDialog'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import TodoSTable from '../../components/tables/TodoTable'
import { FuzzySearchTodos, GetTodos } from '../../services/TodoServices'
import BulkHideTodoDialog from '../../components/dialogs/todos/BulkHideTodoDialog'


export default function TodosAdminPage() {
    const [hidden, setHidden] = useState(false)
    const { user } = useContext(UserContext)
    const [users, setUsers] = useState<IUser[]>([])
    const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [filter, setFilter] = useState<string | undefined>()
    const [todo, setTodo] = useState<ITodo>()
    const [todos, setTodos] = useState<ITodo[]>([])
    const [selectAll, setSelectAll] = useState(false)
    const MemoData = React.useMemo(() => todos, [todos])
    const [preFilteredData, setPreFilteredData] = useState<ITodo[]>([])
    const [preFilteredPaginationData, setPreFilteredPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [filterCount, setFilterCount] = useState(0)
    const [selectedTodos, setSelectedTodos] = useState<ITodo[]>([])
    const [userId, setUserId] = useState<string>()
    const [dates, setDates] = useState<{ start_date?: string, end_date?: string }>({
        start_date: moment(new Date("Mon Dec 01 2023 12:00:00 GMT+0530 (India Standard Time)")).format("YYYY-MM-DD")
        , end_date: moment(new Date().setDate(new Date().getDate() + 1)).format("YYYY-MM-DD")
    })
    const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", GetUsers)

    const { data, isLoading, refetch: ReftechTodos } = useQuery<AxiosResponse<{ todos: ITodo[], page: number, total: number, limit: number }>, BackendError>(["todos", paginationData, userId, dates?.start_date, dates?.end_date], async () => GetTodos({ limit: paginationData?.limit, page: paginationData?.page, id: userId, start_date: dates?.start_date, end_date: dates?.end_date, hidden: hidden }))

    const { data: fuzzytodos, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<{ todos: ITodo[], page: number, total: number, limit: number }>, BackendError>(["fuzzytodos", filter], async () => FuzzySearchTodos({ searchString: filter, limit: paginationData?.limit, page: paginationData?.page, hidden: hidden }), {
        enabled: false
    })

    const [selectedData, setSelectedData] = useState<{
        todo_description: string,
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
            selectedData && ExportToExcel(selectedData, "todos_data")
            setSent(true)
            setSelectAll(false)
            setSelectedData([])
            setSelectedTodos([])
        }
        catch (err) {
            console.log(err)
            setSent(false)
        }
    }


    // refine data
    useEffect(() => {
        let data: {
            todo_description: string,
            person: string,
            created_at: string,
            updated_at: string,
            updated_by: string,
            created_by: string,
        }[] = []
        selectedTodos.map((todo) => {
            return data.push(
                {
                    todo_description: todo.work_description,
                    person: todo.person.username,
                    created_at: todo.created_at.toLocaleString(),
                    created_by: todo.created_by.username,
                    updated_by: todo.updated_by.username,
                    updated_at: todo.updated_at.toLocaleString(),
                })
        })
        if (data.length > 0)
            setSelectedData(data)
    }, [selectedTodos])

    useEffect(() => {
        if (isUsersSuccess)
            setUsers(usersData?.data)
    }, [users, isUsersSuccess, usersData])

    useEffect(() => {
        if (!filter) {
            setTodos(preFilteredData)
            setPaginationData(preFilteredPaginationData)
        }
    }, [filter])

    useEffect(() => {
        ReftechTodos()
    }, [hidden])

    useEffect(() => {
        if (filter) {
            refetchFuzzy()
        }
    }, [paginationData])

    useEffect(() => {
        if (data && !filter) {
            setTodos(data.data.todos)
            setPreFilteredData(data.data.todos)
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
        if (fuzzytodos && filter) {
            setTodos(fuzzytodos.data.todos)
            let count = filterCount
            if (count === 0)
                setPaginationData({
                    ...paginationData,
                    page: fuzzytodos.data.page,
                    limit: fuzzytodos.data.limit,
                    total: fuzzytodos.data.total
                })
            count = filterCount + 1
            setFilterCount(count)
        }
    }, [fuzzytodos])

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
                    {window.screen.width > 450 ? "Todo Admin" : "Admin"}
                </Typography>

                <Stack
                    direction="row"
                >
                    {/* search bar */}
                    < Stack direction="row" spacing={2}>
                        <FormControlLabel control={<Switch
                            defaultChecked={Boolean(hidden)}
                            onChange={() => setHidden(!hidden)}
                        />} label="Show hidden" />

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
                            {
                                user?.todos_access_fields.is_editable && <>
                                    <MenuItem
                                        onClick={() => {
                                            setChoice({ type: TodoChoiceActions.create_todo })
                                            setAnchorEl(null)
                                        }}
                                    > Add New</MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            setChoice({ type: TodoChoiceActions.bulk_hide_todo })
                                            setAnchorEl(null)
                                        }}
                                    > Hide Todos</MenuItem>
                                </>
                            }
                            < MenuItem onClick={handleExcel}
                            >Export To Excel</MenuItem>

                        </Menu >
                        <NewTodoDialog />
                        <BulkHideTodoDialog todos={selectedTodos} />
                    </>
                </Stack >
            </Stack >

            {/* filter dates and person */}
            <Stack direction='row' gap={2} p={2} alignItems={'center'} justifyContent={'center'}>
                < TextField
                    size='small'
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
                    size='small'
                    type="date"
                    id="end_date"
                    label="End Date"
                    value={dates.end_date}
                    focused
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
                {user?.is_admin &&
                    < TextField
                        size='small'
                        select
                        SelectProps={{
                            native: true,
                        }}
                        onChange={(e) => {
                            setUserId(e.target.value)
                            ReftechTodos()
                        }}
                        required
                        id="todo_owner"
                        label="Filter Todos Of Indivdual"
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
            {isLoading && <TableSkeleton />}
            {!isLoading &&
                < TodoSTable
                    todo={todo}
                    setTodo={setTodo}
                    selectAll={selectAll}
                    selectedTodos={selectedTodos}
                    setSelectedTodos={setSelectedTodos}
                    setSelectAll={setSelectAll}
                    todos={MemoData}
                />}
            <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} setFilterCount={setFilterCount} />
        </>

    )

}

