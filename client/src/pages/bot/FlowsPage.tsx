import { useQuery } from "react-query"
import { GetFlows } from "../../services/BotServices"
import { AxiosResponse } from "axios"
import { useEffect, useContext, useState } from "react"
import { BotChoiceActions, ChoiceContext } from "../../contexts/dialogContext"
import { UserContext } from "../../contexts/userContext"
import { Box, Button, IconButton, Popover, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from "@mui/material"
import UpdateFlowDialog from "../../components/dialogs/bot/UpdateFlowDialog"
import CreateFlowDialog from "../../components/dialogs/bot/CreateFlowDialog"
import DeleteFlowDialog from "../../components/dialogs/bot/DeleteFlowDialog"
import { color1, color2, headColor } from "../../utils/colors"
import { AddOutlined, AdsClickOutlined, Delete, Edit, Start, Stop } from "@mui/icons-material"
import UpdateConnectedUsersDialog from "../../components/dialogs/bot/UpdateConnectedUsersDialog"
import ToogleFlowStatusDialog from "../../components/dialogs/bot/ToogleFlowStatusDialog"
import { BackendError } from "../.."
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import ReactPagination from "../../components/pagination/ReactPagination"
import { IFlow } from "../../types/bot.types"

export default function FlowsPage() {
  const [flows, setFlows] = useState<IFlow[]>()
  const [flow, setFlow] = useState<IFlow>()
  const { setChoice } = useContext(ChoiceContext)
  const { user } = useContext(UserContext)
  const { data, isLoading } = useQuery<AxiosResponse<IFlow[]>, BackendError>("flows", GetFlows)
  const [popup, setPopup] = useState<HTMLButtonElement | null>(null);
  // pagination  states
  const [reactPaginationData, setReactPaginationData] = useState({ limit: 10, page: 1, total: 1 });
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + reactPaginationData.limit;
  const currentItems = flows?.slice(itemOffset, endOffset)


  useEffect(() => {
    if (data)
      setFlows(data.data)
    if (data?.data)
      setReactPaginationData({
        ...reactPaginationData,
        total: Math.ceil(data.data.length / reactPaginationData.limit)
      })
  }, [data])

  useEffect(() => {
    setItemOffset(reactPaginationData.page * reactPaginationData.limit % reactPaginationData.total)
  }, [reactPaginationData])

  return (
    <>
      <Box sx={{
        overflow: "scroll",
        maxHeight: '70vh'
      }}>
        {!user?.bot_access_fields.is_readonly && user?.bot_access_fields.is_editable &&
          <Button sx={{ m: 1 }} variant="outlined" color="warning"
            onClick={() => setChoice({ type: BotChoiceActions.create_flow })}

          >
            <Stack direction="row" alignItems="center" gap={1}>
              <AddOutlined />
              <span> New Flow</span>
            </Stack>
          </Button>}

        <Table
          stickyHeader
          sx={{ minWidth: "1400px" }}
          size="small">
          <TableHead
          >
            <TableRow>
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
                  Index
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
              currentItems && currentItems.length > 0 && currentItems.map((flow, index) => {
                return (
                  <TableRow
                    key={index}
                    sx={{
                      '&:nth-of-type(odd)': { bgcolor: color1 },
                      '&:nth-of-type(even)': { bgcolor: color2 },
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer' }
                    }}>

                    {/* actions */}
                    {!user?.bot_access_fields.is_readonly && user?.bot_access_fields.is_editable &&
                      <TableCell>
                        <div>
                          <Button onClick={(e) => setPopup(e.currentTarget)}>
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
                              {
                                user?.is_admin ?
                                  <>
                                    {flow.is_active ?
                                      <Tooltip title="Disable">
                                        <IconButton color="warning"
                                          onClick={() => {
                                            setFlow(flow)
                                            setChoice({ type: BotChoiceActions.toogle_flow_status })
                                            setPopup(null)
                                          }}
                                        >
                                          <Stop />
                                        </IconButton>
                                      </Tooltip>
                                      : <Tooltip title="Enable">
                                        <IconButton color="warning"
                                          onClick={() => {
                                            setFlow(flow)
                                            setChoice({ type: BotChoiceActions.toogle_flow_status })
                                            setPopup(null)
                                          }}
                                        >
                                          <Start />
                                        </IconButton>
                                      </Tooltip>}
                                  </>
                                  : null
                              }

                              <Tooltip title="Edit">
                                <IconButton color="success"
                                  onClick={() => {
                                    setFlow(flow)
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
                                      setFlow(flow)
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
                                    setFlow(flow)
                                    setPopup(null)
                                  }}
                                >
                                  <AdUnitsIcon />
                                </IconButton>
                              </Tooltip>

                            </Stack>
                          </Popover>

                        </div>

                      </TableCell >}

                    <TableCell>
                      <Typography sx={{ textTransform: "capitalize" }}>{index + 1}</Typography>
                    </TableCell>
                    <>

                      {
                        isLoading ? <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }}>Loading..</Typography>
                        </TableCell> :
                          <TableCell>
                            <Typography sx={{ textTransform: "capitalize" }}>{flow.is_active ? "active" : "disabled"}</Typography>
                          </TableCell>

                      }
                    </>

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

                  </TableRow >
                )
              })}
          </TableBody >
        </Table >

      </Box >
      {flow ? <UpdateFlowDialog selectedFlow={flow} /> : null
      }
      <CreateFlowDialog />
      {flow ? <DeleteFlowDialog flow={flow} /> : null}
      {flow ? <UpdateConnectedUsersDialog selectedFlow={flow} /> : null}
      {flow ? <ToogleFlowStatusDialog flow={flow} /> : null}
      {currentItems && <ReactPagination reactPaginationData={reactPaginationData} setReactPaginationData={setReactPaginationData} data={currentItems} />}
    </>
  )
}
