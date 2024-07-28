import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext'
import PopUp from '../../popup/PopUp'
import { Delete, Edit } from '@mui/icons-material'
import { UserContext } from '../../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../styled/STyledTable'
import { ILeadType } from '../../../types/crm.types'
import CreateOrEditLeadTypeDialog from '../../dialogs/crm/CreateOrEditLeadTypeDialog'
import DeleteCrmItemDialog from '../../dialogs/crm/DeleteCrmItemDialog'


type Props = {
    type: ILeadType | undefined,
    setType: React.Dispatch<React.SetStateAction<ILeadType | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    types: ILeadType[],
    selectedTypes: ILeadType[]
    setSelectedTypes: React.Dispatch<React.SetStateAction<ILeadType[]>>,
}
function LeadsTypeTable({ type, selectAll, types, setSelectAll, setType, selectedTypes, setSelectedTypes }: Props) {
    const [data, setData] = useState<ILeadType[]>(types)
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    useEffect(() => {
        if (data)
            setData(types)
    }, [types, data])
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
                                            setSelectedTypes(types)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedTypes([])
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

                                Type

                            </STableHeadCell>
                          




                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {
                            types && types.map((type, index) => {
                                return (
                                    <STableRow
                                        style={{ backgroundColor: selectedTypes.length > 0 && selectedTypes.find((t) => t._id === type._id) ? "lightgrey" : "white" }}
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

                                                <Checkbox sx={{ width: 16, height: 16 }} 
                                                size="small"
                                                    checked={selectedTypes.length > 0 && selectedTypes.find((t) => t._id === type._id) ? true : false}
                                                    onChange={(e) => {
                                                        setType(type)
                                                        if (e.target.checked) {
                                                            setSelectedTypes([...selectedTypes, type])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedTypes((types) => types.filter((item) => {
                                                                return item._id !== type._id
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
                                                            {user?.is_admin && user.assigned_permissions.includes('leadtype_delete')&&
                                                                    <Tooltip title="delete">
                                                                        <IconButton color="error"
                                                                      
                                                                            onClick={() => {
                                                                                setChoice({ type: LeadChoiceActions.delete_crm_item })
                                                                                setType(type)

                                                                            }}
                                                                        >
                                                                            <Delete />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                }
                                                            {user?.assigned_permissions.includes('leadtype_edit') &&<Tooltip title="edit">
                                                                    <IconButton
                                                                  
                                                                        onClick={() => {
                                                                            setType(type)
                                                                            setChoice({ type: LeadChoiceActions.create_or_edit_leadtype })
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
                                            {type.type}
                                        </STableCell>
                                     

                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>
                <CreateOrEditLeadTypeDialog type={type} />
                <DeleteCrmItemDialog type={type}/>
            </Box>
        </>
    )
}

export default LeadsTypeTable