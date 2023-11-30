import { Box, IconButton, TableBody, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
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
                                    Whatsapp Type
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
                                    Customer Name
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
                                    Delivery Status
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
                                    Updated at
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
                                            <Typography variant="body1">{report.mobile.replace("91", "").replace("@c.us", "")}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography variant="body1">{report.is_buisness ? "business" : "normal"}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography variant="body1">{report.customer_name}</Typography>
                                        </STableCell>

                                        <STableCell>
                                            <Typography variant="body1">{report.status}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography variant="body1">{report.created_at && new Date(report.created_at).toLocaleString()}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography variant="body1">{report.updated_at && new Date(report.updated_at).toLocaleString()}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography variant="body1">{report.created_by && report.created_by.username}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography variant="body1">{report.updated_by && report.updated_by.username}</Typography>
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