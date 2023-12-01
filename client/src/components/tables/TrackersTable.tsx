import { AccountCircle, Delete, RestartAlt, Stop } from '@mui/icons-material'
import { Box, Checkbox, FormControlLabel, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { BotChoiceActions, ChoiceContext } from '../../contexts/dialogContext'
import UpdateTrackerDialog from '../dialogs/bot/UpdateTrackerDialog'
import ToogleBotDialog from '../dialogs/bot/ToogleBotDialog'
import { IMenuTracker } from '../../types/bot.types'
import PopUp from '../popup/PopUp'
import { UserContext } from '../../contexts/userContext'
import DeleteTrackerDialog from '../dialogs/bot/DeleteTrackerDialog'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'


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

function TrackersSTable({ tracker, trackers, selectableTrackers, setTracker, selectAll, setSelectAll, selectedTrackers, setSelectedTrackers }: Props) {
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
                <STable
                    >
                    <STableHead
                    >
                        <STableRow>

                            <STableHeadCell
                                                         >
                                
                                    <FormControlLabel sx={{ fontSize: 12 }} control={
                                        <Checkbox
                                            indeterminate={selectAll ? true : false}
                                            checked={Boolean(selectAll)}
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
                               
                            </STableHeadCell>


                            {user?.bot_access_fields.is_editable &&
                                <STableHeadCell
                                                             >
                                    
                                        Actions
                                   
                                </STableHeadCell>}



                            <STableHeadCell
                                                         >
                                
                                    Status
                               
                            </STableHeadCell>

                            <STableHeadCell
                                                         >
                                
                                    Customer Name
                               
                            </STableHeadCell>



                            <STableHeadCell
                                                         >
                                
                                    Bot Number
                               
                            </STableHeadCell>



                            <STableHeadCell
                                                         >
                                
                                    Customer Phone
                               
                            </STableHeadCell>



                            <STableHeadCell
                                                         >
                                
                                    Flow Name
                               
                            </STableHeadCell>


                            <STableHeadCell
                                                         >
                                
                                    Last Interaction
                               
                            </STableHeadCell>

                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {

                            data && data.map((tracker, index) => {
                                return (
                                    <STableRow
                                        key={index}
                                        >
                                        {selectAll ?

                                            <STableCell>
                                                

                                                    <Checkbox size="small"
                                                        checked={Boolean(selectAll)}
                                                    />

                                               
                                            </STableCell>
                                            :
                                            null
                                        }
                                        {!selectAll ?

                                            <STableCell>
                                                
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
                                               
                                            </STableCell>

                                            :
                                            null
                                        }

                                        {user?.bot_access_fields.is_editable &&
                                            <STableCell>
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
                                                            <Tooltip title="Delete Tracker">
                                                                <IconButton color="error"
                                                                    onClick={() => {
                                                                        setTracker(tracker)
                                                                        setChoice({ type: BotChoiceActions.delete_tracker })
                                                                    }}

                                                                >
                                                                    <Delete />
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


                                                     </Stack>  }

                                                />
                                            </STableCell>}
                                        <STableCell>
                                           {tracker.is_active ? "Active" : "Disabled"}
                                        </STableCell>
                                        <STableCell>
                                           {tracker.customer_name || "NA"}
                                        </STableCell>

                                        <STableCell>
                                           {tracker.bot_number.replace("91", "").replace("@c.us", "")}
                                        </STableCell>



                                        <STableCell>
                                           {tracker.phone_number.replace("91", "").replace("@c.us", "")}
                                        </STableCell>


                                        <STableCell>
                                           {tracker.flow.flow_name}
                                        </STableCell>



                                        <STableCell>
                                           {tracker.updated_at && new Date(tracker.updated_at).toLocaleString()}
                                        </STableCell>


                                    </STableRow>
                                )
                            })

                        }
                    </STableBody>
                </STable>
            </Box>
            {
                tracker ?
                    <>
                        <UpdateTrackerDialog tracker={tracker} />
                        <DeleteTrackerDialog tracker={tracker} />
                        <ToogleBotDialog tracker={tracker} />
                    </>
                    : null
            }
        </>
    )
}

export default TrackersSTable