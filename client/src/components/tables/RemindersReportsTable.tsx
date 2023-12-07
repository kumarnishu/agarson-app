import { Box, IconButton,Tooltip } from '@mui/material'
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
                              
                                    Action
                                
                            </STableHeadCell>}
                            <STableHeadCell
                                                        >
                              
                                    Mobile
                                
                            </STableHeadCell>
                            <STableHeadCell
                                                        >
                              
                                    Whatsapp Status
                                
                            </STableHeadCell>
                            <STableHeadCell
                                                        >
                              
                                    Reminder Status
                                
                            </STableHeadCell>
                            <STableHeadCell
                                                        >
                              
                                    Timestamp
                                
                            </STableHeadCell>
                            <STableHeadCell
                                                        >
                              
                                    Created at
                                
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
                                          {report.contact && report.contact.mobile.replace("91", "").replace("@c.us", "")}
                                        </STableCell>
                                        <STableCell>
                                          {report.whatsapp_status}
                                        </STableCell>
                                        <STableCell>
                                          {report.reminder_status}
                                        </STableCell>
                                        <STableCell>
                                          {report.updated_at && new Date(report.updated_at).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                          {report.created_at && new Date(report.created_at).toLocaleString()}
                                        </STableCell>

                                        <STableCell>
                                          {report.created_by.username}
                                        </STableCell>
                                        <STableCell>
                                          {report.updated_by.username}
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