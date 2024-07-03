import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext'
import PopUp from '../../popup/PopUp'
import { Delete, Edit } from '@mui/icons-material'
import { UserContext } from '../../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../styled/STyledTable'
import CreateOrEditLeadSourceDialog from '../../dialogs/crm/CreateOrEditLeadSourceDialog'
import { ILeadSource } from '../../../types/crm.types'
import DeleteCrmItemDialog from '../../dialogs/crm/DeleteCrmItemDialog'


type Props = {
    source: ILeadSource | undefined,
    setLeadSource: React.Dispatch<React.SetStateAction<ILeadSource | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    sources: ILeadSource[],
    selectedLeadSources: ILeadSource[]
    setSelectedLeadSources: React.Dispatch<React.SetStateAction<ILeadSource[]>>,
}
function LeadsLeadSourceTable({ source, selectAll, sources, setSelectAll, setLeadSource, selectedLeadSources, setSelectedLeadSources }: Props) {
    const [data, setData] = useState<ILeadSource[]>(sources)
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    useEffect(() => {
        if (data)
            setData(sources)
    }, [sources, data])
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
                                            setSelectedLeadSources(sources)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedLeadSources([])
                                            setSelectAll(false)
                                        }
                                    }} />

                            </STableHeadCell>
                            {user?.crm_access_fields.is_editable &&
                                <STableHeadCell style={{ width: '50px' }}
                                >

                                    Actions

                                </STableHeadCell>}
                            <STableHeadCell style={{ width: '200px' }}
                            >

                                LeadSource

                            </STableHeadCell>





                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {
                            sources && sources.map((source, index) => {
                                return (
                                    <STableRow
                                        style={{ backgroundColor: selectedLeadSources.length > 0 && selectedLeadSources.find((t) => t._id === source._id) ? "lightgrey" : "white" }}
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
                                                    checked={selectedLeadSources.length > 0 && selectedLeadSources.find((t) => t._id === source._id) ? true : false}
                                                    onChange={(e) => {
                                                        setLeadSource(source)
                                                        if (e.target.checked) {
                                                            setSelectedLeadSources([...selectedLeadSources, source])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedLeadSources((sources) => sources.filter((item) => {
                                                                return item._id !== source._id
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
                                                            {user?.crm_access_fields.is_deletion_allowed &&
                                                                <Tooltip title="delete">
                                                                    <IconButton color="error"
                                                                        onClick={() => {
                                                                            setChoice({ type: LeadChoiceActions.delete_crm_item })
                                                                            setLeadSource(source)

                                                                        }}
                                                                    >
                                                                        <Delete />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            }

                                                            {user?.crm_access_fields.is_editable && <Tooltip title="edit">
                                                                <IconButton
                                                                    onClick={() => {
                                                                        setLeadSource(source)
                                                                        setChoice({ type: LeadChoiceActions.create_or_edit_source })
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
                                            {source.source}
                                        </STableCell>


                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>
                <CreateOrEditLeadSourceDialog source={source} />
                <DeleteCrmItemDialog source={source} />
            </Box>
        </>
    )
}

export default LeadsLeadSourceTable