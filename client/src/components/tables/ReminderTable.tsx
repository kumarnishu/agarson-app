import { Block, Delete, Edit, Pause, RemoveRedEye, RestartAlt, Stop } from '@mui/icons-material'
import { Box, Checkbox, FormControlLabel, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
import { useContext, useEffect, useState } from 'react'
import { ReminderChoiceActions, ChoiceContext } from '../../contexts/dialogContext'
import { IReminder } from '../../types'
import UpdateReminderDialog from '../dialogs/reminders/UpdateReminderDialog'
import DeleteReminderDialog from '../dialogs/reminders/DeleteReminderDialog'
import ViewReminderDialog from '../dialogs/reminders/ViewReminderDialog'
import StartReminderDialog from '../dialogs/reminders/StartReminderDialog'
import ResetReminderDialog from '../dialogs/reminders/ResetReminderDialog'
import StopReminderDialog from '../dialogs/reminders/StopReminderDialog'
import UpdateReminderMessageDialog from '../dialogs/reminders/UpdateReminderMessageDialog'
import StartReminderMessageDialog from '../dialogs/reminders/StartReminderMessageDialog'
import PopUp from '../popup/PopUp'
import { useReminderFields } from '../hooks/ReminderFieldsHooks'


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
    const { hiddenFields, readonlyFields } = useReminderFields()
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
                            {!hiddenFields?.includes('Export To Excel') &&
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
                                </TableCell>}
                            {!hiddenFields?.includes('Actions') &&
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
                                </TableCell>}
                            {!hiddenFields?.includes('Reminder Name') &&
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
                                </TableCell>}
                            {!hiddenFields?.includes('Reminder Type') &&
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
                                </TableCell>}
                            {!hiddenFields?.includes('Run Once') &&
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
                                </TableCell>}
                            {!hiddenFields?.includes('Reminder Status') &&
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
                                </TableCell>}
                            {!hiddenFields?.includes('Start Time') &&
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
                                </TableCell>}
                            {!hiddenFields?.includes('Next Run Date') &&
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
                                </TableCell>}

                            {!hiddenFields?.includes('Message type') &&
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
                                </TableCell>}
                            {!hiddenFields?.includes('Frequency Type') &&
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
                                </TableCell>}
                            {!hiddenFields?.includes('Frequency') &&
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
                                </TableCell>}


                            {!hiddenFields?.includes('Random templates') &&
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
                                </TableCell>}
                            {!hiddenFields?.includes('Connected Number') &&
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
                                </TableCell>}

                            {!hiddenFields?.includes('Updated At') &&
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
                                </TableCell>}
                            {!hiddenFields?.includes('Created By') &&
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
                                </TableCell>}
                            {!hiddenFields?.includes('Updated by') &&
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
                                </TableCell>}
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
                                        {selectAll && !hiddenFields?.includes('Export To Excel') ?
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
                                        {!selectAll && !hiddenFields?.includes('Export To Excel') ?
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

                                        {!hiddenFields?.includes('Actions') &&
                                            <TableCell>
                                                <PopUp element={<Stack direction="row">{
                                                    !reminder.is_active ?
                                                        <>
                                                            <Tooltip title="Start Reminder">
                                                                <IconButton
                                                                    color="info"
                                                                    size="medium"
                                                                    disabled={readonlyFields?.includes('Start And Stop')}
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
                                                                disabled={readonlyFields?.includes('Start And Stop')}
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
                                                            disabled={readonlyFields?.includes('Reset Reminder')}
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
                                            </TableCell>}
                                        {!hiddenFields?.includes('Reminder Name') &&
                                            <TableCell>
                                                <Typography variant="body1">{reminder.name}</Typography>
                                            </TableCell>}
                                        {!hiddenFields?.includes('Reminder Type') &&
                                            <TableCell>
                                                <Typography variant="body1">{reminder.is_todo ? "todo" : "reminder"}</Typography>
                                            </TableCell>}
                                        {!hiddenFields?.includes('Run Once') &&
                                            <TableCell>
                                                <Typography variant="body1">{reminder.run_once ? "true" : "false"}</Typography>
                                            </TableCell>}
                                        {!hiddenFields?.includes('Start And Stop') &&
                                            <TableCell>
                                                {reminder.is_active ?
                                                    <Typography variant="body1">{reminder.is_paused ? <Pause /> : <Stop />}</Typography> :
                                                    <Typography variant="body1">Stopped</Typography>
                                                }

                                            </TableCell>}
                                        {!hiddenFields?.includes('Start Time') &&
                                            < TableCell >
                                                <Typography variant="body1">{reminder.start_date && new Date(reminder.start_date).toLocaleString()}</Typography>
                                            </TableCell>}
                                        {!hiddenFields?.includes('Next Run Date') &&
                                            <TableCell>
                                                <Typography variant="body1">{new Date(reminder.next_run_date).toLocaleString()}</Typography>
                                            </TableCell>}

                                        {!hiddenFields?.includes('Message type') &&
                                            <TableCell>
                                                <Typography variant="body1">{reminder.message ? "message" : "template"}</Typography>
                                            </TableCell>}
                                        {!hiddenFields?.includes('Frequency Type') &&
                                            <TableCell>
                                                <Typography variant="body1">{reminder.frequency_type}</Typography>
                                            </TableCell>}
                                        {!hiddenFields?.includes('Frequency') &&
                                            <TableCell>
                                                <Typography variant="body1">{reminder.frequency_value}</Typography>
                                            </TableCell>}

                                        {!hiddenFields?.includes('Random templates') &&
                                            <TableCell>
                                                <Typography variant="body1">{reminder.is_random_template ? "yes" : "No"}</Typography>
                                            </TableCell>}
                                        {!hiddenFields?.includes('Connected Number') &&
                                            <TableCell>
                                                <Typography variant="body1">{reminder.connected_number && reminder.connected_number.toString().replace("91", "").replace("@c.us", "")}</Typography>
                                            </TableCell>}

                                        {!hiddenFields?.includes('Updated At') &&
                                            <TableCell>
                                                <Typography variant="body1">{reminder.updated_at && new Date(reminder.updated_at).toLocaleString()}</Typography>
                                            </TableCell>}
                                        {!hiddenFields?.includes('Created By') &&
                                            <TableCell>
                                                <Typography variant="body1">{reminder.created_by.username}</Typography>
                                            </TableCell>}
                                        {!hiddenFields?.includes('Updated by') &&
                                            <TableCell>
                                                <Typography variant="body1">{reminder.updated_by.username}</Typography>
                                            </TableCell>}

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