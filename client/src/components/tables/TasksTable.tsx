import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import PopUp from '../popup/PopUp'
import { ITask } from '../../types/task.types'
import { Add, Delete, Edit, RemoveRedEye } from '@mui/icons-material'
import { ChoiceContext, TaskChoiceActions } from '../../contexts/dialogContext'
import ViewTaskBoxesDialog from '../dialogs/tasks/ViewTaskBoxesDialog'
import EditTaskDialog from '../dialogs/tasks/EditTaskDialog'
import DeleteTaskDialog from '../dialogs/tasks/DeleteTaskDialog'
import AddBoxesDialog from '../dialogs/tasks/AddBoxesDialog'
import { UserContext } from '../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'



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

function TaskSTable({ task, dates, tasks, setTask, selectAll, setSelectAll, selectedTasks, setSelectedTasks }: Props) {
    const [data, setData] = useState<ITask[]>(tasks)
    const { user } = useContext(UserContext)
    const { setChoice } = useContext(ChoiceContext)
    useEffect(() => {
        setData(tasks)
    }, [tasks])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                maxHeight: '64vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>
                            <STableHeadCell
                            >


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
                                    }} />

                            </STableHeadCell>

                            {/* actions popup */}
                            {user?.tasks_access_fields.is_editable && <STableHeadCell
                            >

                                Actions

                            </STableHeadCell>}


                            <STableHeadCell
                            >

                                Task Description

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Person

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Frequency

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Status

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Created At

                            </STableHeadCell>

                            {/* updated at */}

                            <STableHeadCell
                            >

                                Updated At

                            </STableHeadCell>

                            {/* created by */}

                            <STableHeadCell
                            >

                                Created By

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Updated By

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
                                        {selectAll ?

                                            <STableCell>


                                                <Checkbox size="small"
                                                    checked={Boolean(selectAll)}
                                                />


                                            </STableCell>
                                            :
                                            null}
                                        {!selectAll ?

                                            <STableCell>

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

                                            </STableCell>
                                            :
                                            null/* actions popup */}
                                        {user?.tasks_access_fields.is_editable &&
                                            <STableCell>
                                                <PopUp
                                                    element={
                                                        <Stack direction="row" spacing={1}>
                                                            {

                                                                <>
                                                                    {task.created_by._id === user._id &&
                                                                        <>
                                                                            {user.tasks_access_fields.is_editable && <>
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
                                                                            </>}
                                                                            {user?.tasks_access_fields.is_deletion_allowed &&
                                                                                <Tooltip title="Delete">
                                                                                    <IconButton color="error"
                                                                                        onClick={() => {
                                                                                            setChoice({ type: TaskChoiceActions.delete_task })
                                                                                            setTask(task)
                                                                                        }}
                                                                                    >
                                                                                        <Delete />
                                                                                    </IconButton>
                                                                                </Tooltip>}
                                                                        </>
                                                                    }
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

                                                        </Stack>} />
                                            </STableCell>}


                                        <STableCell>
                                            {task.task_description && task.task_description.slice(0, 50)}
                                        </STableCell>


                                        <STableCell>
                                            {task.person.username}
                                        </STableCell>
                                        <STableCell>
                                            {task.frequency_value ? `${task.frequency_value} days` : task.frequency_type}
                                        </STableCell>
                                        <STableCell>
                                            Checked : {task.boxes.filter((box) => {
                                                return box.is_completed && new Date(box.date) <= new Date()
                                            }).length}

                                            / {task.boxes.filter((box) => {
                                                return new Date(box.date).getDay() !== 0 && new Date(box.date) <= new Date()
                                            }).length}

                                        </STableCell>


                                        <STableCell>
                                            {new Date(task.created_at).toLocaleString()}

                                        </STableCell>
                                        <STableCell>
                                            {new Date(task.updated_at).toLocaleString()}

                                        </STableCell>
                                        <STableCell>
                                            {task.created_by.username}

                                        </STableCell>
                                        <STableCell>
                                            {task.updated_by.username}

                                        </STableCell>




                                    </STableRow>
                                )
                            })

                        }
                    </STableBody>
                </STable>
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

export default TaskSTable