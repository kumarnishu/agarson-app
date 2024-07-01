import { Delete, Edit, Visibility } from '@mui/icons-material'
import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext'
import { UserContext } from '../../../contexts/userContext'
import PopUp from '../../popup/PopUp'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../styled/STyledTable'
import CreateOrEditReferDialog from '../../dialogs/crm/CreateOrEditReferDialog'
import { ILead, IReferredParty } from '../../../types/crm.types'
import DeleteCrmItemDialog from '../../dialogs/crm/DeleteCrmItemDialog'


type Props = {
  refer: {
    party: IReferredParty,
    leads: ILead[]
  } | undefined
  setRefer: React.Dispatch<React.SetStateAction<{
    party: IReferredParty,
    leads: ILead[]
  } | undefined>>,
  refers: {
    party: IReferredParty,
    leads: ILead[]
  }[],
  selectAll: boolean,
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
  selectedRefers: {
    party: IReferredParty,
    leads: ILead[]
  }[]
  setSelectedRefers: React.Dispatch<React.SetStateAction<{
    party: IReferredParty,
    leads: ILead[]
  }[]>>,
}

function RefersTable({ refer, refers, setRefer, selectAll, setSelectAll, selectedRefers, setSelectedRefers }: Props) {
  const { setChoice } = useContext(ChoiceContext)
  const { user } = useContext(UserContext)
  const [data, setData] = useState<{
    party: IReferredParty,
    leads: ILead[]
  }[]>(refers)

  useEffect(() => {
    setData(refers)
  }, [refers])
  return (
    <>
      <Box sx={{
        overflow: "auto",
        height: '78vh'
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
                      setSelectedRefers(refers)
                      setSelectAll(true)
                    }
                    if (!e.currentTarget.checked) {
                      setSelectedRefers([])
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

                Refer Name

              </STableHeadCell>
              <STableHeadCell
              >

                Customer Name

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

                Mobile

              </STableHeadCell>

              <STableHeadCell
              >

                GST

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
            </STableRow>
          </STableHead>
          <STableBody >
            {

              data && data.map((refer, index) => {
                return (
                  <STableRow
                    style={{ backgroundColor: selectedRefers.length > 0 && selectedRefers.find((t) => t.party._id === refer.party._id) ? "lightgrey" : "white" }}
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
                          checked={selectedRefers.length > 0 && selectedRefers.find((t) => t.party._id === refer.party._id) ? true : false}
                          onChange={(e) => {
                            setRefer(refer)
                            if (e.target.checked) {
                              setSelectedRefers([...selectedRefers, refer])
                            }
                            if (!e.target.checked) {
                              setSelectedRefers((refers) => refers.filter((item) => {
                                return item.party._id !== refer.party._id
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

                            {user?.crm_access_fields.is_deletion_allowed &&
                              <Tooltip title="delete">
                                <IconButton color="error"
                                  onClick={() => {
                                    setChoice({ type: LeadChoiceActions.delete_crm_item })
                                    setRefer(refer)

                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            }




                            {user?.crm_access_fields.is_editable &&
                              <Tooltip title="edit">
                                <IconButton color="secondary"
                                  onClick={() => {

                                    setChoice({ type: LeadChoiceActions.create_or_edit_refer })
                                    setRefer(refer)
                                  }}

                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>}


                            <Tooltip title="view all refer refers">
                              <IconButton color="primary"
                                onClick={() => {

                                  setChoice({ type: LeadChoiceActions.view_remarks })
                                  setRefer(refer)


                                }}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>

                          </Stack>}
                      />
                    </STableCell>
                    <STableCell >
                      {refer.party.name}
                    </STableCell>

                    <STableCell>
                      {refer.party.customer_name}
                    </STableCell>

                    <STableCell>
                      {refer.party.city}
                    </STableCell>
                    <STableCell>
                      {refer.party.state}
                    </STableCell>

                    <STableCell>
                      {refer.party.mobile}
                    </STableCell>



                    <STableCell>

                      {refer.party.gst}

                    </STableCell>

                    <STableCell>
                      {new Date(refer.party.created_at).toLocaleString()}

                    </STableCell>


                    <STableCell>
                      {new Date(refer.party.updated_at).toLocaleString()}

                    </STableCell>


                    <STableCell>
                      {refer.party.created_by.username}
                    </STableCell>


                    <STableCell>
                      {refer.party.updated_by.username}

                    </STableCell>

                  </STableRow>
                )
              })

            }
          </STableBody>
        </STable>
      </Box >
      <CreateOrEditReferDialog refer={refer?.party} />

      {
        refer ?
          <>

            <DeleteCrmItemDialog refer={refer.party} />

          </>
          : null
      }
    </>
  )
}

export default RefersTable