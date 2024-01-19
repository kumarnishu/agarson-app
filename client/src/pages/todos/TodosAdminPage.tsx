import { Search } from '@mui/icons-material'
import { Fade, FormControlLabel, IconButton, LinearProgress, Menu, MenuItem, Switch, TextField, Typography } from '@mui/material'
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
import { ITodo } from '../../types/todo.types'
import { GetTodos } from '../../services/TodoServices'
import CreateTodoDialog from '../../components/dialogs/todos/CreateTodoDialog'
import FuzzySearch from 'fuzzy-search'


type ITodoTemplate = {
    _id: string,
    serial_no: number,
    title: string,
    subtitle: string,
}

export default function TodosPage() {
    const [users, setUsers] = useState<IUser[]>([])
    const [hidden, setHidden] = useState(false)
    const [mobile, setMobile] = useState<string>()
    const [filter, setFilter] = useState<string | undefined>()
    const { user: LoggedInUser } = useContext(UserContext)
    const [todo, setTodo] = useState<ITodo>()
    const [todos, setTodos] = useState<ITodo[]>([])
    const [selectAll, setSelectAll] = useState(false)
    const MemoData = React.useMemo(() => todos, [todos])
    const [preFilteredData, setPreFilteredData] = useState<ITodo[]>([])

    const [selectedTodos, setSelectedTodos] = useState<ITodo[]>([])
    const [selectedData, setSelectedData] = useState<ITodoTemplate[]>([])
    const { data, isLoading } = useQuery<AxiosResponse<ITodo[]>, BackendError>(["todos", hidden, mobile], async () => GetTodos({ hidden: hidden, mobile: mobile }))

    const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())

    const [sent, setSent] = useState(false)
    const { setChoice } = useContext(ChoiceContext)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    function handleExcel() {
        setAnchorEl(null)
        try {
            ExportToExcel(selectedData, "todos_data")
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
        let data: ITodoTemplate[] = []
        selectedTodos.map((todo) => {
            return data.push(

                {
                    _id: todo._id,
                    serial_no: todo.serial_no,
                    title: todo.title,
                    subtitle: todo.subtitle,
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
            const searcher = new FuzzySearch(todos, ["title", "subtitle", "category", "contacts.mobile", "contacts.name", "replies.reply", "frequency_type"], {
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
                    Todos
                </Typography>

                <Stack
                    direction="row"
                >
                    <FormControlLabel control={<Switch
                        defaultChecked={Boolean(hidden)}
                        onChange={() => setHidden(!hidden)}
                    />} label="Hidden" />

                    {/* search bar */}
                    < Stack direction="row" spacing={2}>
                        {/* {LoggedInUser?.crm_access_fields.is_editable && <UploadTodosExcelButton />} */}
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
                                        if (!user.crm_access_fields.is_hidden)
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
                        />
                        <IconButton
                            sx={{ bgcolor: 'whitesmoke' }}
                            onClick={() => {
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
                            <MenuItem
                                onClick={() => {
                                    setChoice({ type: TodoChoiceActions.create_todo })
                                    setAnchorEl(null)
                                }}
                            > Add New</MenuItem>
                            <MenuItem
                                onClick={() => {
                                    if (selectedTodos.length === 0)
                                        alert("please select some todos")
                                    else
                                        setChoice({ type: TodoChoiceActions.bulk_start_todo })
                                    setAnchorEl(null)
                                }}
                            > Start All</MenuItem>

                            <MenuItem
                                onClick={() => {
                                    if (selectedTodos.length === 0)
                                        alert("please select some todos")
                                    else
                                        setChoice({ type: TodoChoiceActions.bulk_stop_todo })
                                    setAnchorEl(null)
                                }}
                            > Stop All</MenuItem>

                            < MenuItem onClick={handleExcel}
                            >Export To Excel</MenuItem>

                        </Menu >
                        <CreateTodoDialog count={todos.length} />
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

