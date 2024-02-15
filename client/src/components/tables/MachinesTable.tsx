import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, ProductionChoiceActions } from '../../contexts/dialogContext'
import PopUp from '../popup/PopUp'
import { Edit, RestartAlt } from '@mui/icons-material'
import { UserContext } from '../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import { IMachine } from '../../types/production.types'
import UpdateMachineDialog from '../dialogs/production/UpdateMachineDialog'
import ToogleMachineDialog from '../dialogs/production/ToogleMachineDialog'


type Props = {
    machine: IMachine | undefined,
    setMachine: React.Dispatch<React.SetStateAction<IMachine | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    machines: IMachine[],
    selectedMachines: IMachine[]
    setSelectedMachines: React.Dispatch<React.SetStateAction<IMachine[]>>,
}
function MachinesTable({ machine, selectAll, machines, setSelectAll, setMachine, selectedMachines, setSelectedMachines }: Props) {
    const [data, setData] = useState<IMachine[]>(machines)
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    useEffect(() => {
        if (data)
            setData(machines)
    }, [machines, data])
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
                            <STableHeadCell
                            >


                                <Checkbox  sx={{ width: 16, height: 16 }}
                                    indeterminate={selectAll ? true : false}
                                    checked={Boolean(selectAll)}
                                    size="small" onChange={(e) => {
                                        if (e.currentTarget.checked) {
                                            setSelectedMachines(machines)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedMachines([])
                                            setSelectAll(false)
                                        }
                                    }} />

                            </STableHeadCell>
                            {user?.productions_access_fields.is_editable &&
                                <STableHeadCell
                                >

                                    Actions

                                </STableHeadCell>}
                            <STableHeadCell
                            >

                                Name

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Serial No

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Status

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Display name

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Category

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Created At

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Created By

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Updated At

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Updated By

                            </STableHeadCell>


                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {
                            machines && machines.map((machine, index) => {
                                return (
                                    <STableRow
                                        style={{ backgroundColor: selectedMachines.length > 0 && selectedMachines.find((t) => t._id === machine._id) ? "lightgrey" : "white" }}
                                        key={index}
                                    >
                                        {selectAll ?
                                            <STableCell>


                                                <Checkbox  sx={{ width: 16, height: 16 }} size="small"
                                                    checked={Boolean(selectAll)}
                                                />


                                            </STableCell>
                                            :
                                            null
                                        }
                                        {!selectAll ?
                                            <STableCell>

                                                <Checkbox  sx={{ width: 16, height: 16 }} size="small"
                                                    onChange={(e) => {
                                                        setMachine(machine)
                                                        if (e.target.checked) {
                                                            setSelectedMachines([...selectedMachines, machine])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedMachines((machines) => machines.filter((item) => {
                                                                return item._id !== machine._id
                                                            }))
                                                        }
                                                    }}
                                                />

                                            </STableCell>
                                            :
                                            null
                                        }
                                        {/* actions */}
                                        {user?.productions_access_fields.is_editable &&
                                            <STableCell>
                                                <PopUp
                                                    element={
                                                        <Stack direction="row">
                                                            <>
                                                                <Tooltip title="edit">
                                                                    <IconButton
                                                                        onClick={() => {
                                                                            setMachine(machine)
                                                                            setChoice({ type: ProductionChoiceActions.update_machine })
                                                                        }}

                                                                    >
                                                                        <Edit />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                {user?.productions_access_fields.is_editable &&
                                                                    <Tooltip title="Toogle">
                                                                        <IconButton color="primary"
                                                                            onClick={() => {
                                                                                setMachine(machine)
                                                                                setChoice({ type: ProductionChoiceActions.toogle_machine })

                                                                            }}
                                                                        >
                                                                            <RestartAlt />
                                                                        </IconButton>
                                                                    </Tooltip>}
                                                            </>

                                                        </Stack>}
                                                />

                                            </STableCell>}
                                        <STableCell>
                                            {machine.name}
                                        </STableCell>
                                        <STableCell>
                                            {machine.serial_no}
                                        </STableCell>
                                        <STableCell>
                                            {machine.active ? "active" : "inactive"}
                                        </STableCell>
                                        <STableCell>
                                            {machine.display_name}
                                        </STableCell>
                                        <STableCell>
                                            {machine.category}
                                        </STableCell>
                                        <STableCell>
                                            {machine.created_at && new Date(machine.created_at).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {machine.created_by.username}
                                        </STableCell>
                                        <STableCell>
                                            {machine.updated_at && new Date(machine.updated_at).toLocaleString()}
                                        </STableCell>

                                        <STableCell>
                                            {machine.updated_by.username}
                                        </STableCell>

                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>
                {
                    machine ?
                        <>
                            <UpdateMachineDialog machine={machine} />
                            <ToogleMachineDialog machine={machine} />
                        </> : null
                }
            </Box>
        </>
    )
}

export default MachinesTable