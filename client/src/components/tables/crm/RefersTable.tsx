import { Delete, Edit, Visibility } from '@mui/icons-material'
import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext'
import { UserContext } from '../../../contexts/userContext'
import PopUp from '../../popup/PopUp'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../styled/STyledTable'
import CreateOrEditReferDialog from '../../dialogs/crm/CreateOrEditReferDialog'
import { IReferredParty } from '../../../types/crm.types'
import DeleteCrmItemDialog from '../../dialogs/crm/DeleteCrmItemDialog'
import AllReferralPageDialog from '../../dialogs/crm/AllReferralPageDialog'
import { is_authorized } from '../../../utils/auth'


type Props = {
  refer: IReferredParty | undefined
  setRefer: React.Dispatch<React.SetStateAction<IReferredParty | undefined>>,
  refers: IReferredParty[],
  selectAll: boolean,
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
  selectedRefers: IReferredParty[]
  setSelectedRefers: React.Dispatch<React.SetStateAction<IReferredParty[]>>,
}

function RefersTable({ refer, refers, setRefer, selectAll, setSelectAll, selectedRefers, setSelectedRefers }: Props) {
  const { setChoice } = useContext(ChoiceContext)
  const { user } = useContext(UserContext)
  const [data, setData] = useState<IReferredParty[]>(refers)

  useEffect(() => {
    setData(refers)
  }, [refers])

  return (
    <>
      {refers && refers.length == 0 ? <div style={{ textAlign: "center", padding: '10px' }}>No Data Found</div>
        :
      <Box sx={{
        overflow: "auto",
        height: '76vh'
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
                    style={{ backgroundColor: selectedRefers.length > 0 && selectedRefers.find((t) => t._id === refer._id) ? "lightgrey" : "white" }}
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
                          checked={selectedRefers.length > 0 && selectedRefers.find((t) => t._id === refer._id) ? true : false}
                          onChange={(e) => {
                            setRefer(refer)
                            if (e.target.checked) {
                              setSelectedRefers([...selectedRefers, refer])
                            }
                            if (!e.target.checked) {
                              setSelectedRefers((refers) => refers.filter((item) => {
                                return item._id !== refer._id
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

                            {user?.is_admin &&
                              <Tooltip title="delete">
                                <IconButton color="error"
                                  disabled={user?.assigned_roles && is_authorized('leads_view', user?.assigned_roles)}
                                  onClick={() => {
                                    setChoice({ type: LeadChoiceActions.delete_crm_item })
                                    setRefer(refer)

                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            }
                              <Tooltip title="edit">
                                <IconButton color="secondary"
                                  disabled={user?.assigned_roles && is_authorized('leads_view', user?.assigned_roles)}
                                  onClick={() => {

                                    setChoice({ type: LeadChoiceActions.create_or_edit_refer })
                                    setRefer(refer)
                                  }}

                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>


                            <Tooltip title="view all refer refers">
                              <IconButton color="primary"
                                disabled={user?.assigned_roles && is_authorized('leads_view', user?.assigned_roles)}
                                onClick={() => {
                                  setChoice({ type: LeadChoiceActions.view_referrals })
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
                      {refer.name}
                    </STableCell>

                    <STableCell>
                      {refer.customer_name}
                    </STableCell>

                    <STableCell>
                      {refer.city}
                    </STableCell>
                    <STableCell>
                      {refer.state}
                    </STableCell>

                    <STableCell>
                      {refer.mobile}
                    </STableCell>



                    <STableCell>

                      {refer.gst}

                    </STableCell>

                    <STableCell>
                      {new Date(refer.created_at).toLocaleString()}

                    </STableCell>


                    <STableCell>
                      {new Date(refer.updated_at).toLocaleString()}

                    </STableCell>


                    <STableCell>
                      {refer.created_by.username}
                    </STableCell>


                    <STableCell>
                      {refer.updated_by.username}

                    </STableCell>

                  </STableRow>
                )
              })

            }
          </STableBody>
        </STable>
      </Box >}
      <CreateOrEditReferDialog refer={refer} />

      {
        refer ?
          <>

            <DeleteCrmItemDialog refer={refer} />
            <AllReferralPageDialog refer={refer} />

          </>
          : null
      }
    </>
  )
}

export default RefersTable