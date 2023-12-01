import { Box, Button, Checkbox, IconButton, Popover, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { BotChoiceActions, ChoiceContext } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'
import { IFlow } from '../../types/bot.types'
import UpdateFlowDialog from '../dialogs/bot/UpdateFlowDialog'
import DeleteFlowDialog from '../dialogs/bot/DeleteFlowDialog'
import UpdateConnectedUsersDialog from '../dialogs/bot/UpdateConnectedUsersDialog'
import ToogleFlowStatusDialog from '../dialogs/bot/ToogleFlowStatusDialog'
import { AdsClickOutlined, Delete, Edit, RestartAlt } from '@mui/icons-material'
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'

type Props = {
    flow: IFlow | undefined,
    setFlow: React.Dispatch<React.SetStateAction<IFlow | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    flows: IFlow[],
    selectedFlows: IFlow[]
    setSelectedFlows: React.Dispatch<React.SetStateAction<IFlow[]>>,
}

function FlowsTable({ flow, selectAll, flows, setSelectAll, setFlow, selectedFlows, setSelectedFlows }: Props) {
    const { setChoice } = useContext(ChoiceContext)
    const [data, setData] = useState<IFlow[]>(flows)
    const { user } = useContext(UserContext)
    const [popup, setPopup] = useState<HTMLButtonElement | null>(null);

    useEffect(() => {
        setData(flows)
    }, [flows])
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

                                
                                    <Checkbox
                                        indeterminate={selectAll ? true : false}
                                        checked={Boolean(selectAll)}
                                        size="small" onChange={(e) => {
                                            if (e.currentTarget.checked) {
                                                setSelectedFlows(flows)
                                                setSelectAll(true)
                                            }
                                            if (!e.currentTarget.checked) {
                                                setSelectedFlows([])
                                                setSelectAll(false)
                                            }
                                        }} />

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

                                Triggers

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Flow Name

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Updated By

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Created By

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Last Updated

                            </STableHeadCell>

                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {
                            data && data.map((flow, index) => {
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

                                                            if (e.target.checked) {
                                                                setSelectedFlows([...selectedFlows, flow])
                                                            }
                                                            if (!e.target.checked) {
                                                                setSelectedFlows((flows) => flows.filter((item) => {
                                                                    return item._id !== flow._id
                                                                }))
                                                            }
                                                            setFlow(flow)
                                                        }
                                                        }
                                                    />

                                            </STableCell>
                                            :
                                            null
                                        }

                                        {/* actions */}
                                        {user?.bot_access_fields.is_editable &&
                                            <STableCell>
                                                <Button onClick={(e) => {
                                                    setPopup(e.currentTarget)
                                                    setFlow(flow)
                                                }
                                                }>
                                                    <AdsClickOutlined />
                                                </Button>
                                                <Popover
                                                    open={Boolean(popup)}
                                                    anchorEl={popup}
                                                    onClose={() => setPopup(null)}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    }}
                                                >
                                                    <Stack direction="row">
                                                        <Tooltip title="Toogle Status">
                                                            <IconButton color="warning"
                                                                onClick={() => {
                                                                    setChoice({ type: BotChoiceActions.toogle_flow_status })
                                                                    setPopup(null)
                                                                }}
                                                            >
                                                                <RestartAlt />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Edit">
                                                            <IconButton color="success"
                                                                onClick={() => {
                                                                    setChoice({ type: BotChoiceActions.update_flow })
                                                                    setPopup(null)

                                                                }}
                                                            >
                                                                <Edit />
                                                            </IconButton>
                                                        </Tooltip>

                                                        {user.bot_access_fields.is_deletion_allowed &&
                                                            <Tooltip title="Delete">
                                                                <IconButton color="error"
                                                                    onClick={() => {
                                                                        setChoice({ type: BotChoiceActions.delete_flow })
                                                                        setPopup(null)

                                                                    }}

                                                                >
                                                                    <Delete />
                                                                </IconButton>
                                                            </Tooltip>}


                                                        <Tooltip title="Edit Connected users">
                                                            <IconButton color="primary"
                                                                onClick={() => {
                                                                    setChoice({ type: BotChoiceActions.update_connected_users })
                                                                    setPopup(null)

                                                                }}
                                                            >
                                                                <AdUnitsIcon />
                                                            </IconButton>
                                                        </Tooltip>

                                                    </Stack>
                                                </Popover>

                                            </STableCell >}


                                        <STableCell>
                                            {flow.is_active ? "active" : "disabled"}
                                        </STableCell>

                                        <STableCell>
                                            {flow.trigger_keywords.slice(0, 50)}
                                        </STableCell>


                                        <STableCell>
                                            {flow.flow_name}
                                        </STableCell>


                                        <STableCell>
                                            {flow.updated_by?.username}
                                        </STableCell>


                                        <STableCell>
                                            {flow.created_by?.username}
                                        </STableCell>


                                        <STableCell>
                                            {flow.updated_at && new Date(flow.updated_at).toLocaleString()}
                                        </STableCell>




                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>
                {flow ? <UpdateFlowDialog selectedFlow={flow} /> : null
                }
                {flow ? <DeleteFlowDialog flow={flow} /> : null}
                {flow ? <UpdateConnectedUsersDialog selectedFlow={flow} /> : null}
                {flow ? <ToogleFlowStatusDialog flow={flow} /> : null}
            </Box >

        </>
    )
}

export default FlowsTable