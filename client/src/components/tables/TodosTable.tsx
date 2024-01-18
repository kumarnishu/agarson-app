import { Comment, Delete, DeleteOutline, Edit, EditCalendar, HideImageRounded, RestartAlt, Share, Stop, Visibility, VisibilitySharp } from '@mui/icons-material'
import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, TodoChoiceActions } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'
import AddTaskIcon from '@mui/icons-material/AddTask';
import BackHandIcon from '@mui/icons-material/BackHand';
import { DownloadFile } from '../../utils/DownloadFile'
import PopUp from '../popup/PopUp'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import { ITodo } from '../../types/todo.types'


type Props = {
    todo: ITodo | undefined
    setTodo: React.Dispatch<React.SetStateAction<ITodo | undefined>>,
    todos: ITodo[],
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    selectedTodos: ITodo[]
    setSelectedTodos: React.Dispatch<React.SetStateAction<ITodo[]>>,
}

function TodosTable({ todo, todos, setTodo, selectAll, setSelectAll, selectedTodos, setSelectedTodos }: Props) {
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    const [data, setData] = useState<ITodo[]>(todos)

    useEffect(() => {
        setData(todos)
    }, [todos])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                height: '75vh'
            }}>
                <STable>
                    <STableHead style={{

                    }}>
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

                            <STableHeadCell
                            >

                                Actions

                            </STableHeadCell>




                            <STableHeadCell
                            >

                                No

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Title

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Subtitle

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Category

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Contacts

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Last Reply

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Frequency Type

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Frequency

                            </STableHeadCell>




                            <STableHeadCell
                            >

                                connected Number

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Next Run date

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Todo Status

                            </STableHeadCell>




                            <STableHeadCell
                            >

                                Updated At

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Created By

                            </STableHeadCell>
                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {

                            data && data.map((todo, index) => {
                                return (
                                    <STableRow
                                        key={index}>
                                        {selectAll ?

                                            <STableCell>


                                                <Checkbox size="small"
                                                    checked={Boolean(selectAll)}
                                                />


                                            </STableCell>
                                            :
                                            null
                                        }
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
                                            null
                                        }

                                        <STableCell style={{ zIndex: -1 }}>
                                            <PopUp
                                                element={
                                                    <Stack direction="row" spacing={1}>


                                                        {user?.todos_access_fields.is_deletion_allowed && todo.is_completed &&
                                                            <Tooltip title="delete">
                                                                <IconButton color="error"
                                                                    onClick={() => {
                                                                        setChoice({ type: TodoChoiceActions.delete_todo })
                                                                        setTodo(todo)

                                                                    }}
                                                                >
                                                                    <Delete />
                                                                </IconButton>
                                                            </Tooltip>
                                                        }
                                                        {!todo.is_active ?
                                                            <Tooltip title="Stop">
                                                                <IconButton color="secondary"
                                                                    onClick={() => {
                                                                        setChoice({ type: TodoChoiceActions.stop_todo })
                                                                        setTodo(todo)
                                                                    }}
                                                                >
                                                                    <Stop />
                                                                </IconButton>
                                                            </Tooltip> :
                                                            <Tooltip title="Start">
                                                                <IconButton color="secondary"
                                                                    onClick={() => {
                                                                        setChoice({ type: TodoChoiceActions.start_todo })
                                                                        setTodo(todo)
                                                                    }}
                                                                >
                                                                    <RestartAlt />
                                                                </IconButton>
                                                            </Tooltip>
                                                        }

                                                        {!todo.is_hidden && todo.is_completed ?
                                                            <Tooltip title="Hide">
                                                                <IconButton color="secondary"
                                                                    onClick={() => {
                                                                        setChoice({ type: TodoChoiceActions.hide_todo })
                                                                        setTodo(todo)
                                                                    }}
                                                                >
                                                                    <HideImageRounded />
                                                                </IconButton>
                                                            </Tooltip> :
                                                            <Tooltip title="Show">
                                                                <IconButton color="secondary"
                                                                    onClick={() => {
                                                                        setChoice({ type: TodoChoiceActions.show_todo })
                                                                        setTodo(todo)
                                                                    }}
                                                                >
                                                                    <VisibilitySharp />
                                                                </IconButton>
                                                            </Tooltip>
                                                        }

                                                        {user?.todos_access_fields.is_editable &&
                                                            <Tooltip title="edit">
                                                                <IconButton color="secondary"
                                                                    onClick={() => {

                                                                        setChoice({ type: TodoChoiceActions.update_todo })
                                                                        setTodo(todo)
                                                                    }}

                                                                >
                                                                    <Edit />
                                                                </IconButton>
                                                            </Tooltip>}


                                                        <Tooltip title="view replies">
                                                            <IconButton color="primary"
                                                                onClick={() => {

                                                                    setChoice({ type: TodoChoiceActions.view_replies })
                                                                    setTodo(todo)


                                                                }}
                                                            >
                                                                <Visibility />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title="Update Status">
                                                            <IconButton
                                                                color="success"
                                                                onClick={() => {

                                                                    setChoice({ type: TodoChoiceActions.update_status })
                                                                    setTodo(todo)

                                                                }}
                                                            >
                                                                <EditCalendar />
                                                            </IconButton>
                                                        </Tooltip>

                                                    </Stack>}
                                            />
                                        </STableCell>

                                        <STableCell>
                                            {todo.serial_no}
                                        </STableCell>


                                        <STableCell>
                                            {todo.title}
                                        </STableCell>


                                        <STableCell>
                                            {todo.subtitle}
                                        </STableCell>

                                        <STableCell>
                                            {todo.category}
                                        </STableCell>


                                        <STableCell>

                                            {todo.frequency_type}

                                        </STableCell>


                                        <STableCell>
                                            {todo.frequency_value}
                                        </STableCell>


                                        <STableCell>
                                            {todo.is_completed ? "Completed" : "Pending"}
                                        </STableCell>

                                        <STableCell>
                                            {new Date(todo.updated_at).toLocaleString()}

                                        </STableCell>
                                        <STableCell>
                                            {todo.created_by.username}
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

                    </>
                    : null
            }
        </>
    )
}

export default TodosTable