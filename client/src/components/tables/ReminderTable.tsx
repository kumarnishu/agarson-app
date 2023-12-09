import { Block, Edit, HideImageRounded, Pause, RemoveRedEye, RestartAlt, Stop } from '@mui/icons-material'
import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ReminderChoiceActions, ChoiceContext } from '../../contexts/dialogContext'
import UpdateReminderDialog from '../dialogs/reminders/UpdateReminderDialog'
import ViewReminderDialog from '../dialogs/reminders/ViewReminderDialog'
import StartReminderDialog from '../dialogs/reminders/StartReminderDialog'
import ResetReminderDialog from '../dialogs/reminders/ResetReminderDialog'
import StopReminderDialog from '../dialogs/reminders/StopReminderDialog'
import UpdateReminderMessageDialog from '../dialogs/reminders/UpdateReminderMessageDialog'
import StartReminderMessageDialog from '../dialogs/reminders/StartReminderMessageDialog'
import PopUp from '../popup/PopUp'
import { IReminder } from '../../types/reminder.types'
import { UserContext } from '../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import HideReminderDialog from '../dialogs/reminders/HideReminderDialog.tsx'


type Props = {
    reminder: IReminder | undefined,
    setReminder: React.Dispatch<React.SetStateAction<IReminder | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    reminders: IReminder[],
    selectedReminders: IReminder[]
    setSelectedReminders: React.Dispatch<React.SetStateAction<IReminder[]>>,
}
function RemindersSTable({ reminder, selectAll, reminders, setSelectAll, setReminder, selectedReminders, setSelectedReminders }: Props) {
    const [data, setData] = useState<IReminder[]>(reminders)
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
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
                                            setSelectedReminders(reminders)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedReminders([])
                                            setSelectAll(false)
                                        }
                                    }} />

                            </STableHeadCell>
                            {user?.reminders_access_fields.is_editable &&
                                <STableHeadCell
                                >

                                    Actions

                                </STableHeadCell>}
                            <STableHeadCell
                            >

                                Reminder Name

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Serial Number

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Type

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Run Once

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Reminder Status

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Start Time

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Next Run Date

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Message Type

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Frequency Type

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Frequency

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Random Templates

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Connected Number

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Status Updated

                            </STableHeadCell>
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
                            reminders && reminders.map((reminder, index) => {
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
                                            null
                                        }
                                        {!selectAll ?
                                            <STableCell>

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

                                            </STableCell>
                                            :
                                            null
                                        }
                                        {/* actions */}
                                        {user?.reminders_access_fields.is_editable &&
                                            <STableCell>
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
                                                    <Tooltip title="Hide Reminder">
                                                        <IconButton
                                                            color="warning"
                                                            size="medium"
                                                            onClick={() => {
                                                                setChoice({ type: ReminderChoiceActions.hide_reminder })
                                                                setReminder(reminder)
                                                            }}>
                                                            <HideImageRounded />
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
                                            </STableCell>}
                                        <STableCell>
                                            {reminder.name}
                                        </STableCell>
                                        <STableCell>
                                            {reminder.serial_number || "not available"}
                                        </STableCell>
                                        <STableCell>
                                            {reminder.is_todo ? "todo" : "reminder"}
                                        </STableCell>
                                        <STableCell>
                                            {reminder.run_once ? "true" : "false"}
                                        </STableCell>
                                        <STableCell>
                                            {reminder.is_active ?
                                                <>
                                                    {reminder.is_paused ? <Pause /> : <Stop />}
                                                </> :
                                                'Stopped'
                                            }

                                        </STableCell>
                                        < STableCell >
                                            {reminder.start_date && new Date(reminder.start_date).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {new Date(reminder.next_run_date).toLocaleString()}
                                        </STableCell>

                                        <STableCell>
                                            {reminder.message ? "message" : "template"}
                                        </STableCell>
                                        <STableCell>
                                            {reminder.frequency_type}
                                        </STableCell>
                                        <STableCell>
                                            {reminder.frequency_value}
                                        </STableCell>

                                        <STableCell>
                                            {reminder.is_random_template ? "yes" : "No"}
                                        </STableCell>
                                        <STableCell>
                                            {reminder.connected_number && reminder.connected_number.toString().replace("91", "").replace("@c.us", "")}
                                        </STableCell>

                                        <STableCell>
                                            {reminder.updated_at && new Date(reminder.updated_at).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {reminder.created_by.username}
                                        </STableCell>
                                        <STableCell>
                                            {reminder.updated_by.username}
                                        </STableCell>

                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>
                {
                    reminder ?
                        <>
                            <UpdateReminderDialog reminder={reminder} />
                            <ViewReminderDialog reminder={reminder} />
                            <StartReminderDialog reminder={reminder} />
                            <ResetReminderDialog reminder={reminder} />
                            <StopReminderDialog reminder={reminder} />
                            <UpdateReminderMessageDialog reminder={reminder} />
                            <StartReminderMessageDialog reminder={reminder} />
                            <HideReminderDialog reminder={reminder} />
                        </> : null
                }
            </Box >
        </>
    )
}

export default RemindersSTable