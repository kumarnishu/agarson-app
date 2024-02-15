import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, ProductionChoiceActions } from '../../contexts/dialogContext'
import PopUp from '../popup/PopUp'
import { Edit, RestartAlt } from '@mui/icons-material'
import { UserContext } from '../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import { IDye } from '../../types/production.types'
import UpdateDyeDialog from '../dialogs/production/UpdateDyeDialog'
import ToogleDyeDialog from '../dialogs/production/ToogleDyeDialog'


type Props = {
    dye: IDye | undefined,
    setDye: React.Dispatch<React.SetStateAction<IDye | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    dyes: IDye[],
    selectedDyes: IDye[]
    setSelectedDyes: React.Dispatch<React.SetStateAction<IDye[]>>,
}
function DyesTable({ dye, selectAll, dyes, setSelectAll, setDye, selectedDyes, setSelectedDyes }: Props) {
    const [data, setData] = useState<IDye[]>(dyes)
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    useEffect(() => {
        if (data)
            setData(dyes)
    }, [dyes, data])
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
                                            setSelectedDyes(dyes)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedDyes([])
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

                                Dye Number

                            </STableHeadCell>
                            <STableHeadCell
                            >

                               Size

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Status

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
                            dyes && dyes.map((dye, index) => {
                                return (
                                    <STableRow
                                        style={{ backgroundColor: selectedDyes.length > 0 && selectedDyes.find((t) => t._id === dye._id) ? "lightgrey" : "white" }}
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
                                                        setDye(dye)
                                                        if (e.target.checked) {
                                                            setSelectedDyes([...selectedDyes, dye])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedDyes((dyes) => dyes.filter((item) => {
                                                                return item._id !== dye._id
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
                                                                            setDye(dye)
                                                                            setChoice({ type: ProductionChoiceActions.update_dye })
                                                                        }}

                                                                    >
                                                                        <Edit />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                {user?.productions_access_fields.is_editable &&
                                                                    <Tooltip title="Toogle">
                                                                        <IconButton color="primary"
                                                                            onClick={() => {
                                                                                setDye(dye)
                                                                                setChoice({ type: ProductionChoiceActions.toogle_dye })

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
                                            {dye.dye_number}
                                        </STableCell>
                                        <STableCell>
                                            {dye.size}
                                        </STableCell>
                                        <STableCell>
                                            {dye.active ? "active" : "inactive"}
                                        </STableCell>

                                        <STableCell>
                                            {dye.created_at && new Date(dye.created_at).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {dye.created_by.username}
                                        </STableCell>
                                        <STableCell>
                                            {dye.updated_at && new Date(dye.updated_at).toLocaleString()}
                                        </STableCell>

                                        <STableCell>
                                            {dye.updated_by.username}
                                        </STableCell>

                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>
                {
                    dye ?
                        <>
                            <UpdateDyeDialog dye={dye} />
                            <ToogleDyeDialog dye={dye} />
                        </> : null
                }
            </Box>
        </>
    )
}

export default DyesTable