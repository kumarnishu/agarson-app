import { Comment, Delete, DeleteOutline, Edit, Share, Visibility } from '@mui/icons-material'
import { Box, Checkbox, FormControlLabel, IconButton, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
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
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'


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
        <STable>
          <STableHead style={{
           
          }}>
            <STableRow>
              <STableHeadCell
              >
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
              </STableHeadCell>

              {/* actions popup */}
              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Actions
                </Stack>
              </STableHeadCell>

              {/* visitin card */}
              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Visiting Card
                </Stack>
              </STableHeadCell>


              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Lead Name
                </Stack>
              </STableHeadCell>


              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  City
                </Stack>
              </STableHeadCell>

              {/* state */}

              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  State
                </Stack>
              </STableHeadCell>

              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Stage
                </Stack>
              </STableHeadCell>

              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Mobile
                </Stack>
              </STableHeadCell>

              {/* alternate mobile 1 */}

              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Mobile2
                </Stack>
              </STableHeadCell>

              {/* alternate mobile 2 */}
              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Mobile3
                </Stack>
              </STableHeadCell>





              {/* lead type */}
              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Lead Type
                </Stack>
              </STableHeadCell>

              {/* lead owners */}

              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Lead Owners
                </Stack>
              </STableHeadCell>

              {/* turn over */}

              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  TurnOver
                </Stack>
              </STableHeadCell>

              {/* work description */}

              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Work Description
                </Stack>
              </STableHeadCell>

              {/* customer name */}
              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Customer Name
                </Stack>
              </STableHeadCell>

              {/* designiaton */}
              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Customer Desigination
                </Stack>
              </STableHeadCell>

              {/* last remark */}

              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Last Remark
                </Stack>
              </STableHeadCell>


              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Refer Party
                </Stack>
              </STableHeadCell>

              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Refer Party Mobile
                </Stack>
              </STableHeadCell>

              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Refer Date
                </Stack>
              </STableHeadCell>
              {/* mobile */}


              {/* email */}

              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Email
                </Stack>
              </STableHeadCell>

              {/* alternate email */}

              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Email2
                </Stack>
              </STableHeadCell>

              {/* address */}

              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Address
                </Stack>
              </STableHeadCell>



              {/* source */}

              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Lead Source
                </Stack>
              </STableHeadCell>

              {/* country */}

              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Country
                </Stack>
              </STableHeadCell>

              {/* created at */}

              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Created At
                </Stack>
              </STableHeadCell>

              {/* updated at */}

              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Updated At
                </Stack>
              </STableHeadCell>

              {/* created by */}

              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Created By
                </Stack>
              </STableHeadCell>

              <STableHeadCell
              >
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="left"
                  spacing={2}
                >
                  Updated By
                </Stack>
              </STableHeadCell>
            </STableRow>
          </STableHead>
          <STableBody >
            {

              data && data.map((lead, index) => {
                return (
                  <STableRow
                    key={index}>
                    {selectAll ?

                      <STableCell>
                        <Stack direction="row"
                          spacing={2}
                          justifyContent="left"
                          alignItems="center"
                        >

                          <Checkbox size="small"
                            checked={Boolean(selectAll)}
                          />

                        </Stack>
                      </STableCell>
                      :
                      null
                    }
                    {!selectAll ?

                      <STableCell>
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
                      </STableCell>
                      :
                      null
                    }
                    {/* actions popup */}

                    <STableCell style={{ zIndex: -1 }}>
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
                    </STableCell>
                    {/* visitin card */}
                    {
                      <STableCell
                        title="double click to download"
                        onDoubleClick={() => {
                          if (lead.visiting_card && lead.visiting_card?.public_url) {
                            DownloadFile(lead.visiting_card.public_url, lead.visiting_card.filename)
                          }
                        }}>
                        <img height="50" width="75" src={lead.visiting_card && lead.visiting_card.public_url} alt="visiting card" />
                      </STableCell>

                    }

                    {/* lead name */}
                    {
                      <STableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.name}</Typography>
                      </STableCell>

                    }
                    {/* city */}
                    {
                      <STableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.city}</Typography>
                      </STableCell>

                    }
                    {/* state */}
                    {
                      <STableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.state}</Typography>
                      </STableCell>

                    }
                    {/* stage */}
                    {
                      <STableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.stage}</Typography>
                      </STableCell>

                    }
                    {
                      <STableCell>
                        <Stack>
                          <Typography variant="body1"  >{lead.mobile}</Typography>
                        </Stack>
                      </STableCell>

                    }
                    {/* alternate mobile 1 */}
                    {
                      <STableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.alternate_mobile1}</Typography>
                      </STableCell>

                    }
                    {/* alternate mobile 2 */}
                    {
                      <STableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.alternate_mobile2}</Typography>
                      </STableCell>

                    }


                    {/* lead type */}
                    {
                      <STableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.lead_type}</Typography>
                      </STableCell>

                    }
                    {/* lead owners */}
                    {
                      <STableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.lead_owners ? lead.lead_owners.map((owner) => { return owner.username + " & " }) : [""]}</Typography>
                      </STableCell>

                    }
                    {/* turn over */}
                    {
                      <STableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.turnover ? lead.turnover : 'na'}</Typography>
                      </STableCell>

                    }
                    {/* work description */}
                    {
                      <STableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.work_description ? lead.work_description.slice(0, 50) : ""}</Typography>
                      </STableCell>

                    }
                    {/* customer name */}
                    {
                      <STableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.customer_name}</Typography>
                      </STableCell>

                    }
                    {/* designiaton */}
                    {
                      <STableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{lead.customer_designation}</Typography>
                      </STableCell>

                    }
                    {/* last remark */}
                    {
                      <STableCell>
                        {lead.remarks ?
                          <Typography title={lead.last_remark && lead.last_remark} sx={{ textTransform: "capitalize" }}> {lead.last_remark && lead.last_remark.slice(0, 50)}
                          </Typography> : null
                        }
                      </STableCell>
                    }

                    <STableCell>
                      {lead.referred_party_name ?
                        <Typography sx={{ textTransform: "capitalize" }}> {lead.referred_party_name && lead.referred_party_name}
                        </Typography> : null
                      }
                    </STableCell>
                    <STableCell>
                      {lead.referred_party_mobile ?
                        <Typography sx={{ textTransform: "capitalize" }}> {lead.referred_party_mobile && lead.referred_party_mobile}
                        </Typography> : null
                      }
                    </STableCell>


                    <STableCell>
                      {lead.referred_date ?
                        <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(lead.referred_date).toLocaleString()}</Typography> : null
                      }
                    </STableCell>


                    {/* email */}
                    {
                      <STableCell>
                        <Typography sx={{ textTransform: "capitalize" }} variant="body1">{lead.email}</Typography>
                      </STableCell>

                    }
                    {/* alternate email */}
                    {
                      <STableCell>
                        <Typography sx={{ textTransform: "capitalize" }} variant="body1">{lead.alternate_email}</Typography>
                      </STableCell>

                    }
                    {/* address */}
                    {

                      <STableCell >
                        <Tooltip title={lead.address}>
                          <Stack>
                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{lead.address ? lead.address.slice(0, 50) : "..."}</Typography>
                          </Stack>
                        </Tooltip>
                      </STableCell>


                    }


                    {/* source */}
                    {
                      <STableCell>
                        <Typography sx={{ textTransform: "capitalize" }} variant="body1">{lead.lead_source}</Typography>

                      </STableCell>

                    }
                    {/* country */}
                    {
                      <STableCell>
                        <Typography sx={{ textTransform: "capitalize" }} variant="body1">{lead.country}</Typography>

                      </STableCell>

                    }
                    {/* created at */}
                    {
                      <STableCell>
                        <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(lead.created_at).toLocaleString()}</Typography>

                      </STableCell>

                    }
                    {/* updated at */}
                    {
                      <STableCell>
                        <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(lead.updated_at).toLocaleString()}</Typography>

                      </STableCell>

                    }
                    {/* created by */}
                    {
                      <STableCell>
                        <Typography sx={{ textTransform: "capitalize" }} variant="body1">{lead.created_by.username}</Typography>

                      </STableCell>

                    }
                    {/* updated by */}
                    {
                      <STableCell>
                        <Typography sx={{ textTransform: "capitalize" }} variant="body1">{lead.updated_by.username}</Typography>

                      </STableCell>

                    }
                  </STableRow>
                )
              })

            }
          </STableBody>
        </STable>
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