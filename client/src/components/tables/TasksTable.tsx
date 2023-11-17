import { Box, Checkbox, FormControlLabel, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
import { useContext, useEffect, useState } from 'react'
import PopUp from '../popup/PopUp'
import { ITask } from '../../types/task.types'
import { Add, Delete, Edit, RemoveRedEye } from '@mui/icons-material'
import { ChoiceContext, TaskChoiceActions } from '../../contexts/dialogContext'
import ViewTaskBoxesDialog from '../dialogs/tasks/ViewTaskBoxesDialog'
import EditTaskDialog from '../dialogs/tasks/EditTaskDialog'
import DeleteTaskDialog from '../dialogs/tasks/DeleteTaskDialog'
import AddBoxesDialog from '../dialogs/tasks/AddBoxesDialog'



type Props = {
    task: ITask | undefined
    setTask: React.Dispatch<React.SetStateAction<ITask | undefined>>,
    tasks: ITask[],
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    selectedTasks: ITask[]
    setSelectedTasks: React.Dispatch<React.SetStateAction<ITask[]>>,
    dates: {
        start_date?: string | undefined;
        end_date?: string | undefined;
    } | undefined
}

function TaskTable({ task, dates, tasks, setTask, selectAll, setSelectAll, selectedTasks, setSelectedTasks }: Props) {
    const [data, setData] = useState<ITask[]>(tasks)
    const { setChoice } = useContext(ChoiceContext)

    useEffect(() => {
        setData(tasks)
    }, [tasks])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                minHeight: '43.5vh'
            }}>
                <Table
                    stickyHeader
                    sx={{ width: "2000px" }}
                    size="small">
                    <TableHead
                    >
                        <TableRow>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <FormControlLabel sx={{ fontSize: 12 }} control={
                                        <Checkbox
                                            indeterminate={selectAll ? true : false}
                                            checked={Boolean(selectAll)}
                                            size="small" onChange={(e) => {
                                                if (e.currentTarget.checked) {
                                                    setSelectedTasks(tasks)
                                                    setSelectAll(true)
                                                }
                                                if (!e.currentTarget.checked) {
                                                    setSelectedTasks([])
                                                    setSelectAll(false)
                                                }
                                            }} />}
                                        label=""
                                    />
                                </Stack>
                            </TableCell>

                            {/* actions popup */}
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Actions
                                </Stack>
                            </TableCell>


                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Task Description
                                </Stack>
                            </TableCell>


                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Person
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Frequency
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Status
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Last Date
                                </Stack>
                            </TableCell>

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Created At
                                </Stack>
                            </TableCell>

                            {/* updated at */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Updated At
                                </Stack>
                            </TableCell>

                            {/* created by */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Created By
                                </Stack>
                            </TableCell>

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Updated By
                                </Stack>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {

                            data && data.map((task, index) => {
                                return (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            '&:nth-of-type(odd)': { bgcolor: color1 },
                                            '&:nth-of-type(even)': { bgcolor: color2 },
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer' }
                                        }}>
                                        {selectAll ?

                                            <TableCell>
                                                <Stack direction="row"
                                                    spacing={2}
                                                    justifyContent="left"
                                                    alignItems="center"
                                                >

                                                    <Checkbox size="small"
                                                        checked={Boolean(selectAll)}
                                                    />

                                                </Stack>
                                            </TableCell>
                                            :
                                            null}
                                        {!selectAll ?

                                            <TableCell>
                                                <Stack direction="row"
                                                    spacing={2}
                                                    justifyContent="left"
                                                    alignItems="center"
                                                >
                                                    <Checkbox size="small"
                                                        onChange={(e) => {
                                                            setTask(task)
                                                            if (e.target.checked) {
                                                                setSelectedTasks([...selectedTasks, task])
                                                            }
                                                            if (!e.target.checked) {
                                                                setSelectedTasks((tasks) => tasks.filter((item) => {
                                                                    return item._id !== task._id
                                                                }))
                                                            }
                                                        }}
                                                    />
                                                </Stack>
                                            </TableCell>
                                            :
                                            null/* actions popup */}

                                        <TableCell>
                                            <PopUp
                                                element={
                                                    <Stack direction="row" spacing={1}>
                                                        {

                                                            <>
                                                                <Tooltip title="Edit">
                                                                    <IconButton color="info"
                                                                        onClick={() => {
                                                                            setChoice({ type: TaskChoiceActions.edit_task })
                                                                            setTask(task)
                                                                        }}
                                                                    >
                                                                        <Edit />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Add More">
                                                                    <IconButton color="info"
                                                                        onClick={() => {
                                                                            setChoice({ type: TaskChoiceActions.add_more_boxes })
                                                                            setTask(task)
                                                                        }}
                                                                    >
                                                                        <Add />
                                                                    </IconButton>
                                                                </Tooltip>

                                                                <Tooltip title="Delete">
                                                                    <IconButton color="error"
                                                                        onClick={() => {
                                                                            setChoice({ type: TaskChoiceActions.delete_task })
                                                                            setTask(task)
                                                                        }}
                                                                    >
                                                                        <Delete />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="View">
                                                                    <IconButton color="success"
                                                                        onClick={() => {
                                                                            setChoice({ type: TaskChoiceActions.view_boxes })
                                                                            setTask(task)
                                                                        }}
                                                                    >
                                                                        <RemoveRedEye />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </>

                                                        }
                                                    </Stack>
                                                } />
                                        </TableCell>


                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{task.task_description && task.task_description.slice(0, 50)}</Typography>
                                        </TableCell>


                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{task.person.username}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{task.frequency_value ? `${task.frequency_value} days` : task.frequency_type}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            Checked : {task.boxes.filter((box) => {
                                                return box.is_completed && new Date(box.date) <= new Date()
                                            }).length}

                                            / {task.boxes.filter((box) => {
                                                return new Date(box.date).getDay() !== 0 && new Date(box.date) <= new Date()
                                            }).length}

                                        </TableCell>

                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{task.boxes.length > 0 && new Date(task.boxes[task.boxes.length - 1].date).toLocaleString()}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(task.created_at).toLocaleString()}</Typography>

                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(task.updated_at).toLocaleString()}</Typography>

                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{task.created_by.username}</Typography>

                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{task.updated_by.username}</Typography>

                                        </TableCell>




                                    </TableRow>
                                )
                            })

                        }
                    </TableBody>
                </Table>
            </Box >
            {
                task ?
                    <>
                        <ViewTaskBoxesDialog dates={dates}
                            task={task} />
                        <EditTaskDialog task={task} />
                        <DeleteTaskDialog task={task} />
                        <AddBoxesDialog task={task} />
                    </>
                    : null
            }
        </>
    )
}

export default TaskTable