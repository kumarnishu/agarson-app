import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, UserChoiceActions } from '../../contexts/dialogContext'
import PopUp from '../popup/PopUp'
import { Edit } from '@mui/icons-material'
import { UserContext } from '../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import { IState, IUser } from '../../types/user.types'


type Props = {
    state: { state: IState, users: IUser[] } | undefined,
    setState: React.Dispatch<React.SetStateAction<{ state: IState, users: IUser[] } | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    states: { state: IState, users: IUser[] }[],
    selectedStates: { state: IState, users: IUser[] }[]
    setSelectedStates: React.Dispatch<React.SetStateAction<{ state: IState, users: IUser[] }[]>>,
}
function LeadsStateTable({ state, selectAll, states, setSelectAll, setState, selectedStates, setSelectedStates }: Props) {
    const [data, setData] = useState<{ state: IState, users: IUser[] }[]>(states)
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


                                <Checkbox  sx={{ width: 16, height: 16 }}
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
                            {user?.productions_access_fields.is_editable &&
                                <STableHeadCell style={{ width: '50px' }}
                                >

                                    Actions

                                </STableHeadCell>}
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
                                        style={{ backgroundColor: selectedStates.length > 0 && selectedStates.find((t) => t.state._id === state.state._id) ? "lightgrey" : "white" }}
                                        key={index}
                                    >
                                        {selectAll ?
                                            <STableCell style={{ width: '50px' }}>


                                                <Checkbox  sx={{ width: 16, height: 16 }} size="small"
                                                    checked={Boolean(selectAll)}
                                                />


                                            </STableCell>
                                            :
                                            null
                                        }
                                        {!selectAll ?
                                            <STableCell style={{ width: '50px' }}>

                                                <Checkbox  sx={{ width: 16, height: 16 }} size="small"
                                                    onChange={(e) => {
                                                        setState(state)
                                                        if (e.target.checked) {
                                                            setSelectedStates([...selectedStates, state])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedStates((states) => states.filter((item) => {
                                                                return item.state._id !== state.state._id
                                                            }))
                                                        }
                                                    }}
                                                />

                                            </STableCell>
                                            :
                                            null
                                        }
                                        {/* actions */}
                                        {user?.user_access_fields.is_editable &&
                                            <STableCell style={{ width: '50' }}>
                                                <PopUp
                                                    element={
                                                        <Stack direction="row">
                                                            <>
                                                                <Tooltip title="edit">
                                                                    <IconButton
                                                                        onClick={() => {
                                                                            setState(state)
                                                                            setChoice({ type: UserChoiceActions.update_state })
                                                                        }}

                                                                    >
                                                                        <Edit />
                                                                    </IconButton>
                                                                </Tooltip>

                                                            </>

                                                        </Stack>}
                                                />

                                            </STableCell>}
                                        <STableCell style={{width:'200px'}}>
                                            {state.state.state}
                                        </STableCell>
                                        <STableCell>
                                            {state.users.map((u) => { return u.username }).toString()}
                                        </STableCell>
                                                                  
                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>
               
            </Box>
        </>
    )
}

export default LeadsStateTable