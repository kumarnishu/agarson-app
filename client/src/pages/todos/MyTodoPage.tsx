import { Search } from '@mui/icons-material'
import { Fade, FormControlLabel, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, Switch, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { Menu as MenuIcon } from '@mui/icons-material';
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { GetUsers } from '../../services/UserServices'
import { IUser } from '../../types/user.types'
import { ITodo } from '../../types/todo.types'
import FuzzySearch from 'fuzzy-search'
import { GetMyTodos } from '../../services/TodoServices'
import MyTodosTable from '../../components/tables/MyTodosTable'


type ITodoTemplate = {
  _id: string,
  serial_no: number,
  title: string,
}

export default function TodosPage() {
  const [users, setUsers] = useState<IUser[]>([])
  const [hidden, setHidden] = useState(false)
  const [filter, setFilter] = useState<string | undefined>()
  const [todo, setTodo] = useState<ITodo>()
  const [todos, setTodos] = useState<ITodo[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => todos, [todos])
  const [preFilteredData, setPreFilteredData] = useState<ITodo[]>([])
  const [selectedTodos, setSelectedTodos] = useState<ITodo[]>([])
  const [selectedData, setSelectedData] = useState<ITodoTemplate[]>([])
  const { data, isLoading } = useQuery<AxiosResponse<ITodo[]>, BackendError>(["my_todos", hidden], async () => GetMyTodos({ hidden: hidden }))

  const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())

  const [sent, setSent] = useState(false)
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
      const searcher = new FuzzySearch(todos, ["title", "subtitle", "category2", "category", "contacts.mobile", "serial_no", "contacts.name", "replies.reply", "todo_type"], {
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
      >

        <Typography
          variant={'h6'}
          component={'h1'}
          sx={{ pl: 1 }}
        >
          My Todos
        </Typography>

        <Stack
          direction="row"
          alignItems={'center'}
        >
          <FormControlLabel control={<Switch
            defaultChecked={Boolean(hidden)}
            onChange={() => setHidden(!hidden)}
          />} label="Hidden" />

          {/* search bar */}
          < Stack direction="row" spacing={2}>
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

            </Menu >
          </>
        </Stack >
      </Stack >
      {/* table */}
      {isLoading && <TableSkeleton />}
      {!isLoading && < MyTodosTable
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

