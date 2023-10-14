import { Block, Delete, Edit, Pause, RemoveRedEye, ResetTv, RestartAlt, Stop } from '@mui/icons-material'
import { Box, Checkbox, FormControlLabel, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
import { useContext, useEffect, useState } from 'react'
import { BroadcastChoiceActions, ChoiceContext } from '../../contexts/dialogContext'
import UpdateBroadcastDialog from '../dialogs/broadcasts/UpdateBroadcastDialog'
import DeleteBroadcastDialog from '../dialogs/broadcasts/DeleteBroadcastDialog'
import ViewBroadcastDialog from '../dialogs/broadcasts/ViewBroadcastDialog'
import StartBroadcastDialog from '../dialogs/broadcasts/StartBroadcastDialog'
import ResetBroadcastDialog from '../dialogs/broadcasts/ResetBroadcastDialog'
import StopBroadcastDialog from '../dialogs/broadcasts/StopBroadcastDialog'
import UpdateBroadcastMessageDialog from '../dialogs/broadcasts/UpdateBroadcastMessageDialog'
import StartBroadcastMessageDialog from '../dialogs/broadcasts/StartBroadcastMessageDialog'
import PopUp from '../popup/PopUp'
import SetDailyCountBroadcastDialog from '../dialogs/broadcasts/SetDailyCountDialog'
import { IBroadcast } from '../../types/broadcast.types'
import { UserContext } from '../../contexts/userContext'


type Props = {
    broadcast: IBroadcast | undefined,
    setBroadcast: React.Dispatch<React.SetStateAction<IBroadcast | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    broadcasts: IBroadcast[],
    selectedBroadcasts: IBroadcast[]
    setSelectedBroadcasts: React.Dispatch<React.SetStateAction<IBroadcast[]>>,
}
function BroadcastsTable({ broadcast, selectAll, broadcasts, setSelectAll, setBroadcast, selectedBroadcasts, setSelectedBroadcasts }: Props) {
    const [data, setData] = useState<IBroadcast[]>(broadcasts)
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    useEffect(() => {
        if (data)
            setData(broadcasts)
    }, [broadcasts, data])
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
                                                    setSelectedBroadcasts(broadcasts)
                                                    setSelectAll(true)
                                                }
                                                if (!e.currentTarget.checked) {
                                                    setSelectedBroadcasts([])
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
                                    Broadcast Name
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
                                    Status
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
                                    Time Gap
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
                                    Using Leads
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
                                    Daily Limit
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
                                    Daily Count
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
                                    Auto Refresh
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
                            broadcasts && broadcasts.map((broadcast, index) => {
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
                                                            setBroadcast(broadcast)
                                                            if (e.target.checked) {
                                                                setSelectedBroadcasts([...selectedBroadcasts, broadcast])
                                                            }
                                                            if (!e.target.checked) {
                                                                setSelectedBroadcasts((broadcasts) => broadcasts.filter((item) => {
                                                                    return item._id !== broadcast._id
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
                                        {!user?.broadcast_access_fields.is_readonly && user?.broadcast_access_fields.is_editable &&
                                            <TableCell>
                                                <PopUp element={<Stack direction="row">{
                                                    !broadcast.is_active ?
                                                        <>
                                                            <Tooltip title="Start Broadcasting">
                                                                <IconButton
                                                                    color="info"
                                                                    size="medium"
                                                                    onClick={() => {

                                                                        if (broadcast.templates)
                                                                            setChoice({ type: BroadcastChoiceActions.start_broadcast })
                                                                        if (broadcast.message)
                                                                            setChoice({ type: BroadcastChoiceActions.start_message_broadcast })
                                                                        setBroadcast(broadcast)
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

                                                                    setChoice({ type: BroadcastChoiceActions.stop_broadcast })
                                                                    setBroadcast(broadcast)
                                                                }}>
                                                                <Stop />
                                                            </IconButton>
                                                        </Tooltip>
                                                }


                                                    <Tooltip title="Reset Broadcasting">
                                                        <IconButton
                                                            color="error"
                                                            size="medium"
                                                            onClick={() => {

                                                                setChoice({ type: BroadcastChoiceActions.reset_broadcast })
                                                                setBroadcast(broadcast)
                                                            }}>
                                                            <Block />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Set Daily Count">
                                                        <IconButton
                                                            color="warning"
                                                            size="medium"
                                                            onClick={() => {

                                                                setChoice({ type: BroadcastChoiceActions.set_daily_count })
                                                                setBroadcast(broadcast)
                                                            }}>
                                                            <ResetTv />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="edit">
                                                        <IconButton
                                                            color="success"
                                                            size="medium"
                                                            disabled={Boolean(broadcast.is_active)}
                                                            onClick={() => {

                                                                if (broadcast.templates)
                                                                    setChoice({ type: BroadcastChoiceActions.update_broadcast })
                                                                if (broadcast.message)
                                                                    setChoice({ type: BroadcastChoiceActions.update_message_broadcast })
                                                                setBroadcast(broadcast)
                                                            }}>
                                                            <Edit />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {user?.broadcast_access_fields.is_deletion_allowed &&
                                                        <Tooltip title="delete">
                                                            <IconButton
                                                                color="error"
                                                                size="medium"
                                                                onClick={() => {

                                                                    setChoice({ type: BroadcastChoiceActions.delete_broadcast })
                                                                    setBroadcast(broadcast)
                                                                }}>
                                                                <Delete />
                                                            </IconButton>
                                                        </Tooltip>}
                                                    <Tooltip title="view reports">
                                                        <IconButton
                                                            color="success"
                                                            size="medium"
                                                            onClick={() => {

                                                                setChoice({ type: BroadcastChoiceActions.view_broadcast })
                                                                setBroadcast(broadcast)
                                                            }}>
                                                            <RemoveRedEye />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>} />
                                            </TableCell>}
                                        <TableCell>
                                            <Typography variant="body1">{broadcast.name}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            {broadcast.is_active ?
                                                <Typography variant="body1">{broadcast.is_paused ? <Pause /> : <Stop />}</Typography> :
                                                <Typography variant="body1">stopped</Typography>
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{broadcast.time_gap + " seconds"}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{broadcast.created_at && new Date(broadcast.start_date).toLocaleString()}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{new Date(broadcast.next_run_date).toLocaleString()}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{broadcast.leads_selected ? "Yes" : "No"}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{broadcast.message ? "custom" : "template"}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body1">{broadcast.daily_limit ? broadcast.daily_limit : "No"}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{broadcast.daily_count && broadcast.daily_count}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{broadcast.autoRefresh ? "Yes" : "Not Set"}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body1">{broadcast.is_random_template ? "Yes" : "No"}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{broadcast.connected_number && broadcast.connected_number.toString().replace("91", "").replace("@c.us", "")}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body1">{broadcast.updated_at && new Date(broadcast.updated_at).toLocaleString()}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{broadcast.created_by.username}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{broadcast.updated_by.username}</Typography>
                                        </TableCell>

                                    </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>
                {
                    broadcast ?
                        <>
                            <UpdateBroadcastDialog broadcast={broadcast} />
                            <DeleteBroadcastDialog broadcast={broadcast} />
                            <ViewBroadcastDialog broadcast={broadcast} />
                            <StartBroadcastDialog broadcast={broadcast} />
                            <ResetBroadcastDialog broadcast={broadcast} />
                            <StopBroadcastDialog broadcast={broadcast} />
                            <UpdateBroadcastMessageDialog broadcast={broadcast} />
                            <StartBroadcastMessageDialog broadcast={broadcast} />
                            <SetDailyCountBroadcastDialog broadcast={broadcast} />
                        </> : null
                }
            </Box>
        </>
    )
}

export default BroadcastsTable