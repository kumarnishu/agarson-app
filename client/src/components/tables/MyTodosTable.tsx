import { RestartAlt, Stop } from '@mui/icons-material'
import { Box, Checkbox } from '@mui/material'
import { useEffect, useState } from 'react'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import { ITodo } from '../../types/todo.types'
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

function MyTodosTable({ todos, setTodo, selectAll, setSelectAll, selectedTodos, setSelectedTodos }: Props) {
    const [data, setData] = useState<ITodo[]>(todos)
    const [text, setText] = useState<string>()

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

                                Subtitle

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

                                        <STableCell>
                                            {todo.is_active ?
                                                <Stop color="success" />
                                                :
                                                <RestartAlt color="error" />
                                            }
                                        </STableCell>

                                        <STableCell >
                                            {todo.serial_no}
                                        </STableCell>


                                        <STableCell title={todo.title}>
                                            {todo.title && todo.title.slice(0, 20)}
                                        </STableCell>


                                        <STableCell title={todo.subtitle}>
                                            {todo.subtitle && todo.subtitle.slice(0, 10)}
                                        </STableCell>

                                        <STableCell>
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
        </>
    )
}

export default MyTodosTable