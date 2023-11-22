import { Comment, Delete, DeleteOutline, Edit, Share, Visibility } from '@mui/icons-material'
import { Box, Checkbox, FormControlLabel, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, LeadChoiceActions } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'
import AddTaskIcon from '@mui/icons-material/AddTask';
import UpdateLeadDialog from '../dialogs/crm/UpdateLeadDialog'
import DeleteLeadDialog from '../dialogs/crm/DeleteLeadDialog'
import ConvertLeadToCustomerDialog from '../dialogs/crm/ConvertLeadToCustomerDialog'
import ViewRemarksDialog from '../dialogs/crm/ViewRemarksDialog'
import NewRemarkDialog from '../dialogs/crm/NewRemarkDialog'
import ReferLeadDialog from '../dialogs/crm/ReferLeadDialog'
import RemoveLeadReferralDialog from '../dialogs/crm/RemoveLeadReferralDialog'
import BackHandIcon from '@mui/icons-material/BackHand';
import { DownloadFile } from '../../utils/DownloadFile'
import PopUp from '../popup/PopUp'
import ToogleUselessLead from '../dialogs/crm/ToogleUselessLead'
import { ILead } from '../../types/crm.types'



type Props = {
  lead: ILead | undefined
  setLead: React.Dispatch<React.SetStateAction<ILead | undefined>>,
  leads: ILead[],
  selectAll: boolean,
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
  selectedLeads: ILead[]
  setSelectedLeads: React.Dispatch<React.SetStateAction<ILead[]>>,
}

