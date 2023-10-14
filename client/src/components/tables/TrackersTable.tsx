import { AccountCircle, RestartAlt, Stop } from '@mui/icons-material'
import { Box, Checkbox, FormControlLabel, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
import { useContext, useEffect, useState } from 'react'
import { BotChoiceActions, ChoiceContext } from '../../contexts/dialogContext'
import UpdateTrackerDialog from '../dialogs/bot/UpdateTrackerDialog'
import ToogleBotDialog from '../dialogs/bot/ToogleBotDialog'
import { IMenuTracker } from '../../types/bot.types'
import PopUp from '../popup/PopUp'
import { UserContext } from '../../contexts/userContext'




type Props = {
    tracker: IMenuTracker | undefined
    setTracker: React.Dispatch<React.SetStateAction<IMenuTracker | undefined>>,
    trackers: IMenuTracker[],
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    selectedTrackers: IMenuTracker[]
    setSelectedTrackers: React.Dispatch<React.SetStateAction<IMenuTracker[]>>,
    selectableTrackers: IMenuTracker[]
}

function TrackersTable({ tracker, trackers, selectableTrackers, setTracker, selectAll, setSelectAll, selectedTrackers, setSelectedTrackers }: Props) {
    const { setChoice } = useContext(ChoiceContext)
    const [data, setData] = useState<IMenuTracker[]>(trackers)
    const { user } = useContext(UserContext)
    useEffect(() => {
        setData(trackers)
    }, [trackers])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                maxHeight: '70vh'
            }}>
                <Table
                    stickyHeader
                    sx={{ width: "1500px" }}
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
                                            indeterminate={selectAll ? true : false}
                                            size="small" onChange={(e) => {
                                                if (e.currentTarget.checked) {
                                                    setSelectedTrackers(selectableTrackers)
                                                    setSelectAll(true)
                                                }
                                                if (!e.currentTarget.checked) {
                                                    setSelectedTrackers([])
                                                    setSelectAll(false)
                                                }
                                            }} />}
                                        label=""
                                    />
                                </Stack>
                            </TableCell>

                            {/* actions popup */}


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



                            {/* tracker name */}


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
                                    Bot Number
                                </Stack>
                            </TableCell>


                            {/* stage */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Customer Phone
                                </Stack>
                            </TableCell>


                            {/* city */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Flow Name
                                </Stack>
                            </TableCell>

                            {/* state */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Last Interaction
                                </Stack>
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {

                            data && data.map((tracker, index) => {
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
                                                            setTracker(tracker)
                                                            if (e.target.checked) {
                                                                setSelectedTrackers([...selectedTrackers, tracker])
                                                            }
                                                            if (!e.target.checked) {
                                                                setSelectedTrackers((trackers) => trackers.filter((item) => {
                                                                    return item._id !== tracker._id
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
                                        {!user?.bot_access_fields.is_readonly && user?.bot_access_fields.is_editable &&
                                            <TableCell>
                                                <PopUp
                                                    element={
                                                        <Stack direction="row" spacing={1}>

                                                            <Tooltip title="Change Customer Name">
                                                                <IconButton color="primary"
                                                                    onClick={() => {
                                                                        setTracker(tracker)
                                                                        setChoice({ type: BotChoiceActions.update_tracker })
                                                                    }}

                                                                >
                                                                    <AccountCircle />
                                                                </IconButton>
                                                            </Tooltip>
                                                            {
                                                                tracker.is_active ?

                                                                    <Tooltip title="Stop bot for this person">
                                                                        <IconButton color="warning"
                                                                            onClick={() => {
                                                                                setTracker(tracker)
                                                                                setChoice({ type: BotChoiceActions.toogle_bot_status })
                                                                            }}

                                                                        >
                                                                            <Stop />
                                                                        </IconButton>
                                                                    </Tooltip> :
                                                                    <Tooltip title="Start bot for this person">
                                                                        <IconButton color="success"
                                                                            onClick={() => {
                                                                                setTracker(tracker)
                                                                                setChoice({ type: BotChoiceActions.toogle_bot_status })
                                                                            }}

                                                                        >
                                                                            <RestartAlt />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                            }


                                                        </Stack>}

                                                />
                                            </TableCell>}
                                        {/* tracker name */}

                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{tracker.customer_name || "NA"}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{tracker.bot_number.replace("91", "").replace("@c.us", "")}</Typography>
                                        </TableCell>


                                        {/* stage */}

                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{tracker.phone_number.replace("91", "").replace("@c.us", "")}</Typography>
                                        </TableCell>


                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{tracker.flow.flow_name}</Typography>
                                        </TableCell>



                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{tracker.updated_at && new Date(tracker.updated_at).toLocaleString()}</Typography>
                                        </TableCell>


                                    </TableRow>
                                )
                            })

                        }
                    </TableBody>
                </Table>
            </Box>
            {
                tracker ?
                    <>
                        <UpdateTrackerDialog tracker={tracker} />
                        <ToogleBotDialog tracker={tracker} />
                    </>
                    : null
            }
        </>
    )
}

export default TrackersTable