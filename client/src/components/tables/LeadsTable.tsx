import { Comment, Delete, DeleteOutline, Edit, Share, Visibility } from '@mui/icons-material'
import { Box, Checkbox, FormControlLabel, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
import { ILead } from '../../types'
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
import { useCrmFields } from '../hooks/CrmFieldsHook'



type Props = {
  lead: ILead | undefined
  setLead: React.Dispatch<React.SetStateAction<ILead | undefined>>,
  leads: ILead[],
  selectAll: boolean,
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
  selectedLeads: ILead[]
  setSelectedLeads: React.Dispatch<React.SetStateAction<ILead[]>>,
  selectableLeads: ILead[]
}

function LeadsTable({ lead, leads, selectableLeads, setLead, selectAll, setSelectAll, selectedLeads, setSelectedLeads }: Props) {
  const { setChoice } = useContext(ChoiceContext)
  const { user } = useContext(UserContext)
  const [data, setData] = useState<ILead[]>(leads)
  const { hiddenFields, readonlyFields } = useCrmFields()

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
                      size="small" onChange={(e) => {
                        if (e.currentTarget.checked) {
                          setSelectedLeads(selectableLeads)
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
              {!hiddenFields?.includes('Vsting Card') ?
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
                :
                null}

              {!hiddenFields?.includes('Lead Name') ?
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
                :
                null}


              {/* stage */}
              {!hiddenFields?.includes('Stage') ?
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
                :
                null}
              {!hiddenFields?.includes('Mobile1') ?
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
                :
                null}
              {/* alternate mobile 1 */}
              {!hiddenFields?.includes('Mobile2') ?
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
                :
                null}
              {/* alternate mobile 2 */}
              {!hiddenFields?.includes('Mobile3') ?
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
                :
                null}

              {/* city */}
              {!hiddenFields?.includes('City') ?
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
                :
                null}
              {/* state */}
              {!hiddenFields?.includes('State') ?
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
                :
                null}
              {/* lead type */}
              {!hiddenFields?.includes('Lead Type') ?
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
                :
                null}
              {/* lead owners */}
              {!hiddenFields?.includes('Lead Owners') ?
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
                :
                null}
              {/* turn over */}
              {!hiddenFields?.includes('Turn Over') ?
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
                :
                null}
              {/* work description */}
              {!hiddenFields?.includes('Work Description') ?
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
                :
                null}
              {/* customer name */}
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
              {/* designiaton */}
              {!hiddenFields?.includes('Customer Desigination') ?
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
                :
                null}
              {/* last remark */}
              {!hiddenFields?.includes('Last Remark') ?
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
                :
                null}
              {/* mobile */}


              {/* email */}
              {!hiddenFields?.includes('Email') ?
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
                :
                null}
              {/* alternate email */}
              {!hiddenFields?.includes('Email2') ?
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
                :
                null}
              {/* address */}
              {!hiddenFields?.includes('Address') ?
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
                :
                null}


              {/* source */}
              {!hiddenFields?.includes('Lead Source') ?
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
                :
                null}
              {/* country */}
              {!hiddenFields?.includes('Country') ?
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
                :
                null}
              {/* created at */}
              {!hiddenFields?.includes('Created At') ?
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
                :
                null}
              {/* updated at */}
              {!hiddenFields?.includes('Updated At') ?
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
                :
                null}
              {/* created by */}
              {!hiddenFields?.includes('Created By') ?
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
                :
                null}
              {/* updated by */}
              {!hiddenFields?.includes('Updated By') ?
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
                :
                null}

              {/* last whatsapp */}
              {!hiddenFields?.includes('Last Whatsapp') ?
                <TableCell
                  sx={{ bgcolor: headColor }}                         >
                  <Stack
                    direction="row"
                    justifyContent="left"
                    alignItems="left"
                    spacing={2}
                  >
                    Last Whatsapp
                  </Stack>
                </TableCell>
                :
                null}

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
                            {
                              user?.is_admin ?
                                <>
                                  {lead.referred_party ?
                                    <Tooltip title="Remove Refrerral">
                                      <IconButton color="error"
                                        onClick={() => {

                                          setChoice({ type: LeadChoiceActions.remove_referral })
                                          setLead(lead)

                                        }}
                                      >
                                        <BackHandIcon />
                                      </IconButton>
                                    </Tooltip> :
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

                                  {
                                    !hiddenFields?.includes('Delete Lead') && <Tooltip title="delete">
                                      <IconButton color="error"
                                        onClick={() => {

                                          setChoice({ type: LeadChoiceActions.delete_lead })
                                          setLead(lead)

                                        }}
                                        disabled={readonlyFields?.includes('Delete Lead')}
                                      >
                                        <Delete />
                                      </IconButton>
                                    </Tooltip>
                                  }
                                  {
                                    !hiddenFields?.includes('Convert To Customer') &&
                                    <Tooltip title="Convert to Customer">
                                      <IconButton color="secondary"
                                        onClick={() => {

                                          setChoice({ type: LeadChoiceActions.convert_customer })
                                          setLead(lead)
                                        }}
                                        disabled={readonlyFields?.includes('Convert To Customer')}
                                      >
                                        <AddTaskIcon />
                                      </IconButton>
                                    </Tooltip>
                                  }
                                  {
                                    lead.stage === "useless" ?
                                      <Tooltip title="remove from useless">
                                        <IconButton color="success"
                                          onClick={() => {

                                            setChoice({ type: LeadChoiceActions.convert_useless })
                                            setLead(lead)
                                          }}

                                        >
                                          <DeleteOutline />
                                        </IconButton>
                                      </Tooltip> :
                                      <Tooltip title="make useless">
                                        <IconButton color="warning"
                                          onClick={() => {

                                            setChoice({ type: LeadChoiceActions.convert_useless })
                                            setLead(lead)
                                          }}

                                        >
                                          <DeleteOutline />
                                        </IconButton>
                                      </Tooltip>
                                  }

                                  {
                                    !hiddenFields?.includes('Edit Lead') &&
                                    <Tooltip title="edit">
                                      <IconButton color="secondary"
                                        onClick={() => {

                                          setChoice({ type: LeadChoiceActions.update_lead })
                                          setLead(lead)
                                        }}
                                        disabled={readonlyFields?.includes('Edit Lead')}

                                      >
                                        <Edit />
                                      </IconButton>
                                    </Tooltip>}
                                </>
                                :
                                null
                            }
                            {
                              !hiddenFields?.includes('View Remarks') &&
                              <Tooltip title="view remarks">
                                <IconButton color="primary"
                                  onClick={() => {

                                    setChoice({ type: LeadChoiceActions.view_remarks })
                                    setLead(lead)


                                  }}
                                  disabled={readonlyFields?.includes('View Remarks')}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>}
                            {
                              !hiddenFields?.includes('Add Remark') &&
                              <Tooltip title="Add Remark">
                                <IconButton
                                  color="success"
                                  onClick={() => {

                                    setChoice({ type: LeadChoiceActions.update_remark })
                                    setLead(lead)

                                  }}
                                  disabled={readonlyFields?.includes('Add Remark')}
                                >
                                  <Comment />
                                </IconButton>
                              </Tooltip>}
                          </Stack>
                        }
                      />
                    </TableCell>
                    {/* visitin card */}
                    {
                      !hiddenFields?.includes('Vsting Card') ?
                        <TableCell 
                          title="double click to download"
                        onDoubleClick={() => {
                          if (lead.visiting_card && lead.visiting_card?.public_url) {
                            DownloadFile(lead.visiting_card.public_url, lead.visiting_card.filename)
                          }
                        }}>
                          <img height="50" width="75" src={lead.visiting_card && lead.visiting_card.public_url} alt="visiting card" />
                        </TableCell>
                        :
                        null
                    }

                    {/* lead name */}
                    {
                      !hiddenFields?.includes('Lead Name') ?
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }}>{lead.name}</Typography>
                        </TableCell>
                        :
                        null
                    }
                    {/* stage */}
                    {
                      !hiddenFields?.includes('Stage') ?
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }}>{lead.stage}</Typography>
                        </TableCell>
                        :
                        null
                    }
                    {
                      !hiddenFields?.includes('Mobile1') ?
                        <TableCell>
                          <Stack>
                            <Typography variant="body1"  >{lead.mobile}</Typography>
                          </Stack>
                        </TableCell>
                        :
                        null
                    }
                    {/* alternate mobile 1 */}
                    {
                      !hiddenFields?.includes('Mobile2') ?
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }}>{lead.alternate_mobile1}</Typography>
                        </TableCell>
                        :
                        null
                    }
                    {/* alternate mobile 2 */}
                    {
                      !hiddenFields?.includes('Mobile3') ?
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }}>{lead.alternate_mobile2}</Typography>
                        </TableCell>
                        :
                        null
                    }

                    {/* city */}
                    {
                      !hiddenFields?.includes('City') ?
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }}>{lead.city}</Typography>
                        </TableCell>
                        :
                        null
                    }
                    {/* state */}
                    {
                      !hiddenFields?.includes('State') ?
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }}>{lead.state}</Typography>
                        </TableCell>
                        :
                        null
                    }
                    {/* lead type */}
                    {
                      !hiddenFields?.includes('Lead Type') ?
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }}>{lead.lead_type}</Typography>
                        </TableCell>
                        :
                        null
                    }
                    {/* lead owners */}
                    {
                      !hiddenFields?.includes('Lead Owners') ?
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }}>{lead.lead_owners ? lead.lead_owners.map((owner) => { return owner.username + ", " }) : [""]}</Typography>
                        </TableCell>
                        :
                        null
                    }
                    {/* turn over */}
                    {
                      !hiddenFields?.includes('Turn Over') ?
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }}>{lead.turnover ? lead.turnover : 'na'}</Typography>
                        </TableCell>
                        :
                        null
                    }
                    {/* work description */}
                    {
                      !hiddenFields?.includes('Work Description') ?
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }}>{lead.work_description ? lead.work_description.slice(0, 50) : ""}</Typography>
                        </TableCell>
                        :
                        null
                    }
                    {/* customer name */}
                    {
                      !hiddenFields?.includes('Customer Name') ?
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }}>{lead.customer_name}</Typography>
                        </TableCell>
                        :
                        null
                    }
                    {/* designiaton */}
                    {
                      !hiddenFields?.includes('Customer Desigination') ?
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }}>{lead.customer_designation}</Typography>
                        </TableCell>
                        :
                        null
                    }
                    {/* last remark */}
                    {
                      !hiddenFields?.includes('Last Remark') ?
                        <TableCell>
                          {lead.remarks ?
                            <Typography sx={{ textTransform: "capitalize" }}> {lead.last_remark && lead.last_remark.slice(0, 50)}
                            </Typography> : null
                          }
                        </TableCell>
                        :
                        null
                    }
                    {/* mobile */}

                    {/* email */}
                    {
                      !hiddenFields?.includes('Email') ?
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }} variant="body1">{lead.email}</Typography>
                        </TableCell>
                        :
                        null
                    }
                    {/* alternate email */}
                    {
                      !hiddenFields?.includes('Email2') ?
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }} variant="body1">{lead.alternate_email}</Typography>
                        </TableCell>
                        :
                        null
                    }
                    {/* address */}
                    {
                      !hiddenFields?.includes('Address') ?
                        <TableCell>
                          <Stack>
                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{lead.address ? lead.address.slice(0, 50) : "..."}</Typography>
                          </Stack>
                        </TableCell>
                        :
                        null
                    }


                    {/* source */}
                    {
                      !hiddenFields?.includes('Lead Source') ?
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }} variant="body1">{lead.lead_source}</Typography>

                        </TableCell>
                        :
                        null
                    }
                    {/* country */}
                    {
                      !hiddenFields?.includes('Country') ?
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }} variant="body1">{lead.country}</Typography>

                        </TableCell>
                        :
                        null
                    }
                    {/* created at */}
                    {
                      !hiddenFields?.includes('Created At') ?
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(lead.created_at).toLocaleString()}</Typography>

                        </TableCell>
                        :
                        null
                    }
                    {/* updated at */}
                    {
                      !hiddenFields?.includes('Updated At') ?
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(lead.updated_at).toLocaleString()}</Typography>

                        </TableCell>
                        :
                        null
                    }
                    {/* created by */}
                    {
                      !hiddenFields?.includes('Created By') ?
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }} variant="body1">{lead.created_by.username}</Typography>

                        </TableCell>
                        :
                        null
                    }
                    {/* updated by */}
                    {
                      !hiddenFields?.includes('Updated By') ?
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }} variant="body1">{lead.updated_by.username}</Typography>

                        </TableCell>
                        :
                        null
                    }

                    {/* last whatsapp */}
                    {
                      !hiddenFields?.includes('Last Whatsapp') ?
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(lead.last_whatsapp_date).toLocaleString()}</Typography>
                        </TableCell>
                        :
                        null
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
            <UpdateLeadDialog lead={lead} />
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