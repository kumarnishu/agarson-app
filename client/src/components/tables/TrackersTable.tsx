import { AccountCircle, RestartAlt, Stop } from '@mui/icons-material'
import { Box, Checkbox, FormControlLabel, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/userContext'
import { BotChoiceActions, ChoiceContext } from '../../contexts/dialogContext'
import UpdateTrackerDialog from '../dialogs/bot/UpdateTrackerDialog'
import ToogleBotDialog from '../dialogs/bot/ToogleBotDialog'
import { IMenuTracker } from '../../types'
import PopUp from '../popup/PopUp'
import { useBotFields } from '../hooks/UserAccessFieldsHooks'




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
    const { user } = useContext(UserContext)
    const [data, setData] = useState<IMenuTracker[]>(trackers)
    const { hiddenFields, readonlyFields } = useBotFields
        ()
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
                            {!hiddenFields?.includes('Export To Excel') &&
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
                                </TableCell>}

                            {/* actions popup */}

                            {!hiddenFields?.includes('Tracker Actions') &&
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
                            }


                            {/* tracker name */}

                            {!hiddenFields?.includes('Customer Name') ?
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
                                :
                                null}

                            {!hiddenFields?.includes('Bot Number') ?
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
                                :
                                null}

                            {/* stage */}
                            {!hiddenFields?.includes('Customer Phone') ?
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
                                :
                                null}

                            {/* city */}
                            {!hiddenFields?.includes('Flow Name') ?
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
                                :
                                null}
                            {/* state */}
                            {!hiddenFields?.includes('Last Interaction') ?
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
                                :
                                null}
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
                                        {selectAll && !hiddenFields?.includes('Export To Excel') ?

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
                                        {!selectAll && !hiddenFields?.includes('Export To Excel') ?

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
                                        {!hiddenFields?.includes('Tracker Actions') &&
                                            <TableCell>
                                                <PopUp
                                                    element={
                                                        <Stack direction="row" spacing={1}>
                                                            {
                                                                user?.is_admin ?
                                                                    <>
                                                                        {!hiddenFields?.includes('Edit Greeting Name') &&
                                                                            <Tooltip title="Change Customer Name">
                                                                                <IconButton color="primary"
                                                                                    onClick={() => {
                                                                                        setTracker(tracker)
                                                                                        setChoice({ type: BotChoiceActions.update_tracker })
                                                                                    }}
                                                                                    disabled={readonlyFields?.includes('Edit Greeting Name')}
                                                                                >
                                                                                    <AccountCircle />
                                                                                </IconButton>
                                                                            </Tooltip>}

                                                                        {
                                                                            !hiddenFields?.includes('Start And Stop') && <>

                                                                                {
                                                                                    tracker.is_active ?

                                                                                        <Tooltip title="Stop bot for this person">
                                                                                            <IconButton color="warning"
                                                                                                onClick={() => {
                                                                                                    setTracker(tracker)
                                                                                                    setChoice({ type: BotChoiceActions.toogle_bot_status })
                                                                                                }}
                                                                                                disabled={readonlyFields?.includes('Start And Stop')}
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
                                                                                                disabled={readonlyFields?.includes('Start And Stop')}
                                                                                            >
                                                                                                <RestartAlt />
                                                                                            </IconButton>
                                                                                        </Tooltip>

                                                                                }
                                                                            </>}



                                                                    </>
                                                                    :
                                                                    null
                                                            }
                                                        </Stack>
                                                    }
                                                />
                                            </TableCell>}
                                        {/* tracker name */}
                                        {!hiddenFields?.includes('Customer Name') ?
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{tracker.customer_name || "NA"}</Typography>
                                            </TableCell>
                                            :
                                            null}
                                        {!hiddenFields?.includes('Bot Number') ?
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{tracker.bot_number.replace("91", "").replace("@c.us", "")}</Typography>
                                            </TableCell>
                                            :
                                            null}

                                        {/* stage */}
                                        {!hiddenFields?.includes('Customer Phone') ?
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{tracker.phone_number.replace("91", "").replace("@c.us", "")}</Typography>
                                            </TableCell>
                                            :
                                            null}
                                        {/* city */}
                                        {!hiddenFields?.includes('Flow Name') ?
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{tracker.flow.flow_name}</Typography>
                                            </TableCell>
                                            :
                                            null}

                                        {/* tracker type */}
                                        {!hiddenFields?.includes('Last Updated date') ?
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{tracker.updated_at && new Date(tracker.updated_at).toLocaleString()}</Typography>
                                            </TableCell>
                                            :
                                            null}

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