function LeadsTable({ lead, leads, setLead, selectAll, setSelectAll, selectedLeads, setSelectedLeads }: Props) {
  const { setChoice } = useContext(ChoiceContext)
  const { user } = useContext(UserContext)
  const [data, setData] = useState<ILead[]>(leads)

  useEffect(() => {
    setData(leads)
  }, [leads])

  return (
    <>
      <Box sx={{
        overflow: "scroll",
        height: '73.5vh'
      }}>
        <Table
          stickyHeader
          sx={{ width: "5000px" }}
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
                      checked={Boolean(selectAll)}
                      size="small" onChange={(e) => {
                        if (e.currentTarget.checked) {
                          setSelectedLeads(leads)
                          setSelectAll(true)
                        }
                        if (!e.currentTarget.checked) {
                          setSelectedLeads([])
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


              {/* visitin card */}
              <TableCell
                sx={{ bgcolor: headColor }}                         >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Visiting Card
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
                  Lead Name
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
                  Stage
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

              {/* alternate mobile 1 */}

              <TableCell
                sx={{ bgcolor: headColor }}                         >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Mobile2
                </Stack>
              </TableCell>

              {/* alternate mobile 2 */}
              <TableCell
                sx={{ bgcolor: headColor }}                         >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Mobile3
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
                  City
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
                  State
                </Stack>
              </TableCell>

              {/* lead type */}
              <TableCell
                sx={{ bgcolor: headColor }}                         >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Lead Type
                </Stack>
              </TableCell>

              {/* lead owners */}

              <TableCell
                sx={{ bgcolor: headColor }}                         >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Lead Owners
                </Stack>
              </TableCell>

              {/* turn over */}

              <TableCell
                sx={{ bgcolor: headColor }}                         >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  TurnOver
                </Stack>
              </TableCell>

              {/* work description */}

              <TableCell
                sx={{ bgcolor: headColor }}                         >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Work Description
                </Stack>
              </TableCell>

              {/* customer name */}
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

              {/* designiaton */}
              <TableCell
                sx={{ bgcolor: headColor }}                         >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Customer Desigination
                </Stack>
              </TableCell>

              {/* last remark */}

              <TableCell
                sx={{ bgcolor: headColor }}                         >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Last Remark
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
                  Refer Party
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
                  Refer Party Mobile
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
                  Refer Date
                </Stack>
              </TableCell>
              {/* mobile */}


              {/* email */}

              <TableCell
                sx={{ bgcolor: headColor }}                         >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Email
                </Stack>
              </TableCell>

              {/* alternate email */}

              <TableCell
                sx={{ bgcolor: headColor }}                         >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Email2
                </Stack>
              </TableCell>

              {/* address */}

              <TableCell
                sx={{ bgcolor: headColor }}                         >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Address
                </Stack>
              </TableCell>



              {/* source */}

              <TableCell
                sx={{ bgcolor: headColor }}                         >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Lead Source
                </Stack>
              </TableCell>

              {/* country */}

              <TableCell
                sx={{ bgcolor: headColor }}                         >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Country
                </Stack>
              </TableCell>

              {/* created at */}

              <TableCell
                sx={{ bgcolor: headColor }}                         >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Created At
                </Stack>
              </TableCell>

              {/* updated at */}

              <TableCell
                sx={{ bgcolor: headColor }}                         >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Updated At
                </Stack>
              </TableCell>

              {/* created by */}

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

              data && data.map((lead, index) => {
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
                              setLead(lead)
                              if (e.target.checked) {
                                setSelectedLeads([...selectedLeads, lead])
                              }
                              if (!e.target.checked) {
                                setSelectedLeads((leads) => leads.filter((item) => {
                                  return item._id !== lead._id
                                }))
                              }
                            }}
                          />
                        </Stack>
                      </TableCell>
                      :
                      null
                    }
                    {/* actions popup */}

                    <TableCell>
                      <PopUp
                        element={
                          <Stack direction="row" spacing={1}>

                            {user?.is_admin && lead.referred_party &&
                              <Tooltip title="Remove Refrerral">
                                <IconButton color="error"
                                  onClick={() => {

                                    setChoice({ type: LeadChoiceActions.remove_referral })
                                    setLead(lead)

                                  }}
                                >
                                  <BackHandIcon />
                                </IconButton>
                              </Tooltip>}
                            {!lead.referred_party &&
                              <Tooltip title="refer">
                                <IconButton color="primary"
                                  onClick={() => {

                                    setChoice({ type: LeadChoiceActions.refer_lead })
                                    setLead(lead)

                                  }}
                                >
                                  <Share />
                                </IconButton>
                              </Tooltip>}

                            {user?.crm_access_fields.is_deletion_allowed && !lead.is_customer &&
                              <Tooltip title="delete">
                                <IconButton color="error"
                                  onClick={() => {
                                    setChoice({ type: LeadChoiceActions.delete_lead })
                                    setLead(lead)

                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            }
                            {!lead.is_customer &&
                              <Tooltip title="Convert to Customer">
                                <IconButton color="secondary"
                                  onClick={() => {

                                    setChoice({ type: LeadChoiceActions.convert_customer })
                                    setLead(lead)
                                  }}
                                >
                                  <AddTaskIcon />
                                </IconButton>
                              </Tooltip>}

                            {
                              user?.is_admin && lead.stage === "useless" &&
                              <Tooltip title="remove from useless">
                                <IconButton color="success"
                                  onClick={() => {

                                    setChoice({ type: LeadChoiceActions.convert_useless })
                                    setLead(lead)
                                  }}

                                >
                                  <DeleteOutline />
                                </IconButton>
                              </Tooltip>}
                            {lead.stage !== "useless" &&
                              <Tooltip title="make useless">
                                <IconButton color="warning"
                                  onClick={() => {

                                    setChoice({ type: LeadChoiceActions.convert_useless })
                                    setLead(lead)
                                  }}

                                >
                                  <DeleteOutline />
                                </IconButton>
                              </Tooltip>}

                            {user?.crm_access_fields.is_editable &&
                              <Tooltip title="edit">
                                <IconButton color="secondary"
                                  onClick={() => {

                                    setChoice({ type: LeadChoiceActions.update_lead })
                                    setLead(lead)
                                  }}

                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>}


                            <Tooltip title="view remarks">
                              <IconButton color="primary"
                                onClick={() => {

                                  setChoice({ type: LeadChoiceActions.view_remarks })
                                  setLead(lead)


                                }}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Add Remark">
                              <IconButton
                                color="success"
                                onClick={() => {

                                  setChoice({ type: LeadChoiceActions.add_remark })
                                  setLead(lead)

                                }}
                              >
                                <Comment />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        }
                      />
                    </TableCell>
                    {/* visitin card */}
                    {
                      <TableCell
                        title="double click to download"
                        onDoubleClick={() => {
                          if (lead.visiting_card && lead.visiting_card?.public_url) {
                            DownloadFile(lead.visiting_card.public_url, lead.visiting_card.filename)
                          }
                        }}>
                        <img height="50" width="75" src={lead.visiting_card && lead.visiting_card.public_url} alt="visiting card" />
                      </TableCell>

                    }

                    {/* lead name */}
                    {
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.name}</Typography>
                      </TableCell>

                    }
                    {/* stage */}
                    {
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.stage}</Typography>
                      </TableCell>

                    }
                    {
                      <TableCell>
                        <Stack>
                          <Typography variant="body1"  >{lead.mobile}</Typography>
                        </Stack>
                      </TableCell>

                    }
                    {/* alternate mobile 1 */}
                    {
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.alternate_mobile1}</Typography>
                      </TableCell>

                    }
                    {/* alternate mobile 2 */}
                    {
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.alternate_mobile2}</Typography>
                      </TableCell>

                    }

                    {/* city */}
                    {
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.city}</Typography>
                      </TableCell>

                    }
                    {/* state */}
                    {
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.state}</Typography>
                      </TableCell>

                    }
                    {/* lead type */}
                    {
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.lead_type}</Typography>
                      </TableCell>

                    }
                    {/* lead owners */}
                    {
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.lead_owners ? lead.lead_owners.map((owner) => { return owner.username + ", " }) : [""]}</Typography>
                      </TableCell>

                    }
                    {/* turn over */}
                    {
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.turnover ? lead.turnover : 'na'}</Typography>
                      </TableCell>

                    }
                    {/* work description */}
                    {
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.work_description ? lead.work_description.slice(0, 50) : ""}</Typography>
                      </TableCell>

                    }
                    {/* customer name */}
                    {
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.customer_name}</Typography>
                      </TableCell>

                    }
                    {/* designiaton */}
                    {
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.customer_designation}</Typography>
                      </TableCell>

                    }
                    {/* last remark */}
                    {
                      <TableCell>
                        {lead.remarks ?
                          <Typography sx={{ textTransform: "capitalize" }}> {lead.last_remark && lead.last_remark.slice(0, 50)}
                          </Typography> : null
                        }
                      </TableCell>

                    }

                    <TableCell>
                      {lead.referred_party_name ?
                        <Typography sx={{ textTransform: "capitalize" }}> {lead.referred_party_name && lead.referred_party_name}
                        </Typography> : null
                      }
                    </TableCell>
                    <TableCell>
                      {lead.referred_party_mobile ?
                        <Typography sx={{ textTransform: "capitalize" }}> {lead.referred_party_mobile && lead.referred_party_mobile}
                        </Typography> : null
                      }
                    </TableCell>


                    <TableCell>
                      {lead.referred_date ?
                        <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(lead.referred_date).toLocaleString()}</Typography> : null
                      }
                    </TableCell>


                    {/* email */}
                    {
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }} variant="body1">{lead.email}</Typography>
                      </TableCell>

                    }
                    {/* alternate email */}
                    {
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }} variant="body1">{lead.alternate_email}</Typography>
                      </TableCell>

                    }
                    {/* address */}
                    {
                      <TableCell>
                        <Stack>
                          <Typography sx={{ textTransform: "capitalize" }} variant="body1">{lead.address ? lead.address.slice(0, 50) : "..."}</Typography>
                        </Stack>
                      </TableCell>

                    }


                    {/* source */}
                    {
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }} variant="body1">{lead.lead_source}</Typography>

                      </TableCell>

                    }
                    {/* country */}
                    {
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }} variant="body1">{lead.country}</Typography>

                      </TableCell>

                    }
                    {/* created at */}
                    {
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(lead.created_at).toLocaleString()}</Typography>

                      </TableCell>

                    }
                    {/* updated at */}
                    {
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(lead.updated_at).toLocaleString()}</Typography>

                      </TableCell>

                    }
                    {/* created by */}
                    {
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }} variant="body1">{lead.created_by.username}</Typography>

                      </TableCell>

                    }
                    {/* updated by */}
                    {
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }} variant="body1">{lead.updated_by.username}</Typography>

                      </TableCell>

                    }
                  </TableRow>
                )
              })

            }
          </TableBody>
        </Table>
      </Box >
      {
        lead ?
          <>
            < UpdateLeadDialog lead={lead} />
            <DeleteLeadDialog lead={lead} />
            <ConvertLeadToCustomerDialog lead={lead} />
            <ViewRemarksDialog lead={lead} />
            <NewRemarkDialog lead={lead} />
            <ReferLeadDialog lead={lead} />
            <RemoveLeadReferralDialog lead={lead} />
            <ToogleUselessLead lead={lead} />
          </>
          : null
      }
    </>
  )
}

export default LeadsTable