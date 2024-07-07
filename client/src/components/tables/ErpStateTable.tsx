import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import PopUp from '../popup/PopUp'
import { Delete, Edit } from '@mui/icons-material'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import { IUser } from '../../types/user.types'
import { ChoiceContext, UserChoiceActions } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'
import CreateOrEditErpStateDialog from '../dialogs/erp/CreateOrEditErpStateDialog'
import { IState } from '../../types/erp_report.types'
import DeleteErpStateDialog from '../dialogs/erp/DeleteErpStateDialog'



type Props = {
    state: { state: IState, users: IUser[] } | undefined,
    setState: React.Dispatch<React.SetStateAction<{ state: IState, users: IUser[] } | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    states: { state: IState, users: IUser[] }[],
    selectedStates: { state: IState, users: IUser[] }[]
    setSelectedStates: React.Dispatch<React.SetStateAction<{ state: IState, users: IUser[] }[]>>,
}
function ErpStateTable({ state, selectAll, states, setSelectAll, setState, selectedStates, setSelectedStates }: Props) {
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
                            <STableHeadCell
                            >

                                APR

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                MAY

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                JUN

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                JUL

                            </STableHeadCell> <STableHeadCell
                            >

                                AUG

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                SEP
                            </STableHeadCell> <STableHeadCell
                            >

                                OCT

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                NOV

                            </STableHeadCell> <STableHeadCell
                            >

                                DEC

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                JAN

                            </STableHeadCell> <STableHeadCell
                            >

                                FEB

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                MAR

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

                                        <STableCell style={{ width: '50' }}>
                                            <PopUp
                                                element={
                                                    <Stack direction="row">
                                                        <>
                                                            {user?.erp_access_fields.is_deletion_allowed &&
                                                                <Tooltip title="delete">
                                                                    <IconButton color="error"
                                                                        onClick={() => {
                                                                            setChoice({ type: UserChoiceActions.delete_erp_state })
                                                                            setState(state)

                                                                        }}
                                                                    >
                                                                        <Delete />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            }

                                                            {user?.erp_access_fields.is_editable && <Tooltip title="edit">
                                                                <IconButton
                                                                    onClick={() => {
                                                                        setState(state)
                                                                        setChoice({ type: UserChoiceActions.create_or_edit_erpstate })
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
                                            {state.state.state}
                                        </STableCell>
                                        <STableCell title={state.users.map((u) => { return u.username }).toString()}>
                                            {state.users.map((u) => { return u.username }).toString()}
                                        </STableCell>
                                        <STableCell>
                                            {state.state && state.state.apr == 0 ? "" :  state.state.apr}
                                        </STableCell>

                                        <STableCell>
                                            {state.state && state.state.may == 0 ? "" :  state.state.may}
                                        </STableCell>
                                        <STableCell>
                                            {state.state && state.state.jun == 0 ? "" :  state.state.jun}
                                        </STableCell>
                                        <STableCell>
                                            {state.state && state.state.jul == 0 ? "" :  state.state.jul}
                                        </STableCell>
                                        <STableCell>
                                            {state.state && state.state.aug == 0 ? "" :  state.state.aug}
                                        </STableCell>
                                        <STableCell>
                                            {state.state && state.state.sep == 0 ? "" :  state.state.sep}
                                        </STableCell>
                                        <STableCell>
                                            {state.state && state.state.oct == 0 ? "" :  state.state.oct}
                                        </STableCell>
                                        <STableCell>
                                            {state.state && state.state.nov == 0 ? "" :  state.state.nov}
                                        </STableCell>
                                        <STableCell>
                                            {state.state && state.state.dec == 0 ? "" :  state.state.dec}
                                        </STableCell>
                                        <STableCell>
                                            {state.state && state.state.jan == 0 ? "" :  state.state.jan}
                                        </STableCell>
                                        <STableCell>
                                            {state.state && state.state.feb == 0 ? "" :  state.state.feb}
                                        </STableCell>
                                        <STableCell>
                                            {state.state && state.state.mar == 0 ? "" :  state.state.mar}
                                        </STableCell>

                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>
                <CreateOrEditErpStateDialog state={state?.state} />
                {state && <DeleteErpStateDialog state={state.state} />}
            </Box>
        </>
    )
}

export default ErpStateTable