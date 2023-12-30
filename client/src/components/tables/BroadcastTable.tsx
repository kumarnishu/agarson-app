import { Block, Delete, Edit, Pause, RemoveRedEye,  RestartAlt, Stop } from '@mui/icons-material'
import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
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
import { IBroadcast } from '../../types/broadcast.types'
import { UserContext } from '../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'


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
                maxHeight: '80vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>
                            <STableHeadCell>

                               
                                    <Checkbox
                                        indeterminate={selectAll ? true : false}
                                        checked={Boolean(selectAll)}
                                        size="small" onChange={(e) => {
                                            if (e.currentTarget.checked) {
                                                setSelectedBroadcasts(broadcasts)
                                                setSelectAll(true)
                                            }
                                            if (!e.currentTarget.checked) {
                                                setSelectedBroadcasts([])
                                                setSelectAll(false)
                                            }
                                        }} />

                            </STableHeadCell>
                            {user?.broadcast_access_fields.is_editable &&
                                <STableHeadCell
                                >
                                   
                                        Actions

                                </STableHeadCell>}
                            <STableHeadCell
                            >

                                Broadcast Name

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Status

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Time Gap

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Start Time

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Next Run Date

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Using Leads

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Type

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Daily Limit

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Daily Counter

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Auto Refresh

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Random Templates

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Connected Number

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Status Updated

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
                            broadcasts && broadcasts.map((broadcast, index) => {
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

                                            </STableCell>
                                            :
                                            null
                                        }
                                        {/* actions */}
                                        {user?.broadcast_access_fields.is_editable &&
                                            <STableCell>
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
                                                            disabled={Boolean(broadcast.is_active)}
                                                            onClick={() => {

                                                                setChoice({ type: BroadcastChoiceActions.reset_broadcast })
                                                                setBroadcast(broadcast)
                                                            }}>
                                                            <Block />
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
                                            </STableCell>}
                                        <STableCell>
                                            {broadcast.name}
                                        </STableCell>
                                        <STableCell>
                                            {broadcast.is_active ?
                                                <>
                                                    {broadcast.is_paused ? <Pause />
                                                        : <Stop />} </> :
                                                "stopped"
                                            }
                                        </STableCell>
                                        <STableCell>
                                            {broadcast.time_gap + " seconds"}
                                        </STableCell>
                                        <STableCell>
                                            {broadcast.created_at && new Date(broadcast.start_date).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {new Date(broadcast.next_run_date).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {broadcast.leads_selected ? "Yes" : "No"}
                                        </STableCell>
                                        <STableCell>
                                            {broadcast.message ? "custom" : "template"}
                                        </STableCell>

                                        <STableCell>
                                            {broadcast.daily_limit ? broadcast.daily_limit : "No"}
                                        </STableCell>
                                        <STableCell>
                                            {broadcast.daily_count && broadcast.daily_count}
                                        </STableCell>
                                        <STableCell>
                                            {broadcast.autoRefresh ? "Yes" : "Not Set"}
                                        </STableCell>

                                        <STableCell>
                                            {broadcast.is_random_template ? "Yes" : "No"}
                                        </STableCell>
                                        <STableCell>
                                            {broadcast.connected_number && broadcast.connected_number.toString().replace("91", "").replace("@c.us", "")}
                                        </STableCell>

                                        <STableCell>
                                            {broadcast.updated_at && new Date(broadcast.updated_at).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {broadcast.created_by.username}
                                        </STableCell>
                                        <STableCell>
                                            {broadcast.updated_by.username}
                                        </STableCell>

                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>
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
                           
                        </> : null
                }
            </Box >
        </>
    )
}

export default BroadcastsTable