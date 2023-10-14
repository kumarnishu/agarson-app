import { Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
import { useContext, useEffect, useState } from 'react'
import { Block } from '@mui/icons-material'
import StopSingleReminderDialog from '../dialogs/reminders/StopSingleReminderDialog'
import { IContactReport } from '../../types/contact.types'
import { UserContext } from '../../contexts/userContext'

type Props = {
    report: IContactReport | undefined,
    setReport: React.Dispatch<React.SetStateAction<IContactReport | undefined>>
    reports: IContactReport[] | undefined,

}
function RemindersReportsTable({ setReport, report, reports }: Props) {
    const [data, setData] = useState<IContactReport[] | undefined>(reports)
    const { user } = useContext(UserContext)
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
                            </TableCell>
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
                            </TableCell>
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
                                    Timestamp
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
                                    Created at
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
                            data && data.map((report, index) => {
                                return (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            '&:nth-of-type(odd)': { bgcolor: color1 },
                                            '&:nth-of-type(even)': { bgcolor: color2 },
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer' }
                                        }}>
                                        {!user?.reminders_access_fields.is_readonly && user?.reminders_access_fields.is_editable &&
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
                                        <TableCell>
                                            <Typography variant="body1">{report.contact && report.contact.mobile.replace("91", "").replace("@c.us", "")}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{report.whatsapp_status}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{report.reminder_status}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{report.updated_at && new Date(report.updated_at).toLocaleString()}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{report.created_at && new Date(report.created_at).toLocaleString()}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body1">{report.created_by.username}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{report.updated_by.username}</Typography>
                                        </TableCell>
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