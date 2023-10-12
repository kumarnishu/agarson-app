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
import { AddOutlined, AdsClickOutlined, Delete, Edit,  Start, Stop } from "@mui/icons-material"
import UpdateConnectedUsersDialog from "../../components/dialogs/bot/UpdateConnectedUsersDialog"
import ToogleFlowStatusDialog from "../../components/dialogs/bot/ToogleFlowStatusDialog"
import { IFlow } from "../../types"
import { BackendError } from "../.."
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import ReactPagination from "../../components/pagination/ReactPagination"
import { useBotFields } from "../../components/hooks/BotFieldsHooks"

export default function FlowsPage() {
  const [flows, setFlows] = useState<IFlow[]>()
  const [flow, setFlow] = useState<IFlow>()
  const { setChoice } = useContext(ChoiceContext)
  const { user } = useContext(UserContext)
  const { data, isLoading } = useQuery<AxiosResponse<IFlow[]>, BackendError>("flows", GetFlows)
  const { hiddenFields, readonlyFields } = useBotFields()
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
        {!hiddenFields?.includes('New Flow') &&
          <Button sx={{ m: 1 }} variant="outlined" color="warning"
            onClick={() => setChoice({ type: BotChoiceActions.create_flow })}
            disabled={readonlyFields?.includes('New Flow')}
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
                  Index
                </Stack>
              </TableCell>
              {!hiddenFields?.includes('Flow Status') &&
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
                </TableCell>}
              {!hiddenFields?.includes('Flow Triggers') &&
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
                </TableCell>}
              {!hiddenFields?.includes('Flow Name') &&
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
                </TableCell>}
              {!hiddenFields?.includes('Updated By') &&
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
                </TableCell>}
              {!hiddenFields?.includes('Created By') &&
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
                </TableCell>}
              {!hiddenFields?.includes('Last Updated date') &&
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
                </TableCell>}

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
                                  {!hiddenFields?.includes('Start And Stop') &&
                                    <>
                                      {flow.is_active ?
                                        <Tooltip title="Disable">
                                          <IconButton color="warning"
                                            onClick={() => {
                                              setFlow(flow)
                                              setChoice({ type: BotChoiceActions.toogle_flow_status })
                                              setPopup(null)
                                            }}
                                            disabled={readonlyFields?.includes('Start And Stop')}
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
                                            disabled={readonlyFields?.includes('Start And Stop')}
                                          >
                                            <Start />
                                          </IconButton>
                                        </Tooltip>}
                                    </>
                                  }

                                  {!hiddenFields?.includes('Edit') &&
                                    <Tooltip title="Edit">
                                      <IconButton color="success"
                                        onClick={() => {
                                          setFlow(flow)
                                          setChoice({ type: BotChoiceActions.update_flow })
                                          setPopup(null)
                                        }}
                                        disabled={readonlyFields?.includes('Edit')}
                                      >
                                        <Edit />
                                      </IconButton>
                                    </Tooltip>}

                                  {!hiddenFields?.includes('Delete') &&
                                    <Tooltip title="Delete">
                                      <IconButton color="error"
                                        onClick={() => {
                                          setFlow(flow)
                                          setChoice({ type: BotChoiceActions.delete_flow })
                                          setPopup(null)
                                        }}
                                        disabled={readonlyFields?.includes('Delete')}
                                      >
                                        <Delete />
                                      </IconButton>
                                    </Tooltip>}


                                  {!hiddenFields?.includes('Manage Connections') &&
                                    <Tooltip title="Edit Connected users">
                                      <IconButton color="primary"
                                        onClick={() => {
                                          setChoice({ type: BotChoiceActions.update_connected_users })
                                          setFlow(flow)
                                          setPopup(null)
                                        }}
                                        disabled={readonlyFields?.includes('Manage Connections')}

                                      >
                                        <AdUnitsIcon />
                                      </IconButton>
                                    </Tooltip>}
                                </>
                                :
                                null
                            }
                          </Stack>
                        </Popover>

                      </div>

                    </TableCell>

                    <TableCell>
                      <Typography sx={{ textTransform: "capitalize" }}>{index + 1}</Typography>
                    </TableCell>
                    {
                      !hiddenFields?.includes('Flow Status') &&
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
                    }
                    {
                      !hiddenFields?.includes('Flow Triggers') &&
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{flow.trigger_keywords.slice(0, 50)}</Typography>
                      </TableCell>
                    }
                    {
                      !hiddenFields?.includes('Flow Name') &&
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{flow.flow_name}</Typography>
                      </TableCell>
                    }
                    {
                      !hiddenFields?.includes('Updated By') &&
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{flow.updated_by?.username}</Typography>
                      </TableCell>
                    }
                    {
                      !hiddenFields?.includes('Created By') &&
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{flow.created_by?.username}</Typography>
                      </TableCell>
                    }
                    {
                      !hiddenFields?.includes('Last Updated date') &&
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{flow.updated_at && new Date(flow.updated_at).toLocaleString()}</Typography>
                      </TableCell>
                    }
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>

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
