import { Delete, Edit, EditCalendar, HideImageRounded, Person2, RestartAlt, Stop, Visibility } from '@mui/icons-material'
import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, TodoChoiceActions } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'
import PopUp from '../popup/PopUp'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import { ITodo } from '../../types/todo.types'
import StartTodoDialog from '../dialogs/todos/StartTodoDialog'
import StopTodoDialog from '../dialogs/todos/StopTodoDialog'
import ToogleHideTodoDialog from '../dialogs/todos/ToogleHideTodoDialog'
import UpdateTodoDialog from '../dialogs/todos/UpdateTodoDialog'
import UpdateTodoStatusDialog from '../dialogs/todos/UpdateTodoStatusDialog'
import ViewTodoRepliesDialog from '../dialogs/todos/ViewTodoRepliesDialog'
import ViewTodoContactsDialog from '../dialogs/todos/ViewTodoContactsDialog'
import DeleteTodoDialog from '../dialogs/todos/DeleteTodoDialog'
import ViewTextDialog from '../dialogs/text/ViewTextDialog'


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
    const [text, setText] = useState<string>()

    useEffect(() => {
        setData(todos)
    }, [todos])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                height: '78vh'
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

                                Status

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

                                Category2

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Last Reply

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Contacts

                            </STableHeadCell>



                            <STableHeadCell
                            >

                                Next Run date

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

                                Run Once

                            </STableHeadCell>



                            <STableHeadCell
                            >

                                connected No

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
                                            <PopUp color={todo.is_active || todo.is_paused ? "success" : "error"}
                                                element={
                                                    <Stack direction="row" spacing={1}>


                                                        {user?.todos_access_fields.is_deletion_allowed &&
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
                                                        {todo.is_active ?
                                                            <Tooltip title="Stop">
                                                                <IconButton color="error"
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


                                                        <Tooltip title="Toogle Hide">
                                                            <IconButton color="error"
                                                                onClick={() => {
                                                                    setChoice({ type: TodoChoiceActions.hide_todo })
                                                                    setTodo(todo)
                                                                }}
                                                            >
                                                                <HideImageRounded />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title="View Contacts">
                                                            <IconButton color="secondary"
                                                                onClick={() => {
                                                                    setChoice({ type: TodoChoiceActions.view_contacts })
                                                                    setTodo(todo)
                                                                }}
                                                            >
                                                                <Person2 />
                                                            </IconButton>
                                                        </Tooltip>

                                                        {user?.todos_access_fields.is_editable &&
                                                            <Tooltip title="edit">
                                                                <IconButton color="primary"
                                                                    onClick={() => {

                                                                        setChoice({ type: TodoChoiceActions.update_todo })
                                                                        setTodo(todo)
                                                                    }}

                                                                >
                                                                    <Edit />
                                                                </IconButton>
                                                            </Tooltip>}


                                                        <Tooltip title="view replies">
                                                            <IconButton color="warning"
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

                                        <STableCell >
                                            {todo.serial_no}
                                        </STableCell>
                                        <STableCell>
                                            {todo.contacts.find((c) => c.status !== "done") ? "Pending" : "Done"}
                                        </STableCell>

                                        <STableCell title={todo.title}>
                                            {todo.title && todo.title.slice(0, 20)}
                                        </STableCell>


                                        <STableCell title={todo.subtitle}>
                                            {todo.subtitle && todo.subtitle.slice(0, 10)}
                                        </STableCell>

                                        <STableCell title={todo.category}>
                                            {todo.category && todo.category.slice(0, 10)}
                                        </STableCell>
                                        <STableCell title={todo.category2}>
                                            {todo.category2 && todo.category2.slice(0, 20)}
                                        </STableCell>
                                        <STableCell title={todo.replies.length > 0 && todo.replies[todo.replies.length - 1] && todo.replies[todo.replies.length - 1].reply || ""}>
                                            {todo.replies.length > 0 && todo.replies[todo.replies.length - 1] && todo.replies[todo.replies.length - 1].reply.slice(0, 20)}
                                        </STableCell>

                                        <STableCell title={todo.contacts.map((c) => {
                                            let result = c.name
                                            if (!c.name)
                                                result = c.mobile
                                            return result
                                        }).toString()}>

                                            {todo.contacts.map((c) => {
                                                let result = c.name
                                                if (!c.name)
                                                    result = c.mobile
                                                return result
                                            }).toString().slice(0, 20)}

                                        </STableCell>
                                        <STableCell>
                                            {new Date(todo.next_run_date).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {todo.frequency_type}
                                        </STableCell>

                                        <STableCell>
                                            {todo.frequency_value}
                                        </STableCell>
                                        <STableCell>
                                            {todo.run_once ? "True" : "False"}
                                        </STableCell>

                                        <STableCell>
                                            {todo.connected_user && todo.connected_user.connected_number?.split(":")[0]}
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
                        <StartTodoDialog id={todo._id} />
                        <ToogleHideTodoDialog todo={todo} />
                        <StopTodoDialog id={todo._id} />
                        <UpdateTodoDialog todo={todo} />
                        <UpdateTodoStatusDialog todo={todo} />
                        <ViewTodoRepliesDialog todo={todo} />
                        <ViewTodoContactsDialog todo={todo} />
                        <DeleteTodoDialog id={todo._id} />
                    </>
                    : null
            }
            {text && <ViewTextDialog text={text} setText={setText} />}
        </>
    )
}

export default TodosTable