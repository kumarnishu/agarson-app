import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import PopUp from '../../popup/PopUp'
import { Delete, Edit } from '@mui/icons-material'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../styled/STyledTable'
import { ChoiceContext, UserChoiceActions } from '../../../contexts/dialogContext'
import CreateOrEditErpStateDialog from '../../dialogs/erp/CreateOrEditErpStateDialog'
import DeleteErpStateDialog from '../../dialogs/erp/DeleteErpStateDialog'
import { UserContext } from '../../../contexts/userContext'
import { GetErpStateDto } from '../../../dtos/erp reports/erp.reports.dto'



type Props = {
    state: GetErpStateDto | undefined,
    setState: React.Dispatch<React.SetStateAction<GetErpStateDto | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    states: GetErpStateDto[],
    selectedStates: GetErpStateDto[]
    setSelectedStates: React.Dispatch<React.SetStateAction<GetErpStateDto[]>>,
}
function ErpStateTable({ state, selectAll, states, setSelectAll, setState, selectedStates, setSelectedStates }: Props) {
    const [data, setData] = useState<GetErpStateDto[]>(states)
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    useEffect(() => {
        if (data)
            setData(states)
    }, [states, data])
    return (
        <>
            {states && states.length == 0 ? <div style={{ textAlign: "center", padding: '10px' }}>No Data Found</div>
                :
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
                                            style={{ backgroundColor: selectedStates.length > 0 && selectedStates.find((t) => t._id === state._id) ? "lightgrey" : "white" }}
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
                                                                    return item._id !== state._id
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

                                                                {user?.assigned_permissions.includes('erp_state_delete') && <Tooltip title="delete">
                                                                    <IconButton color="error"
                                                                        onClick={() => {
                                                                            setChoice({ type: UserChoiceActions.delete_erp_state })
                                                                            setState(state)

                                                                        }}
                                                                    >
                                                                        <Delete />
                                                                    </IconButton>
                                                                </Tooltip>}


                                                                {user?.assigned_permissions.includes('erp_state_edit') && <Tooltip title="edit">
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
                                                {state.state}
                                            </STableCell>
                                            <STableCell title={state.assigned_users.map((u) => { return u.label }).toString()}>
                                                {state.assigned_users.map((u) => { return u.label }).toString()}
                                            </STableCell>
                                            <STableCell>
                                                {state.apr}                                        </STableCell>

                                            <STableCell>
                                                {state.may}                                        </STableCell>
                                            <STableCell>
                                                {state.jun}                                        </STableCell>
                                            <STableCell>
                                                {state.jul}                                        </STableCell>
                                            <STableCell>
                                                {state.aug}                                        </STableCell>
                                            <STableCell>
                                                {state.sep}                                        </STableCell>
                                            <STableCell>
                                                {state.oct}                                        </STableCell>
                                            <STableCell>
                                                {state.nov}                                        </STableCell>
                                            <STableCell>
                                                {state.dec}                                        </STableCell>
                                            <STableCell>
                                                {state.jan}                                        </STableCell>
                                            <STableCell>
                                                {state.feb}                                        </STableCell>
                                            <STableCell>
                                                {state.mar}                                        </STableCell>

                                        </STableRow>
                                    )
                                })}
                        </STableBody>
                    </STable>
                    <CreateOrEditErpStateDialog state={state} />
                    {state && <DeleteErpStateDialog state={state} />}
                </Box>}
        </>
    )
}

export default ErpStateTable