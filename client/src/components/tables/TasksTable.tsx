import { Box, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
import { useEffect, useState } from 'react'
import PopUp from '../popup/PopUp'
import { ITask } from '../../types/task.types'



type Props = {
    task: ITask | undefined
    setTask: React.Dispatch<React.SetStateAction<ITask | undefined>>,
    tasks: ITask[],
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    selectedTasks: ITask[]
    setSelectedTasks: React.Dispatch<React.SetStateAction<ITask[]>>,
}

function TaskTable({ task, tasks, setTask, selectAll, setSelectAll, selectedTasks, setSelectedTasks }: Props) {
    const [data, setData] = useState<ITask[]>(tasks)

    useEffect(() => {
        setData(tasks)
    }, [tasks])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                height: '73.5vh'
            }}>
                <Table
                    stickyHeader
                    sx={{ width: "5000px" }}
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
                                    Dates
                                </Stack>
                            </TableCell>



                            {/* created at */}

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
                                            null
                                        }
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
                                            null
                                        }
                                        {/* actions popup */}

                                        <TableCell>
                                            <PopUp
                                                element={
                                                    <Stack direction="row" spacing={1}>
                                                    </Stack>
                                                }
                                            />
                                        </TableCell>


                                        {/* task name */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{task.task_description}</Typography>
                                            </TableCell>

                                        }
                                        {/* stage */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{task.person.username}</Typography>
                                            </TableCell>

                                        }
                                        {
                                            <TableCell>
                                                {
                                                    task.boxes.map((box, index) => {
                                                        return (
                                                            <Stack key={index} direction={'row'} gap={2}>
                                                                <Typography variant="body1"  >{new Date(box.date).toDateString()}</Typography>
                                                                <Typography variant="body1"  >{box.is_completed ? "completed" : "pending"}</Typography>
                                                            </Stack>
                                                        )
                                                    })}

                                            </TableCell>

                                        }
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(task.created_at).toLocaleString()}</Typography>

                                            </TableCell>

                                        }
                                        {/* updated at */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(task.updated_at).toLocaleString()}</Typography>

                                            </TableCell>

                                        }
                                        {/* created by */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{task.created_by.username}</Typography>

                                            </TableCell>

                                        }
                                        {/* updated by */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{task.updated_by.username}</Typography>

                                            </TableCell>

                                        }



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

                    </>
                    : null
            }
        </>
    )
}

export default TaskTable