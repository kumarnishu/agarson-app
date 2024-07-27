import { Box, Checkbox, IconButton, Stack, Tooltip } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../styled/STyledTable'

import { Delete, Edit } from '@mui/icons-material'
import { IRole } from '../../../types/user.types'
import { UserContext } from '../../../contexts/userContext'
import { ChoiceContext, UserChoiceActions } from '../../../contexts/dialogContext'
import CreateOrEditRoleDialog from '../../dialogs/users/CreateOrEditRoleDialog'
import DeleteRoleDialog from '../../dialogs/users/DeleteRoleDialog'
import PopUp from '../../popup/PopUp'




type Props = {
    role: IRole | undefined,
    setRole: React.Dispatch<React.SetStateAction<IRole | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    roles: IRole[],
    selectedRoles: IRole[]
    setSelectedRoles: React.Dispatch<React.SetStateAction<IRole[]>>,
}
function RolesTable({ role, selectAll, roles, setSelectAll, setRole, selectedRoles, setSelectedRoles }: Props) {
    const [data, setData] = useState<IRole[]>(roles)
    const { user } = useContext(UserContext)
    const { setChoice } = useContext(ChoiceContext)
    useEffect(() => {
        if (data)
            setData(roles)
    }, [roles, data])
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
                                            setSelectedRoles(roles)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedRoles([])
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

                                Role

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Assigned Permissions

                            </STableHeadCell>

                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {
                            roles && roles.map((role, index) => {
                                return (
                                    <STableRow
                                        style={{ backgroundColor: selectedRoles.length > 0 && selectedRoles.find((t) => t._id === role._id) ? "lightgrey" : "white" }}
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
                                                        setRole(role)
                                                        if (e.target.checked) {
                                                            setSelectedRoles([...selectedRoles, role])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedRoles((roles) => roles.filter((item) => {
                                                                return item._id !== role._id
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
                                                                            setChoice({ type: UserChoiceActions.delete_role })
                                                                            setRole(role)

                                                                        }}
                                                                    >
                                                                        <Delete />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            }

                                                            {user?.erp_access_fields.is_editable && <Tooltip title="edit">
                                                                <IconButton
                                                                    onClick={() => {
                                                                        setRole(role)
                                                                        setChoice({ type: UserChoiceActions.create_or_edit_role })
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
                                            {role.role}
                                        </STableCell>
                                        <STableCell >
                                            {role.permissions.length}
                                        </STableCell>

                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>
            </Box>
            {role ?
                <>
                    <CreateOrEditRoleDialog role={role} />
                    <DeleteRoleDialog role={role}/>
                </>
                : null}
        </>
    )
}

export default RolesTable