import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { GetMyTasks, ToogleMyTasks } from '../../services/TaskServices'
import { BackendError } from '../..'
import { ITask } from '../../types/task.types'
import { Checkbox, Paper, Tooltip, Typography } from '@mui/material'
import { queryClient } from '../../main'


export default function TasksPage() {
    const [task, setTask] = useState<{
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
    const { data, isSuccess } = useQuery<AxiosResponse<{
        task: ITask,
        previous_date: Date,
        next_date: Date,
        box: {
            date: Date,
            is_completed: boolean
        }

    }[]>, BackendError>("self_tasks", GetMyTasks)

    const { mutate } = useMutation
        <AxiosResponse<string>, BackendError, {
            id: string,
            date: string
        }>
        (ToogleMyTasks, {
            onSuccess: () => {
                queryClient.invalidateQueries('self_tasks')
            }
        })
    useEffect(() => {
        if (isSuccess) {
            setTasks(data.data)
        }
    }, [isSuccess])
    console.log(tasks)
    console.log(task)
    return (
        <>
            <Stack
                spacing={2}
                padding={1}
                direction="row"
                justifyContent="space-between"
                width="100vw"
            >

                <Typography
                    variant={'h6'}
                    component={'h1'}
                    sx={{ pl: 1 }}
                >
                    Tasks
                </Typography>
            </Stack >


            {tasks && tasks.map((task, index) => {
                return (
                    <Stack key={index}
                        direction="column"
                    >
                        <Paper elevation={8} sx={{ p: 2, mt: 1, boxShadow: 2, backgroundColor: 'whitesmoke' }}>
                            <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                <b>{task.task.task_description}</b>
                                <Tooltip title={new Date(task.box.date).toDateString()}>
                                    <Checkbox color="success" sx={{ p: 0, m: 2 }}
                                        onChange={() => {
                                            setTask(task)
                                            mutate({ id: task.task._id, date: new Date(task.box.date).toString() })
                                        }}
                                        defaultChecked={task.box && task.box.is_completed}
                                        disabled={task.box && task.box.is_completed && new Date(task.box.date) < new Date(task.next_date) && new Date(task.box.date) >= new Date(task.previous_date)}
                                    />
                                </Tooltip>
                            </Typography>
                            <Typography variant="caption" sx={{ textTransform: "capitalize" }}>{task.task.frequency_value ? `every ${task.task.frequency_value} days` : task.task.frequency_type}
                                : {task.box.is_completed ? `Completed` : "Pending"}
                            </Typography>
                        </Paper>
                    </Stack>
                )
            })}
        </>
    )
}

