import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { ITask } from '../../types/task.types'
import { CheckBox } from '@mui/icons-material'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import moment from 'moment'
import { ChoiceContext, TaskChoiceActions } from '../../contexts/dialogContext'
import CheckTaskDialog from '../dialogs/tasks/CheckTaskDialog'


type Props = {
    task: {
        task: ITask;
        previous_date: Date;
        next_date: Date;
        box: {
            date: Date;
            is_completed: boolean;
        };
    } | undefined
    setTask: React.Dispatch<React.SetStateAction<{
        task: ITask;
        previous_date: Date;
        next_date: Date;
        box: {
            date: Date;
            is_completed: boolean;
        };
    } | undefined>>,
    tasks: {
        task: ITask;
        previous_date: Date;
        next_date: Date;
        box: {
            date: Date;
            is_completed: boolean;
        };
    }[]
}

function MyTaskTable({ task, tasks, setTask }: Props) {
    const { setChoice } = useContext(ChoiceContext)
    const [data, setData] = useState<{
        task: ITask;
        previous_date: Date;
        next_date: Date;
        box: {
            date: Date;
            is_completed: boolean;
        };
    }[]>(tasks)


    useEffect(() => {
        setData(tasks)
    }, [tasks])

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

                                Task Description

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Frequency

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Last Date

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Checked

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

                                Created At

                            </STableHeadCell>
                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {

                            data && data.map((task, index) => {
                                return (
                                    <STableRow
                                        key={index}
                                    >

                                        <STableCell>
                                            <Tooltip title="check this task">
                                                <IconButton
                                                    disabled={Boolean(task.box.is_completed)}
                                                    onClick={() => {
                                                        setTask(task)
                                                        setChoice({ type: TaskChoiceActions.check_task })
                                                    }}>
                                                    <CheckBox color="info" />
                                                </IconButton>
                                            </Tooltip>
                                        </STableCell>

                                        <STableCell>
                                            {task.task.task_description && task.task.task_description.slice(0, 50)}
                                        </STableCell>


                                        <STableCell>
                                            {task.task.frequency_value ? `${task.task.frequency_value} days` : task.task.frequency_type}
                                        </STableCell>

                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>  {
                                                moment(new Date(task.next_date).setDate(new Date(task.next_date).getDate() - 1)).format("YYYY-MM-DD")
                                            }
                                            </Typography>
                                        </STableCell>
                                        <STableCell>
                                            Checked : {task.task.boxes.filter((box) => {
                                                return box.is_completed && new Date(box.date) <= new Date()
                                            }).length}

                                            / {task.task.boxes.filter((box) => {
                                                return new Date(box.date).getDay() !== 0 && new Date(box.date) <= new Date()
                                            }).length}

                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{task.box.is_completed ? `Completed` : "Pending"}
                                            </Typography>
                                        </STableCell>
                                        <STableCell>
                                            {task.task.person.username}
                                        </STableCell>
                                        <STableCell>
                                            {new Date(task.task.created_at).toLocaleString()}

                                        </STableCell>
                                    </STableRow>
                                )
                            })

                        }
                    </STableBody>
                </STable>
            </Box >
            {task ? <CheckTaskDialog task={task} /> : null}
        </>
    )
}

export default MyTaskTable