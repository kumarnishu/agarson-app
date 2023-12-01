import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import PopUp from '../popup/PopUp'
import { ITodo } from '../../types/todo.types'
import { Delete, Edit, HideImageRounded } from '@mui/icons-material'
import { ChoiceContext, TodoChoiceActions } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import DeleteTodoDialog from '../dialogs/todos/DeleteTodoDialog'
import HideTodoDialog from '../dialogs/todos/HideTodoDialog'
import EditTodoDialog from '../dialogs/todos/EditTodoDialog'



type Props = {
    todo: ITodo | undefined
    setTodo: React.Dispatch<React.SetStateAction<ITodo | undefined>>,
    todos: ITodo[],
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    selectedTodos: ITodo[]
    setSelectedTodos: React.Dispatch<React.SetStateAction<ITodo[]>>
}

function TodoSTable({ todo, todos, setTodo, selectAll, setSelectAll, selectedTodos, setSelectedTodos }: Props) {
    const [data, setData] = useState<ITodo[]>(todos)
    const { user } = useContext(UserContext)
    const { setChoice } = useContext(ChoiceContext)
    useEffect(() => {
        setData(todos)
    }, [todos])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                minHeight: '58.5vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>
                            <STableHeadCell
                            >

                               
                                    <Checkbox
                                        indeterminate={selectAll ? true : false}
                                        checked={Boolean(selectAll)}
                                        size="small" onChange={(e) => {
                                            if (e.currentTarget.checked) {
                                                setSelectedTodos(todos)
                                                setSelectAll(true)
                                            }
                                            if (!e.currentTarget.checked) {
                                                setSelectedTodos([])
                                                setSelectAll(false)
                                            }
                                        }} />

                            </STableHeadCell>

                            {/* actions popup */}
                            {user?.todos_access_fields.is_editable && <STableHeadCell
                            >

                                Actions

                            </STableHeadCell>}


                            <STableHeadCell
                            >

                                Work title

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Work detail

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Status

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Person

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Category

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Last Reply

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Created At

                            </STableHeadCell>

                            {/* updated at */}

                            <STableHeadCell
                            >

                                Updated At

                            </STableHeadCell>

                            {/* created by */}

                            <STableHeadCell
                            >

                                Created By

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Updated By

                            </STableHeadCell>
                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {

                            data && data.map((todo, index) => {
                                return (
                                    <STableRow
                                        key={index}
                                    >
                                        {selectAll ?

                                            <STableCell>


                                                <Checkbox size="small"
                                                    checked={Boolean(selectAll)}
                                                />


                                            </STableCell>
                                            :
                                            null}
                                        {!selectAll ?

                                            <STableCell>

                                                <Checkbox size="small"
                                                    onChange={(e) => {
                                                        setTodo(todo)
                                                        if (e.target.checked) {
                                                            setSelectedTodos([...selectedTodos, todo])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedTodos((todos) => todos.filter((item) => {
                                                                return item._id !== todo._id
                                                            }))
                                                        }
                                                    }}
                                                />

                                            </STableCell>
                                            :
                                            null/* actions popup */}
                                        {user?.todos_access_fields.is_editable &&
                                            <STableCell>
                                                <PopUp
                                                    element={
                                                        <Stack direction="row" spacing={1}>
                                                            {

                                                                <>
                                                                    <Tooltip title="Edit">
                                                                        <IconButton color="info"
                                                                            onClick={() => {
                                                                                setChoice({ type: TodoChoiceActions.update_todo })
                                                                                setTodo(todo)
                                                                            }}
                                                                        >
                                                                            <Edit />
                                                                        </IconButton>
                                                                    </Tooltip>

                                                                    {user?.todos_access_fields.is_deletion_allowed && <Tooltip title="Delete">
                                                                        <IconButton color="error"
                                                                            onClick={() => {
                                                                                setChoice({ type: TodoChoiceActions.delete_todo })
                                                                                setTodo(todo)
                                                                            }}
                                                                        >
                                                                            <Delete />
                                                                        </IconButton>
                                                                    </Tooltip>}
                                                                    <Tooltip title="Hide">
                                                                        <IconButton color="warning"
                                                                            onClick={() => {
                                                                                setChoice({ type: TodoChoiceActions.hide_todo })
                                                                                setTodo(todo)
                                                                            }}
                                                                        >
                                                                            <HideImageRounded />
                                                                        </IconButton>
                                                                    </Tooltip>

                                                                </>

                                                            }

                                                        </Stack>} />
                                            </STableCell>}

                                        <STableCell>
                                            {todo.work_title}

                                        </STableCell>
                                        <STableCell>
                                            {todo.work_description}

                                        </STableCell>
                                        <STableCell>
                                            {todo.status}
                                        </STableCell>
                                        <STableCell>
                                            {todo.person && todo.person.username}

                                        </STableCell>
                                        <STableCell>
                                            {todo.category && todo.category}

                                        </STableCell>
                                        <STableCell>
                                            {todo.replies && todo.replies.length > 0 && todo.replies[todo.replies.length - 1].reply}

                                        </STableCell>

                                        <STableCell>
                                            {new Date(todo.created_at).toLocaleString()}

                                        </STableCell>
                                        <STableCell>
                                            {new Date(todo.updated_at).toLocaleString()}

                                        </STableCell>
                                        <STableCell>
                                            {todo.created_by.username}

                                        </STableCell>
                                        <STableCell>
                                            {todo.updated_by.username}

                                        </STableCell>

                                    </STableRow>
                                )
                            })

                        }
                    </STableBody>
                </STable>
            </Box >
            {
                todo ?
                    <>
                        <DeleteTodoDialog todo={todo} />
                        <HideTodoDialog todo={todo} />
                        <EditTodoDialog todo={todo} />
                    </>
                    : null
            }
        </>
    )
}

export default TodoSTable