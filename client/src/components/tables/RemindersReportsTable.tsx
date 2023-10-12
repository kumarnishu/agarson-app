import { Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
import { useEffect, useState } from 'react'
import { Block } from '@mui/icons-material'
import StopSingleReminderDialog from '../dialogs/reminders/StopSingleReminderDialog'
import { IContactReport } from '../../types'
import { useReminderFields } from '../hooks/ReminderFieldsHooks'

type Props = {
    report: IContactReport | undefined,
    setReport: React.Dispatch<React.SetStateAction<IContactReport | undefined>>
    reports: IContactReport[] | undefined,

}
function RemindersReportsTable({ setReport, report, reports }: Props) {
    const [data, setData] = useState<IContactReport[] | undefined>(reports)
    const { hiddenFields } = useReminderFields()
    useEffect(() => {
        if (data && reports)
            setData(reports)
    }, [reports, data])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                maxHeight: '80vh'
            }}>
                <Table
                    stickyHeader
                    sx={{ minWidth: "2050px" }}
                    size="small">
                    <TableHead
                    >
                        <TableRow>
                            {!hiddenFields?.includes('Actions') &&
                                <TableCell
                                    sx={{ bgcolor: headColor }}                         >
                                    <Stack
                                        direction="row"
                                        justifyContent="left"
                                        alignItems="left"
                                        spacing={2}
                                    >
                                        Action
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
                                        Mobile
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
                                        Whatsapp Status
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
                            {!hiddenFields?.includes('Updated At') &&
                                <TableCell
                                    sx={{ bgcolor: headColor }}                         >
                                    <Stack
                                        direction="row"
                                        justifyContent="left"
                                        alignItems="left"
                                        spacing={2}
                                    >
                                        Timestamp
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
                                        Created at
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
                            data && data.map((report, index) => {
                                return (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            '&:nth-of-type(odd)': { bgcolor: color1 },
                                            '&:nth-of-type(even)': { bgcolor: color2 },
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer' }
                                        }}>
                                        {!hiddenFields?.includes('Start And Stop') &&
                                            <TableCell>
                                                <Tooltip title="Stop">
                                                    <IconButton
                                                        disabled={report.whatsapp_status !== "pending"}
                                                        color="error"
                                                        size="medium"
                                                        onClick={() => {
                                                            setReport(report)
                                                        }}>
                                                        <Block />
                                                    </IconButton>
                                                </Tooltip>

                                            </TableCell>}
                                        {!hiddenFields?.includes('Connected Number') &&
                                            <TableCell>
                                                <Typography variant="body1">{report.contact && report.contact.mobile.replace("91", "").replace("@c.us", "")}</Typography>
                                            </TableCell>}
                                        {!hiddenFields?.includes('Reminder Status') &&
                                            <TableCell>
                                                <Typography variant="body1">{report.whatsapp_status}</Typography>
                                            </TableCell>}
                                        {!hiddenFields?.includes('Reminder Status') &&
                                            <TableCell>
                                                <Typography variant="body1">{report.reminder_status}</Typography>
                                            </TableCell>}
                                        {!hiddenFields?.includes('Updated At') &&
                                            <TableCell>
                                                <Typography variant="body1">{report.updated_at && new Date(report.updated_at).toLocaleString()}</Typography>
                                            </TableCell>}
                                        {!hiddenFields?.includes('Updated At') &&
                                            <TableCell>
                                                <Typography variant="body1">{report.created_at && new Date(report.created_at).toLocaleString()}</Typography>
                                            </TableCell>
                                        }
                                        {!hiddenFields?.includes('Created By') &&
                                        <TableCell>
                                            <Typography variant="body1">{report.created_by.username}</Typography>
                                        </TableCell>}
                                        {!hiddenFields?.includes('Updated by') &&
                                        <TableCell>
                                            <Typography variant="body1">{report.updated_by.username}</Typography>
                                        </TableCell>}
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>

            </Box >
            <StopSingleReminderDialog report={report} setReport={setReport} />
        </>
    )
}

export default RemindersReportsTable