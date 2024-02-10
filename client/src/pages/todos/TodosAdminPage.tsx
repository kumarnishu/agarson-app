import { Search } from '@mui/icons-material'
import { Checkbox, Fade, FormControlLabel, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { UserContext } from '../../contexts/userContext'
import TodosTable from '../../components/tables/TodosTable';
import { BackendError } from '../..'
import { Menu as MenuIcon } from '@mui/icons-material';
import { ChoiceContext, TodoChoiceActions } from '../../contexts/dialogContext'
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { GetUsers } from '../../services/UserServices'
import { IUser } from '../../types/user.types'
import { ITodo, ITodoTemplate } from '../../types/todo.types'
import { GetTodos } from '../../services/TodoServices'
import FuzzySearch from 'fuzzy-search'
import UploadTodoExcelButton from '../../components/buttons/UploadTodoExcelButton'
import StartAllTodoDialog from '../../components/dialogs/todos/StartAllTodoDialog'
import StopAllTodoDialog from '../../components/dialogs/todos/StopAllTodoDialog'
import { queryClient } from '../../main'
import DeleteAllTodosDialog from '../../components/dialogs/todos/DeleteAllTodosDialog'

const template: ITodoTemplate[] = [
    {
        _id: "",
        serial_no: 1,
        title: "work title",
        sheet_url: "https://sheets.google.com",
        category: "vijay dye",
        category2: "urgent",
        contacts: "nishu",
        todo_type: "visible",
        reply: "demo reply",
        start_time: "[12:23]",
        dates: "[1,2,3,4,31]",
        months: "[1,2,3,12]",
        weekdays: "[1,2,7]",
        years: "[2024,2025]",
        connected_user: 'nishu'

    }
]


export default function TodosPage() {
    const [users, setUsers] = useState<IUser[]>([])
    const [type, setType] = useState<string>('visible')
    const [stopped, setStopped] = useState(false)
    const [mobile, setMobile] = useState<string>()
    const [filter, setFilter] = useState<string | undefined>()
    const { user: LoggedInUser } = useContext(UserContext)
    const [todo, setTodo] = useState<ITodo>()
    const [todos, setTodos] = useState<ITodo[]>([])
    const [selectAll, setSelectAll] = useState(false)
    const MemoData = React.useMemo(() => todos, [todos])
    const [preFilteredData, setPreFilteredData] = useState<ITodo[]>([])

    const [selectedTodos, setSelectedTodos] = useState<ITodo[]>([])
    const [selectedData, setSelectedData] = useState<ITodoTemplate[]>(template)
    const { data, isLoading } = useQuery<AxiosResponse<ITodo[]>, BackendError>(["todos", type, stopped, mobile], async () => GetTodos({ type: type, mobile: mobile, stopped: stopped }))

    const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())

    const [sent, setSent] = useState(false)
    const { setChoice } = useContext(ChoiceContext)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    let help1 = users.map((u) => { return { username: u.username, mobile: u.mobile } })
    function handleExcel() {
        setAnchorEl(null)
        try {
            ExportToExcel(selectedData, "todos_data", [help1])
            setSent(true)
            setSelectAll(false)
            setSelectedData([])
            setSelectedTodos([])
            queryClient.invalidateQueries('todos')
        }
        catch (err) {
            console.log(err)
            setSent(false)
        }
    }

    // refine data
    useEffect(() => {
        let data: ITodoTemplate[] = []
        selectedTodos.map((todo) => {
            return data.push(
                {
                    _id: todo._id,
                    serial_no: todo.serial_no,
                    title: todo.title,
                    sheet_url: todo.sheet_url,
                    category: todo.category,
                    category2: todo.category2,
                    contacts: todo.contacts.map((c) => {
                        let result = c.name || c.mobile
                        return result
                    }).toString(),
                    todo_type: todo.todo_type,
                    reply: todo.replies && todo.replies.length > 0 && todo.replies[todo.replies.length - 1].reply || "",
                    start_time: todo.start_time,
                    dates: todo.dates,
                    months: todo.months,
                    weekdays: todo.weekdays,
                    years: todo.years,
                    connected_user: todo.connected_user && todo.connected_user.username
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
        if (data && !filter) {
            setTodos(data.data)
            setPreFilteredData(data.data)
        }
    }, [data])

    useEffect(() => {
        if (filter) {
            const searcher = new FuzzySearch(todos, ["title", "category2", "serial_no", "category", "contacts.mobile", "contacts.name"], {
                caseSensitive: false,
            });
            const result = searcher.search(filter);
            setTodos(result)
        }
        if (!filter)
            setTodos(preFilteredData)

    }, [filter])

    return (
        <>

            {
                isLoading && <LinearProgress />
            }
            {/*heading, search bar and table menu */}
            <Stack px={2} direction={'row'} justifyContent={'center'}>
                <FormControlLabel control={<Checkbox
                    checked={Boolean(type === '')}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setType('')
                        }
                        if (!e.target.checked) {
                            setType('all')
                        }

                    }}
                />} label="All" />
                <FormControlLabel control={<Checkbox
                    checked={Boolean(type === 'hidden')}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setType('hidden')
                        }
                        if (!e.target.checked) {
                            setType('')
                        }

                    }}
                />} label="Hidden" />
                <FormControlLabel control={<Checkbox
                    checked={Boolean(type === 'visible')}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setType('visible')
                        }
                        if (!e.target.checked) {
                            setType('')
                        }

                    }}
                />} label="Visible" />
                <FormControlLabel control={<Checkbox
                    checked={Boolean(type === 'checklist')}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setType('checklist')
                        }
                        if (!e.target.checked) {
                            setType('')
                        }

                    }}
                />} label="Checklist" />
                <FormControlLabel control={<Checkbox
                    checked={Boolean(type === 'greeting')}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setType('greeting')
                        }
                        if (!e.target.checked) {
                            setType('')
                        }

                    }}
                />} label="Greeting" />
                <FormControlLabel sx={{ color: 'red' }} control={<Checkbox
                    checked={Boolean(stopped)}
                    disabled={type === ""}
                    onChange={() => setStopped(!stopped)}
                />} label="Stopped" />
            </Stack>

            <Stack
                spacing={2}
                padding={1}
                direction="row"
                justifyContent="space-between"
            >

                <Typography
                    variant={'h6'}
                    component={'h1'}
                >
                    Todos
                </Typography>

                <Stack
                    direction="row"
                >
                    {/* search bar */}
                    < Stack direction='row' spacing={2}>
                        {LoggedInUser?.todos_access_fields.is_editable && <UploadTodoExcelButton />}
                        {LoggedInUser?.assigned_users && LoggedInUser?.assigned_users.length > 0 &&
                            < TextField
                                size='small'
                                select
                                SelectProps={{
                                    native: true,
                                }}
                                onChange={(e) => {
                                    setMobile(e.target.value)
                                }}
                                required
                                id="todo_owner"
                                label="Person"
                                fullWidth
                            >
                                <option key={'00'} value={undefined}>

                                </option>
                                {
                                    users.map((user, index) => {
                                        if (!user.todos_access_fields.is_hidden)
                                            return (<option key={index} value={user.mobile}>
                                                {user.username}
                                            </option>)
                                        else
                                            return null
                                    })
                                }
                            </TextField>}
                        <TextField
                            fullWidth
                            size="small"
                            onChange={(e) => {
                                setFilter(e.currentTarget.value)
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
                            < MenuItem onClick={handleExcel}
                            >Export To Excel</MenuItem>
                            {LoggedInUser?.todos_access_fields.is_editable && <MenuItem
                                onClick={() => {
                                    if (selectedTodos.length === 0)
                                        alert("please select some todos")
                                    else
                                        setChoice({ type: TodoChoiceActions.bulk_start_todo })
                                    setAnchorEl(null)
                                }}
                            > Start Seletced</MenuItem>}

                            {LoggedInUser?.todos_access_fields.is_editable && <MenuItem
                                onClick={() => {
                                    if (selectedTodos.length === 0)
                                        alert("please select some todos")
                                    else
                                        setChoice({ type: TodoChoiceActions.bulk_stop_todo })
                                    setAnchorEl(null)
                                }}
                            > Stop Seletced</MenuItem>}
                            {LoggedInUser?.todos_access_fields.is_editable && <MenuItem sx={{ color: 'red' }}
                                onClick={() => {
                                    if (selectedTodos.length === 0)
                                        alert("please select some todos")
                                    else
                                        setChoice({ type: TodoChoiceActions.delete_bulk_todo })
                                    setAnchorEl(null)
                                }}
                            > Delete Seletced</MenuItem>}



                        </Menu >

                        <StartAllTodoDialog ids={selectedTodos.map((todo) => { return todo._id })} />
                        <DeleteAllTodosDialog ids={selectedTodos.map((todo) => { return todo._id })} />
                        <StopAllTodoDialog ids={selectedTodos.map((todo) => { return todo._id })} />

                    </>
                </Stack >
            </Stack >
            {/* table */}
            {isLoading && <TableSkeleton />}
            {!isLoading && < TodosTable
                todo={todo}
                setTodo={setTodo}
                selectAll={selectAll}
                selectedTodos={selectedTodos}
                setSelectedTodos={setSelectedTodos}
                setSelectAll={setSelectAll}
                todos={MemoData}
            />}

        </>

    )

}

