import { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { ITodo } from '../../types/todo.types'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import MyTodoTable from '../../components/tables/MyTodoTable'
import { LinearProgress, Typography } from '@mui/material'
import { GetMyTodos } from '../../services/TodoServices'


export default function TodosPage() {
    const [todo, setTodo] = useState<ITodo>()
    const [todos, setTodos] = useState<ITodo[]>([])
    const MemoData = React.useMemo(() => todos, [todos])
    const { data, isLoading } = useQuery<AxiosResponse<ITodo[]>, BackendError>("self_todos", GetMyTodos)


    useEffect(() => {
        if (data)
            setTodos(data?.data)
    }, [data])

    return (
        <>

            {
                isLoading && <LinearProgress />
            }

            {/* table */}
            {isLoading && <TableSkeleton />}
            {!isLoading && todos.length > 0 &&
                < MyTodoTable
                    todo={todo}
                    setTodo={setTodo}
                    todos={MemoData}
                />}
            {todos.length == 0 && <Typography textAlign={'center'} color="error" fontWeight="bold" p={2} variant="subtitle1">No Todo Assigned yet !</Typography>}
        </>

    )

}

