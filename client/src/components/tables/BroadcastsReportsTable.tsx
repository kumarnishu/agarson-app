import { Box, IconButton, TableBody, Tooltip } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { Block } from '@mui/icons-material'
import StopSingleBroadcastDialog from '../dialogs/broadcasts/StopSingleBroadcastDialog'
import { IBroadcastReport } from '../../types/broadcast.types'
import { UserContext } from '../../contexts/userContext'
import { STable, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'

type Props = {
    report: IBroadcastReport | undefined,
    setReport: React.Dispatch<React.SetStateAction<IBroadcastReport | undefined>>
    reports: IBroadcastReport[] | undefined,

}
function BroadcastsReportsTable({ setReport, report, reports }: Props) {
    const [data, setData] = useState<IBroadcastReport[] | undefined>(reports)
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
                            {user?.broadcast_access_fields.is_editable &&
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
                             
                                    Whatsapp Type
                               
                            </STableHeadCell>
                            <STableHeadCell
                            >
                             
                                    Customer Name
                               
                            </STableHeadCell>
                            <STableHeadCell
                            >
                             
                                    Delivery Status
                               
                            </STableHeadCell>

                            <STableHeadCell
                            >
                             
                                    Created at
                               
                            </STableHeadCell>
                            <STableHeadCell
                            >
                             
                                    Updated at
                               
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
                    <TableBody >
                        {
                            data && data.map((report, index) => {
                                return (
                                    <STableRow
                                        key={index}
                                       >
                                        {user?.broadcast_access_fields.is_editable &&
                                            <STableCell>
                                                <Tooltip title="Stop">
                                                    <IconButton
                                                        disabled={report.status !== "pending"}
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
                                           {report.mobile.replace("91", "").replace("@c.us", "")}
                                        </STableCell>
                                        <STableCell>
                                           {report.is_buisness ? "business" : "normal"}
                                        </STableCell>
                                        <STableCell>
                                           {report.customer_name}
                                        </STableCell>

                                        <STableCell>
                                           {report.status}
                                        </STableCell>
                                        <STableCell>
                                           {report.created_at && new Date(report.created_at).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                           {report.updated_at && new Date(report.updated_at).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                           {report.created_by && report.created_by.username}
                                        </STableCell>
                                        <STableCell>
                                           {report.updated_by && report.updated_by.username}
                                        </STableCell>

                                    </STableRow>
                                )
                            })
                        }
                    </TableBody>
                </STable>

            </Box>
            <StopSingleBroadcastDialog report={report} setReport={setReport} />
        </>
    )
}

export default BroadcastsReportsTable