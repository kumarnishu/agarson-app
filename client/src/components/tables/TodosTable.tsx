import { Delete, Person2, RestartAlt, Stop } from '@mui/icons-material'
import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, TodoChoiceActions } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'
import PopUp from '../popup/PopUp'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import { ITodo } from '../../types/todo.types'
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
                overflow: "auto",
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

                                Contacts

                            </STableHeadCell>



                            <STableHeadCell
                            >

                                Next Run date

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Start Date

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

                                        <STableCell style={{ zIndex: -1, backgroundColor: todo.is_active ? "yellow" : "whitesmoke" }}>
                                            <PopUp color={todo.is_active ? "success" : "error"}
                                                element={
                                                    <Stack direction="row" spacing={1}>

                                                        {user?.todos_access_fields.is_deletion_allowed &&
                                                            <Tooltip title="delete">
                                                                <IconButton
                                                                    disabled={todo.is_active}
                                                                    color="error"
                                                                    onClick={() => {
                                                                        setChoice({ type: TodoChoiceActions.delete_todo })
                                                                        setTodo(todo)

                                                                    }}
                                                                >
                                                                    <Delete />
                                                                </IconButton>
                                                            </Tooltip>
                                                        }

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

                                                    </Stack>}
                                            />
                                        </STableCell>

                                        <STableCell >
                                            {todo.serial_no}
                                        </STableCell>
                                        <STableCell>
                                            {todo.is_active ?
                                                <Stop color="success" />
                                                :
                                                <RestartAlt color="error" />
                                            }
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
                                      


                                        <STableCell title={todo.contacts.map((c) => {
                                            let result = c.name
                                            if (!c.name)
                                                result = c.mobile
                                            return result
                                        }).toString()}>

                                            {todo.contacts && todo.contacts.length > 0 && todo.contacts.map((c) => {
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
                                            {new Date(todo.start_date).toLocaleString()}
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