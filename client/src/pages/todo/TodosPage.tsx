import { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { ITodo } from '../../types/todo.types'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import MyTodoTable from '../../components/tables/MyTodoTable'
import { LinearProgress } from '@mui/material'
import { GetMyTodos } from '../../services/TodoServices'


export default function TodosPage() {
    const [todo, setTodo] = useState<ITodo>()
    const [todos, setTodos] = useState<ITodo[]>([])
    const [selectAll, setSelectAll] = useState(false)
    const MemoData = React.useMemo(() => todos, [todos])
    const [selectedTodos, setSelectedTodos] = useState<ITodo[]>([])
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
            {!isLoading &&
                < MyTodoTable
                    todo={todo}
                    setTodo={setTodo}
                    selectAll={selectAll}
                    selectedTodos={selectedTodos}
                    setSelectedTodos={setSelectedTodos}
                    setSelectAll={setSelectAll}
                    todos={MemoData}
                />}
        </>

    )

}

