import { Box,  IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import PopUp from '../popup/PopUp'
import { ITodo } from '../../types/todo.types'
import { EditOutlined, RemoveRedEye } from '@mui/icons-material'
import { ChoiceContext, TodoChoiceActions } from '../../contexts/dialogContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import UpdateTodoStatusDialog from '../dialogs/todos/UpdateTodoStatusDialog'
import ViewTodoRepliesDialog from '../dialogs/todos/ViewTodoRepliesDialog'


type Props = {
    todo: ITodo | undefined
    setTodo: React.Dispatch<React.SetStateAction<ITodo | undefined>>,
    todos: ITodo[]
}

function MyTodoTable({ todo, todos, setTodo}: Props) {
    const [data, setData] = useState<ITodo[]>(todos)
    const { setChoice } = useContext(ChoiceContext)
    useEffect(() => {
        setData(todos)
    }, [todos])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                maxHeight: '83.5vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>
                            <STableHeadCell
                            >

                                Actions

                            </STableHeadCell>


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

                                Timestamp

                            </STableHeadCell>
                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {

                            data && data.map((todo, index) => {
                                return (
                                    <>
                                        {todo.status !== "done" && <STableRow
                                            key={index}
                                        >
                                    

                                            <STableCell>
                                                <PopUp
                                                    element={
                                                        <Stack direction="row" spacing={1}>
                                                            {

                                                                <>
                                                                    <Tooltip title="View replies">
                                                                        <IconButton color="success"
                                                                            onClick={() => {
                                                                                setChoice({ type: TodoChoiceActions.view_replies })
                                                                                setTodo(todo)
                                                                            }}
                                                                        >
                                                                            <RemoveRedEye />
                                                                        </IconButton>
                                                                    </Tooltip>

                                                                    <Tooltip title="Update Status">
                                                                        <IconButton color="success"
                                                                            onClick={() => {
                                                                                setChoice({ type: TodoChoiceActions.update_todo_status })
                                                                                setTodo(todo)
                                                                            }}
                                                                        >
                                                                            <EditOutlined />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </>

                                                            }

                                                        </Stack>} />
                                            </STableCell>

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
                                        </STableRow>}
                                    </>
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
        </>
    )
}

export default MyTodoTable