import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { GetMyTasks } from '../../services/TaskServices'
import { BackendError } from '../..'
import { ITask } from '../../types/task.types'
import MyTaskTable from '../../components/tables/MyTaskTable'
import TableSkeleton from '../../components/skeleton/TableSkeleton'


export default function TasksPage() {
    const [localtask, setTask] = useState<{
        task: ITask,
        previous_date: Date,
        next_date: Date,
        box: {
            date: Date,
            is_completed: boolean
        }

    }>()
    const [tasks, setTasks] = useState<{
        task: ITask,
        previous_date: Date,
        next_date: Date,
        box: {
            date: Date,
            is_completed: boolean
        }

    }[]>([])
    const { data, isSuccess, isLoading } = useQuery<AxiosResponse<ITask[]>, BackendError>("self_tasks", GetMyTasks)



    useEffect(() => {
        if (isSuccess) {
            let tmpTasks: {
                task: ITask,
                previous_date: Date,
                next_date: Date,
                box: {
                    date: Date,
                    is_completed: boolean
                }

            }[] = []

            data && data.data.map((task) => {
                let small_dates = task.boxes.filter((box) => {
                    return new Date(box.date) <= new Date()
                })
                let large_dates = task.boxes.filter((box) => {
                    return new Date(box.date) > new Date()
                })
                tmpTasks.push({
                    task: task,
                    previous_date: small_dates[small_dates.length - 1] && small_dates[small_dates.length - 1].date,
                    next_date: large_dates[0] && large_dates[0].date,
                    box: small_dates[small_dates.length - 1]
                })
            })
            setTasks(tmpTasks)
        }
    }, [isSuccess, data])
    return (
        <>{isLoading ? <TableSkeleton /> :
            <MyTaskTable task={localtask} tasks={tasks} setTask={setTask} />}

        </>
    )
}

