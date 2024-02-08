import { Chat, Person2, RemoveRedEye } from '@mui/icons-material'
import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import { ITodo } from '../../types/todo.types'
import ViewTextDialog from '../dialogs/text/ViewTextDialog'
import { ChoiceContext, TodoChoiceActions } from '../../contexts/dialogContext'
import ViewTodoContactsDialog from '../dialogs/todos/ViewTodoContactsDialog'
import AddReplyDialog from '../dialogs/todos/AddReplyDialog'
import ViewTodoRepliesDialog from '../dialogs/todos/ViewTodoRepliesDialog'


type Props = {
    todo: ITodo | undefined
    setTodo: React.Dispatch<React.SetStateAction<ITodo | undefined>>,
    todos: ITodo[],
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    selectedTodos: ITodo[]
    setSelectedTodos: React.Dispatch<React.SetStateAction<ITodo[]>>,
}

function MyTodosTable({ todos, todo, setTodo, selectAll, setSelectAll, selectedTodos, setSelectedTodos }: Props) {
    const [data, setData] = useState<ITodo[]>(todos)
    const [text, setText] = useState<string>()
    const { setChoice } = useContext(ChoiceContext)

    useEffect(() => {
        setData(todos)
    }, [todos])

    return (
        <>
            <Box sx={{
                overflow: "auto",
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

                                Status

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

                                Last Reply

                            </STableHeadCell>



                            <STableHeadCell
                            >

                                Assigned By

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

                                            <STableCell

                                            >


                                                <Checkbox size="small"
                                                    checked={Boolean(selectAll)}
                                                />


                                            </STableCell>
                                            :
                                            null
                                        }
                                        {!selectAll ?

                                            <STableCell >

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

                                        <STableCell style={{ width: '100px' }}>
                                            <Tooltip title="View replies">
                                                <IconButton
                                                    onClick={() => {
                                                        setChoice({ type: TodoChoiceActions.view_replies })
                                                        setTodo(todo)
                                                    }}
                                                >
                                                    <RemoveRedEye />
                                                </IconButton>
                                            </Tooltip>

                                            {!todo.is_hidden && <Tooltip title="New Reply" color="success">
                                                <IconButton
                                                    onClick={() => {
                                                        setChoice({ type: TodoChoiceActions.add_reply })
                                                        setTodo(todo)
                                                    }}
                                                >
                                                    <Chat />
                                                </IconButton>
                                            </Tooltip>}
                                            <Tooltip title="View Contacts">
                                                <IconButton color={todo.is_active ? "success" : "error"}
                                                    onClick={() => {
                                                        setChoice({ type: TodoChoiceActions.view_contacts })
                                                        setTodo(todo)
                                                    }}
                                                >
                                                    <Person2 />
                                                </IconButton>
                                            </Tooltip>
                                        </STableCell>

                                        <STableCell >
                                            {todo.serial_no}
                                        </STableCell>


                                        <STableCell title={todo.title} style={{ cursor: 'pointer', color: 'blue', fontSize: 12, letterSpacing: '1px' }} onClick={() => {
                                            if (todo.sheet_url)
                                                window.open(todo.sheet_url, '_blank')
                                        }}>
                                            {todo.title && todo.title.slice(0, 50)}
                                        </STableCell>



                                        <STableCell title={todo.replies && todo.replies.length > 0 && todo.replies[todo.replies.length - 1].reply || ""}>
                                            {todo.replies && todo.replies.length > 0 && todo.replies[todo.replies.length - 1].reply.slice(0, 50) || ""}
                                        </STableCell>
                                        <STableCell>
                                            {todo.connected_user && todo.connected_user.username}
                                        </STableCell>
                                    </STableRow>
                                )
                            })

                        }
                    </STableBody>
                </STable>
            </Box >

            {text && <ViewTextDialog text={text} setText={setText} />}
            {todo && <>
                <ViewTodoContactsDialog todo={todo} />
                <AddReplyDialog todo={todo} />
                <ViewTodoRepliesDialog todo={todo} />
            </>}
        </>
    )
}

export default MyTodosTable