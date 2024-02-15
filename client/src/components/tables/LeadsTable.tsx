import { Comment, Delete, DeleteOutline, Edit, Share, Visibility } from '@mui/icons-material'
import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
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
import ToogleUselessLead from '../dialogs/crm/ToogleUselessLeadDialog'
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
        overflow: "auto",
        height: '80vh'
      }}>
        <STable>
          <STableHead style={{

          }}>
            <STableRow>
              <STableHeadCell
              >

                <Checkbox
                  indeterminate={selectAll ? true : false}
                  checked={Boolean(selectAll)}
                  size="small"
                  sx={{ width: 10, height: 10 }}
                  onChange={(e) => {
                    if (e.currentTarget.checked) {
                      setSelectedLeads(leads)
                      setSelectAll(true)
                    }
                    if (!e.currentTarget.checked) {
                      setSelectedLeads([])
                      setSelectAll(false)
                    }
                  }} />

              </STableHeadCell>

              <STableHeadCell
              >

                Actions

              </STableHeadCell>




              <STableHeadCell
              >

                Lead Name

              </STableHeadCell>


              <STableHeadCell
              >

                City

              </STableHeadCell>


              <STableHeadCell
              >

                State

              </STableHeadCell>

              <STableHeadCell
              >

                Stage

              </STableHeadCell>

              <STableHeadCell
              >

                Mobile

              </STableHeadCell>


              <STableHeadCell
              >

                Mobile2

              </STableHeadCell>

              <STableHeadCell
              >

                Mobile3

              </STableHeadCell>





              <STableHeadCell
              >

                Lead Type

              </STableHeadCell>


              <STableHeadCell
              >

                Lead Owners

              </STableHeadCell>


              <STableHeadCell
              >

                TurnOver

              </STableHeadCell>


              <STableHeadCell
              >

                Work Description

              </STableHeadCell>

              <STableHeadCell
              >

                Customer Name

              </STableHeadCell>

              <STableHeadCell
              >

                Customer Desigination

              </STableHeadCell>


              <STableHeadCell
              >

                Last Remark

              </STableHeadCell>


              <STableHeadCell
              >

                Refer Party

              </STableHeadCell>

              <STableHeadCell
              >

                Refer Party Mobile

              </STableHeadCell>

              <STableHeadCell
              >

                Refer Date

              </STableHeadCell>



              <STableHeadCell
              >

                Email

              </STableHeadCell>


              <STableHeadCell
              >

                Email2

              </STableHeadCell>


              <STableHeadCell
              >

                Address

              </STableHeadCell>




              <STableHeadCell
              >

                Lead Source

              </STableHeadCell>


              <STableHeadCell
              >

                Country

              </STableHeadCell>


              <STableHeadCell
              >

                Created At

              </STableHeadCell>


              <STableHeadCell
              >

                Updated At

              </STableHeadCell>


              <STableHeadCell
              >

                Created By

              </STableHeadCell>

              <STableHeadCell
              >

                Updated By

              </STableHeadCell>
              <STableHeadCell
              >

                Whatsapp Status

              </STableHeadCell>
              <STableHeadCell
              >

                Last whatsapp

              </STableHeadCell>
              <STableHeadCell
              >

                Visiting Card

              </STableHeadCell>
            </STableRow>
          </STableHead>
          <STableBody >
            {

              data && data.map((lead, index) => {
                return (
                  <STableRow
                    style={{ backgroundColor: selectedLeads.length > 0 && selectedLeads.find((t) => t._id === lead._id) ? "lightgrey" : "white" }}
                    key={index}>
                    {selectAll ?

                      <STableCell>


                        <Checkbox sx={{ width: 10, height: 10 }} size="small"
                          checked={Boolean(selectAll)}
                        />


                      </STableCell>
                      :
                      null
                    }
                    {!selectAll ?

                      <STableCell>

                        <Checkbox sx={{ width: 10, height: 10 }} size="small"
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

                      </STableCell>
                      :
                      null
                    }

                    <STableCell style={{ zIndex: -1 }}>
                      <PopUp
                        element={
                          <Stack direction="row" spacing={1}>

                            {lead.referred_party &&
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
                              lead.stage === "useless" &&
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

                          </Stack>}
                      />
                    </STableCell>

                    <STableCell>
                      {lead.name}
                    </STableCell>


                    <STableCell>
                      {lead.city}
                    </STableCell>


                    <STableCell>
                      {lead.state}
                    </STableCell>

                    <STableCell>
                      {lead.stage}
                    </STableCell>


                    <STableCell>

                      {lead.mobile}

                    </STableCell>


                    <STableCell>
                      {lead.alternate_mobile1}
                    </STableCell>


                    <STableCell>
                      {lead.alternate_mobile2}
                    </STableCell>



                    <STableCell>
                      {lead.lead_type}
                    </STableCell>


                    <STableCell>
                      {lead.lead_owners.map((owner) => { return owner.username }).toString()}
                    </STableCell>


                    <STableCell>
                      {lead.turnover ? lead.turnover : 'na'}
                    </STableCell>


                    <STableCell>
                      {lead.work_description ? lead.work_description.slice(0, 50) : ""}
                    </STableCell>


                    <STableCell>
                      {lead.customer_name}
                    </STableCell>


                    <STableCell>
                      {lead.customer_designation}
                    </STableCell>


                    <STableCell>
                      {lead.remarks && lead.remarks.length > 0 && lead.remarks[lead.remarks.length - 1].remark.slice(0, 50) || ""}

                    </STableCell>

                    <STableCell>
                      {lead.referred_party_name && lead.referred_party_name}

                    </STableCell>
                    <STableCell>

                      {lead.referred_party_mobile && lead.referred_party_mobile}

                    </STableCell>


                    <STableCell>
                      {lead.referred_date &&
                        new Date(lead.referred_date).toLocaleString()}

                    </STableCell>



                    <STableCell>
                      {lead.email}
                    </STableCell>

                    <STableCell>
                      {lead.alternate_email}
                    </STableCell>



                    <STableCell >
                      {lead.address ? lead.address.slice(0, 50) : "..."}

                    </STableCell>
                    <STableCell>
                      {lead.lead_source}

                    </STableCell>


                    <STableCell>
                      {lead.country}

                    </STableCell>


                    <STableCell>
                      {new Date(lead.created_at).toLocaleString()}

                    </STableCell>


                    <STableCell>
                      {new Date(lead.updated_at).toLocaleString()}

                    </STableCell>


                    <STableCell>
                      {lead.created_by.username}
                    </STableCell>


                    <STableCell>
                      {lead.updated_by.username}

                    </STableCell>
                    <STableCell>
                      {lead.is_sent ? "Sent" : "Pending"}
                    </STableCell>
                    <STableCell>
                      {new Date(lead.last_whatsapp).toLocaleString()}
                    </STableCell>
                    <STableCell
                      title="double click to download"
                      onDoubleClick={() => {
                        if (lead.visiting_card && lead.visiting_card?.public_url) {
                          DownloadFile(lead.visiting_card.public_url, lead.visiting_card.filename)
                        }
                      }}>
                      {lead.visiting_card && lead.visiting_card.public_url ? < img height="50" width="75" src={lead.visiting_card && lead.visiting_card.public_url} alt="visiting card" /> : "na"}
                    </STableCell>
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