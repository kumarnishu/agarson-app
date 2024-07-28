import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext'
import PopUp from '../../popup/PopUp'
import { Delete, Edit } from '@mui/icons-material'
import { UserContext } from '../../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../styled/STyledTable'
import CreateOrEditStageDialog from '../../dialogs/crm/CreateOrEditStageDialog'
import { IStage } from '../../../types/crm.types'
import DeleteCrmItemDialog from '../../dialogs/crm/DeleteCrmItemDialog'


type Props = {
    stage: IStage | undefined,
    setStage: React.Dispatch<React.SetStateAction<IStage | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    stages: IStage[],
    selectedStages: IStage[]
    setSelectedStages: React.Dispatch<React.SetStateAction<IStage[]>>,
}
function LeadsStageTable({ stage, selectAll, stages, setSelectAll, setStage, selectedStages, setSelectedStages }: Props) {
    const [data, setData] = useState<IStage[]>(stages)
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    useEffect(() => {
        if (data)
            setData(stages)
    }, [stages, data])
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
                                            setSelectedStages(stages)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedStages([])
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

                                Stage

                            </STableHeadCell>
                         




                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {
                            stages && stages.map((stage, index) => {
                                return (
                                    <STableRow
                                        style={{ backgroundColor: selectedStages.length > 0 && selectedStages.find((t) => t._id === stage._id) ? "lightgrey" : "white" }}
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
                                                    checked={selectedStages.length > 0 && selectedStages.find((t) => t._id === stage._id) ? true : false}
                                                    onChange={(e) => {
                                                        setStage(stage)
                                                        if (e.target.checked) {
                                                            setSelectedStages([...selectedStages, stage])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedStages((stages) => stages.filter((item) => {
                                                                return item._id !== stage._id
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

                                                            {user?.is_admin && user.assigned_permissions.includes('leadstage_delete') &&
                                                                    <Tooltip title="delete">
                                                                        <IconButton color="error"
                                                                     
                                                                            onClick={() => {
                                                                                setChoice({ type: LeadChoiceActions.delete_crm_item })
                                                                                setStage(stage)

                                                                            }}
                                                                        >
                                                                            <Delete />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                }
                                                            {user?.assigned_permissions.includes('leadstage_edit') &&<Tooltip title="edit">
                                                                    <IconButton
                                                                   
                                                                        onClick={() => {
                                                                            setStage(stage)
                                                                            setChoice({ type: LeadChoiceActions.create_or_edit_stage })
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
                                            {stage.stage}
                                        </STableCell>
                                       

                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>
                <CreateOrEditStageDialog stage={stage} />
                <DeleteCrmItemDialog stage={stage}/>
            </Box>
        </>
    )
}

export default LeadsStageTable