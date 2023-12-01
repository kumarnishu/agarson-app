import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import PopUp from '../popup/PopUp'
import { ITodo } from '../../types/todo.types'
import { EditOutlined } from '@mui/icons-material'
import { ChoiceContext, TodoChoiceActions } from '../../contexts/dialogContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import UpdateTodoStatusDialog from '../dialogs/todos/UpdateTodoStatusDialog'



type Props = {
    todo: ITodo | undefined
    setTodo: React.Dispatch<React.SetStateAction<ITodo | undefined>>,
    todos: ITodo[],
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    selectedTodos: ITodo[]
    setSelectedTodos: React.Dispatch<React.SetStateAction<ITodo[]>>
}

function MyTodoTable({ todo, todos, setTodo, selectAll, setSelectAll, selectedTodos, setSelectedTodos }: Props) {
    const [data, setData] = useState<ITodo[]>(todos)
    const { setChoice } = useContext(ChoiceContext)
    useEffect(() => {
        setData(todos)
    }, [todos])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                minHeight: '83.5vh'
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
                                            
                                                <STableCell>
                                                    <PopUp
                                                        element={
                                                            <Stack direction="row" spacing={1}>
                                                                {

                                                                    <>
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
                    </>
                    : null
            }
        </>
    )
}

export default MyTodoTable