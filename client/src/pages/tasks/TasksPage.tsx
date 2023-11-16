import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { GetMyTasks, ToogleMyTasks } from '../../services/TaskServices'
import { BackendError } from '../..'
import { ITask } from '../../types/task.types'
import { Button, Checkbox, Paper, Tooltip, Typography } from '@mui/material'
import { queryClient } from '../../main'


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
    const { data, isSuccess } = useQuery<AxiosResponse<ITask[]>, BackendError>("self_tasks", GetMyTasks)

    const { mutate, isLoading } = useMutation
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
                    previous_date: small_dates[small_dates.length - 1].date,
                    next_date: large_dates[0].date,
                    box: small_dates[small_dates.length - 1]
                })
            })
            setTasks(tmpTasks)
        }
    }, [isSuccess, data])
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
                                {task.box.is_completed ? <s>{
                                    task.task.task_description}</s> :
                                    <b>{
                                        task.task.task_description}</b>
                                }

                                <Tooltip title={new Date(task.box.date).toDateString()}>
                                    <>
                                        <Checkbox color="success" sx={{ p: 0, m: 2 }}
                                            onChange={() => {
                                                setTask(task)
                                            }}
                                            defaultChecked={task.box && task.box.is_completed}
                                            disabled={task.box && task.box.is_completed && new Date(task.box.date) < new Date(task.next_date) && new Date(task.box.date) >= new Date(task.previous_date)}
                                        />
                                        {
                                            task.box && task.box.is_completed && new Date(task.box.date) < new Date(task.next_date) && new Date(task.box.date) >= new Date(task.previous_date) ? null
                                                :
                                                <Button
                                                    variant='contained'
                                                    size="small"
                                                    disabled={isLoading}
                                                    onClick={() => {
                                                        if (localtask) {
                                                            mutate({ id: localtask.task._id, date: new Date(localtask.box.date).toString() })
                                                            setTask(undefined)
                                                        }
                                                    }}>Save</Button>
                                        }
                                    </>
                                </Tooltip>
                            </Typography>
                            <Typography variant="caption" sx={{ textTransform: "capitalize" }}>{task.task.frequency_value ? `every ${task.task.frequency_value} days` : task.task.frequency_type}
                                : {task.box.is_completed ? `Completed` : "Pending"}
                            </Typography>
                            <Typography variant="caption" sx={{ textTransform: "capitalize" }}>  Last Date : {new Date(task.next_date).toDateString()}
                            </Typography>
                        </Paper>
                    </Stack>
                )
            })}
        </>
    )
}

