import { Delete, Edit, Visibility } from '@mui/icons-material'
import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext'
import { UserContext } from '../../../contexts/userContext'
import PopUp from '../../popup/PopUp'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../styled/STyledTable'
import CreateOrEditReferDialog from '../../dialogs/crm/CreateOrEditReferDialog'
import DeleteCrmItemDialog from '../../dialogs/crm/DeleteCrmItemDialog'
import AllReferralPageDialog from '../../dialogs/crm/AllReferralPageDialog'
import { GetReferDto } from '../../../dtos/crm/crm.dto'


type Props = {
  refer: GetReferDto | undefined
  setRefer: React.Dispatch<React.SetStateAction<GetReferDto | undefined>>,
  refers: GetReferDto[],
  selectAll: boolean,
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
  selectedRefers: GetReferDto[]
  setSelectedRefers: React.Dispatch<React.SetStateAction<GetReferDto[]>>,
}

function RefersTable({ refer, refers, setRefer, selectAll, setSelectAll, selectedRefers, setSelectedRefers }: Props) {
  const { setChoice } = useContext(ChoiceContext)
  const { user } = useContext(UserContext)
  const [data, setData] = useState<GetReferDto[]>(refers)

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

                  Refers

                </STableHeadCell>
                
                <STableHeadCell
                >

                  Remark

                </STableHeadCell>
                <STableHeadCell
                >

                  Customer Name
                </STableHeadCell>
                <STableHeadCell
                >

                  Mobile1

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

                City

              </STableHeadCell>


              <STableHeadCell
              >

                State

                </STableHeadCell>
             

              <STableHeadCell
              >

                GST

            
                </STableHeadCell>

                <STableHeadCell
                >

                  Address

                </STableHeadCell>

              <STableHeadCell
              >

                Created At

              </STableHeadCell>

              <STableHeadCell
              >

                Created By

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

                            {user?.is_admin && user.assigned_permissions.includes('refer_delete')&&
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
                            {user?.assigned_permissions.includes('refer_edit')&&<Tooltip title="edit">
                                <IconButton color="secondary"
                                 
                                  onClick={() => {

                                    setChoice({ type: LeadChoiceActions.create_or_edit_refer })
                                    setRefer(refer)
                                  }}

                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>}


                            {user?.assigned_permissions.includes('refer_view') &&<Tooltip title="view all refer refers">
                              <IconButton color="primary"
                               
                                onClick={() => {
                                  setChoice({ type: LeadChoiceActions.view_referrals })
                                  setRefer(refer)
                                }}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>}

                          </Stack>}
                      />
                    </STableCell>
                    <STableCell >
                      {refer.name}
                    </STableCell>
                    <STableCell >
                      {refer.refers}
                    </STableCell>
                    <STableCell >
                      {refer.remark}
                    </STableCell>

                    <STableCell>
                      {refer.customer_name}
                    </STableCell>
                    <STableCell>
                      {refer.mobile}
                    </STableCell>
                    <STableCell>
                      {refer.mobile2}
                    </STableCell>
                    <STableCell>
                      {refer.mobile3}
                    </STableCell>
                    <STableCell>
                      {refer.city}
                    </STableCell>
                    <STableCell>
                      {refer.state}
                    </STableCell>

                    <STableCell>

                      {refer.address}

                    </STableCell>


                    <STableCell>

                      {refer.gst}

                    </STableCell>

                    <STableCell>
                      {refer.created_at}

                    </STableCell>

                    <STableCell>
                      {refer.created_by.label}
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