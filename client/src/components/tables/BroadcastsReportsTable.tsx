import { Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
import { useEffect, useState } from 'react'
import { Block } from '@mui/icons-material'
import StopSingleBroadcastDialog from '../dialogs/broadcasts/StopSingleBroadcastDialog'
import { IBroadcastReport } from '../../types/broadcast.types'

type Props = {
    report: IBroadcastReport | undefined,
    setReport: React.Dispatch<React.SetStateAction<IBroadcastReport | undefined>>
    reports: IBroadcastReport[] | undefined,

}
function BroadcastsReportsTable({ setReport, report, reports }: Props) {
    const [data, setData] = useState<IBroadcastReport[] | undefined>(reports)
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
                                    Whatsapp Type
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
                                    Customer Name
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
                                    Delivery Status
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
                                    Updated at
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
                                        <TableCell>
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

                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{report.mobile.replace("91", "").replace("@c.us", "")}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{report.is_buisness ? "business" : "normal"}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{report.customer_name}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body1">{report.status}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{report.created_at && new Date(report.created_at).toLocaleString()}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{report.updated_at && new Date(report.updated_at).toLocaleString()}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{report.created_by && report.created_by.username}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{report.updated_by && report.updated_by.username}</Typography>
                                        </TableCell>

                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
               
            </Box>
            <StopSingleBroadcastDialog report={report} setReport={setReport} />
        </>
    )
}

export default BroadcastsReportsTable