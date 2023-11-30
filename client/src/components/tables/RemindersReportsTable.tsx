import { Box, IconButton,Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { Block } from '@mui/icons-material'
import StopSingleReminderDialog from '../dialogs/reminders/StopSingleReminderDialog'
import { IContactReport } from '../../types/contact.types'
import { UserContext } from '../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'

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
                <STable
                   >
                    <STableHead
                    >
                        <STableRow>
                            { user?.reminders_access_fields.is_editable &&
                            <STableHeadCell
                                                        >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Action
                                </Stack>
                            </STableHeadCell>}
                            <STableHeadCell
                                                        >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Mobile
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                                                        >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Whatsapp Status
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                                                        >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Reminder Status
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                                                        >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Timestamp
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                                                        >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Created at
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                                                        >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Created By
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                                                        >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Updated By
                                </Stack>
                            </STableHeadCell>
                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {
                            data && data.map((report, index) => {
                                return (
                                    <STableRow
                                        key={index}
                                        >
                                        { user?.reminders_access_fields.is_editable &&
                                            <STableCell>
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

                                            </STableCell>}
                                        <STableCell>
                                            <Typography variant="body1">{report.contact && report.contact.mobile.replace("91", "").replace("@c.us", "")}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography variant="body1">{report.whatsapp_status}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography variant="body1">{report.reminder_status}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography variant="body1">{report.updated_at && new Date(report.updated_at).toLocaleString()}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography variant="body1">{report.created_at && new Date(report.created_at).toLocaleString()}</Typography>
                                        </STableCell>

                                        <STableCell>
                                            <Typography variant="body1">{report.created_by.username}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography variant="body1">{report.updated_by.username}</Typography>
                                        </STableCell>
                                    </STableRow>
                                )
                            })
                        }
                    </STableBody>
                </STable>

            </Box >
            <StopSingleReminderDialog report={report} setReport={setReport} />
        </>
    )
}

export default RemindersReportsTable