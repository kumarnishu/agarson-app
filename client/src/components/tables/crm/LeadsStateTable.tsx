import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext'
import PopUp from '../../popup/PopUp'
import { Delete, Edit } from '@mui/icons-material'
import { UserContext } from '../../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../styled/STyledTable'
import CreateOrEditStateDialog from '../../dialogs/crm/CreateOrEditStateDialog'
import DeleteCrmItemDialog from '../../dialogs/crm/DeleteCrmItemDialog'
import { GetCrmStateDto } from '../../../dtos/crm/crm.dto'


type Props = {
    state: GetCrmStateDto | undefined,
    setState: React.Dispatch<React.SetStateAction<GetCrmStateDto | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    states: GetCrmStateDto[],
    selectedStates: GetCrmStateDto[]
    setSelectedStates: React.Dispatch<React.SetStateAction<GetCrmStateDto[]>>,
}
function LeadsStateTable({ state, selectAll, states, setSelectAll, setState, selectedStates, setSelectedStates }: Props) {
    const [data, setData] = useState<GetCrmStateDto[]>(states)
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    useEffect(() => {
        if (data)
            setData(states)
    }, [states, data])
    return (
        <>
            <Box sx={{
                overflow: "auto",
                height: '80vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>
                            <STableHeadCell style={{ width: '50px' }}
                            >


                                <Checkbox sx={{ width: 16, height: 16 }}
                                    indeterminate={selectAll ? true : false}
                                    checked={Boolean(selectAll)}
                                    size="small" onChange={(e) => {
                                        if (e.currentTarget.checked) {
                                            setSelectedStates(states)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedStates([])
                                            setSelectAll(false)
                                        }
                                    }} />

                            </STableHeadCell>

                            <STableHeadCell style={{ width: '50px' }}
                            >

                                Actions

                            </STableHeadCell>
                            <STableHeadCell style={{ width: '200px' }}
                            >

                                State

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Assigned Users

                            </STableHeadCell>




                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {
                            states && states.map((state, index) => {
                                return (
                                    <STableRow
                                        style={{ backgroundColor: selectedStates.length > 0 && selectedStates.find((t) => t.state.id === state.state.id) ? "lightgrey" : "white" }}
                                        key={index}
                                    >
                                        {selectAll ?
                                            <STableCell style={{ width: '50px' }}>


                                                <Checkbox sx={{ width: 16, height: 16 }} size="small"
                                                    checked={Boolean(selectAll)}
                                                />


                                            </STableCell>
                                            :
                                            null
                                        }
                                        {!selectAll ?
                                            <STableCell style={{ width: '50px' }}>

                                                <Checkbox sx={{ width: 16, height: 16 }} size="small"
                                                    onChange={(e) => {
                                                        setState(state)
                                                        if (e.target.checked) {
                                                            setSelectedStates([...selectedStates, state])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedStates((states) => states.filter((item) => {
                                                                return item.state.id !== state.state.id
                                                            }))
                                                        }
                                                    }}
                                                />

                                            </STableCell>
                                            :
                                            null
                                        }


                                        {/* actions */}

                                        <STableCell style={{ width: '50' }}>
                                            <PopUp
                                                element={
                                                    <Stack direction="row">
                                                        <>
                                                            {user?.is_admin && user.assigned_permissions.includes('states_delete')&&
                                                                <Tooltip title="delete">
                                                                    <IconButton color="error"
                                                                      
                                                                        onClick={() => {
                                                                            setChoice({ type: LeadChoiceActions.delete_crm_item })
                                                                            setState(state)

                                                                        }}
                                                                    >
                                                                        <Delete />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            }
                                                            {user?.assigned_permissions.includes('states_edit') &&<Tooltip title="edit">
                                                                <IconButton
                                                                  
                                                                    onClick={() => {
                                                                        setState(state)
                                                                        setChoice({ type: LeadChoiceActions.create_or_edit_state })
                                                                    }}

                                                                >
                                                                    <Edit />
                                                                </IconButton>
                                                            </Tooltip>}

                                                        </>

                                                    </Stack>}
                                            />

                                        </STableCell>
                                        <STableCell style={{ width: '200px' }}>
                                            {state.state.label}
                                        </STableCell>
                                        <STableCell>
                                            {state.assigned_users.map((u) => { return u.value }).toString()}
                                        </STableCell>

                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>
                <CreateOrEditStateDialog state={state?.state} />
                <DeleteCrmItemDialog state={state?.state} />
            </Box>
        </>
    )
}

export default LeadsStateTable