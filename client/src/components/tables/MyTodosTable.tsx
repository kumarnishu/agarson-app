import { EditCalendar, Visibility } from '@mui/icons-material'
import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, TodoChoiceActions } from '../../contexts/dialogContext'
import PopUp from '../popup/PopUp'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import { ITodo } from '../../types/todo.types'
import UpdateTodoStatusDialog from '../dialogs/todos/UpdateTodoStatusDialog'
import ViewTodoRepliesDialog from '../dialogs/todos/ViewTodoRepliesDialog'
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

function MyTodosTable({ todo, todos, setTodo, selectAll, setSelectAll, selectedTodos, setSelectedTodos }: Props) {
    const { setChoice } = useContext(ChoiceContext)
    const [data, setData] = useState<ITodo[]>(todos)
    const [text, setText] = useState<string>()

    useEffect(() => {
        setData(todos)
    }, [todos])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                height: '80vh'
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

                                Last Reply

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

                                        <STableCell style={{ zIndex: -1, backgroundColor: todo.is_active || todo.is_paused ? "green" : "red" }}>
                                            <PopUp
                                                element={
                                                    <Stack direction="row" spacing={1}>
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

                                        <STableCell title={todo.replies.length > 0 && todo.replies[todo.replies.length - 1] && todo.replies[todo.replies.length - 1].reply || ""}>
                                            {todo.replies.length > 0 && todo.replies[todo.replies.length - 1] && todo.replies[todo.replies.length - 1].reply.slice(0, 20)}
                                        </STableCell>
                                        <STableCell>
                                            {new Date(todo.next_run_date).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {todo.frequency_type || ""}
                                        </STableCell>

                                        <STableCell>
                                            {todo.frequency_value}
                                        </STableCell>
                                        <STableCell>
                                            {todo.run_once ? "True" : "False"}
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
                        <UpdateTodoStatusDialog todo={todo} />
                        <ViewTodoRepliesDialog todo={todo} />
                    </>
                    : null
            }
            {text && <ViewTextDialog text={text} setText={setText} />}
        </>
    )
}

export default MyTodosTable