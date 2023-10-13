import { Block, Delete, Edit, Pause, RemoveRedEye, RestartAlt, Stop } from '@mui/icons-material'
import { Box, Checkbox, FormControlLabel, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
import { useContext, useEffect, useState } from 'react'
import { ReminderChoiceActions, ChoiceContext } from '../../contexts/dialogContext'
import UpdateReminderDialog from '../dialogs/reminders/UpdateReminderDialog'
import DeleteReminderDialog from '../dialogs/reminders/DeleteReminderDialog'
import ViewReminderDialog from '../dialogs/reminders/ViewReminderDialog'
import StartReminderDialog from '../dialogs/reminders/StartReminderDialog'
import ResetReminderDialog from '../dialogs/reminders/ResetReminderDialog'
import StopReminderDialog from '../dialogs/reminders/StopReminderDialog'
import UpdateReminderMessageDialog from '../dialogs/reminders/UpdateReminderMessageDialog'
import StartReminderMessageDialog from '../dialogs/reminders/StartReminderMessageDialog'
import PopUp from '../popup/PopUp'
import { IReminder } from '../../types/reminder.types'


type Props = {
    reminder: IReminder | undefined,
    setReminder: React.Dispatch<React.SetStateAction<IReminder | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    reminders: IReminder[],
    selectedReminders: IReminder[]
    setSelectedReminders: React.Dispatch<React.SetStateAction<IReminder[]>>,
}
function RemindersTable({ reminder, selectAll, reminders, setSelectAll, setReminder, selectedReminders, setSelectedReminders }: Props) {
    const [data, setData] = useState<IReminder[]>(reminders)
    const { setChoice } = useContext(ChoiceContext)
    useEffect(() => {
        if (data)
            setData(reminders)
    }, [reminders, data])
    return (
        <>
            <Box sx={{
                overflow: "scroll",
                maxHeight: '67vh'
            }}>
                <Table
                    stickyHeader
                    sx={{ minWidth: "2550px" }}
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

                                            size="small" onChange={(e) => {
                                                if (e.currentTarget.checked) {
                                                    setSelectedReminders(reminders)
                                                    setSelectAll(true)
                                                }
                                                if (!e.currentTarget.checked) {
                                                    setSelectedReminders([])
                                                    setSelectAll(false)
                                                }
                                            }} />}
                                        label=""
                                    />
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
                                    Reminder Name
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
                                    Type
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
                                    Run Once
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
                                    Reminder Status
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
                                    Start Time
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
                                    Next Run Date
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
                                    Message Type
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
                                    Frequency Type
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
                                    Random Templates
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
                                    Connected Number
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
                                    Status Updated
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
                            reminders && reminders.map((reminder, index) => {
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
                                                            setReminder(reminder)
                                                            if (e.target.checked) {
                                                                setSelectedReminders([...selectedReminders, reminder])
                                                            }
                                                            if (!e.target.checked) {
                                                                setSelectedReminders((reminders) => reminders.filter((item) => {
                                                                    return item._id !== reminder._id
                                                                }))
                                                            }
                                                        }}
                                                    />
                                                </Stack>
                                            </TableCell>
                                            :
                                            null
                                        }
                                        {/* actions */}

                                        <TableCell>
                                            <PopUp element={<Stack direction="row">{
                                                !reminder.is_active ?
                                                    <>
                                                        <Tooltip title="Start Reminder">
                                                            <IconButton
                                                                color="info"
                                                                size="medium"
                                                                onClick={() => {
                                                                    if (reminder.templates)
                                                                        setChoice({ type: ReminderChoiceActions.start_reminder })
                                                                    if (reminder.message)
                                                                        setChoice({ type: ReminderChoiceActions.start_message_reminder })
                                                                    setReminder(reminder)
                                                                }}>
                                                                <RestartAlt />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </>
                                                    :
                                                    <Tooltip title="Stop">
                                                        <IconButton
                                                            color="error"
                                                            size="medium"
                                                            onClick={() => {

                                                                setChoice({ type: ReminderChoiceActions.stop_reminder })
                                                                setReminder(reminder)
                                                            }}>
                                                            <Stop />
                                                        </IconButton>
                                                    </Tooltip>
                                            }


                                                <Tooltip title="Reset Reminder">
                                                    <IconButton
                                                        color="error"
                                                        size="medium"
                                                        onClick={() => {

                                                            setChoice({ type: ReminderChoiceActions.reset_reminder })
                                                            setReminder(reminder)
                                                        }}>
                                                        <Block />
                                                    </IconButton>
                                                </Tooltip>


                                                <Tooltip title="edit">
                                                    <IconButton
                                                        color="success"
                                                        size="medium"
                                                        disabled={Boolean(reminder.is_active)}
                                                        onClick={() => {

                                                            if (reminder.templates)
                                                                setChoice({ type: ReminderChoiceActions.update_reminder })
                                                            if (reminder.message)
                                                                setChoice({ type: ReminderChoiceActions.update_message_reminder })
                                                            setReminder(reminder)
                                                        }}>
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="delete">
                                                    <IconButton
                                                        color="error"
                                                        size="medium"
                                                        onClick={() => {

                                                            setChoice({ type: ReminderChoiceActions.delete_reminder })
                                                            setReminder(reminder)
                                                        }}>
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="view reports">
                                                    <IconButton
                                                        color="success"
                                                        size="medium"
                                                        onClick={() => {

                                                            setChoice({ type: ReminderChoiceActions.view_reminder })
                                                            setReminder(reminder)
                                                        }}>
                                                        <RemoveRedEye />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{reminder.name}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{reminder.is_todo ? "todo" : "reminder"}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{reminder.run_once ? "true" : "false"}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            {reminder.is_active ?
                                                <Typography variant="body1">{reminder.is_paused ? <Pause /> : <Stop />}</Typography> :
                                                <Typography variant="body1">Stopped</Typography>
                                            }

                                        </TableCell>
                                            < TableCell >
                                                <Typography variant="body1">{reminder.start_date && new Date(reminder.start_date).toLocaleString()}</Typography>
                                            </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{new Date(reminder.next_run_date).toLocaleString()}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body1">{reminder.message ? "message" : "template"}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{reminder.frequency_type}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{reminder.frequency_value}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body1">{reminder.is_random_template ? "yes" : "No"}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{reminder.connected_number && reminder.connected_number.toString().replace("91", "").replace("@c.us", "")}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body1">{reminder.updated_at && new Date(reminder.updated_at).toLocaleString()}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{reminder.created_by.username}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{reminder.updated_by.username}</Typography>
                                        </TableCell>

                                    </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>
                {
                    reminder ?
                        <>
                            <UpdateReminderDialog reminder={reminder} />
                            <DeleteReminderDialog reminder={reminder} />
                            <ViewReminderDialog reminder={reminder} />
                            <StartReminderDialog reminder={reminder} />
                            <ResetReminderDialog reminder={reminder} />
                            <StopReminderDialog reminder={reminder} />
                            <UpdateReminderMessageDialog reminder={reminder} />
                            <StartReminderMessageDialog reminder={reminder} />
                        </> : null
                }
            </Box >
        </>
    )
}

export default RemindersTable