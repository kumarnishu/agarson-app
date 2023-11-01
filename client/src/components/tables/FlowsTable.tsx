import { Box, Button, Checkbox, FormControlLabel, IconButton, Popover, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
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
                <Table
                    stickyHeader
                    sx={{ minWidth: "1350px", maxHeight: '70vh' }}
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
                                                    setSelectedFlows(flows)
                                                    setSelectAll(true)
                                                }
                                                if (!e.currentTarget.checked) {
                                                    setSelectedFlows([])
                                                    setSelectAll(false)
                                                }
                                            }} />}
                                        label=""
                                    />
                                </Stack>
                            </TableCell>
                            {!user?.bot_access_fields.is_readonly && user?.bot_access_fields.is_editable &&
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
                                </TableCell>}
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
                                    Triggers
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
                                    Flow Name
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
                                    Last Updated
                                </Stack>
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {
                            data && data.map((flow, index) => {
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
                                                </Stack>
                                            </TableCell>
                                            :
                                            null
                                        }

                                        {/* actions */}
                                        {!user?.bot_access_fields.is_readonly && user?.bot_access_fields.is_editable &&
                                            <TableCell>
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

                                            </TableCell >}


                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{flow.is_active ? "active" : "disabled"}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{flow.trigger_keywords.slice(0, 50)}</Typography>
                                        </TableCell>


                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{flow.flow_name}</Typography>
                                        </TableCell>


                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{flow.updated_by?.username}</Typography>
                                        </TableCell>


                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{flow.created_by?.username}</Typography>
                                        </TableCell>


                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{flow.updated_at && new Date(flow.updated_at).toLocaleString()}</Typography>
                                        </TableCell>




                                    </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>
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