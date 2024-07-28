import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import PopUp from '../../popup/PopUp'
import { UserContext } from '../../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../styled/STyledTable'
import { IShoeWeight } from '../../../types/production.types'
import ViewShoeWeightPhotoDialog from '../../dialogs/production/ViewShoeWeightPhotoDialog'
import { ChoiceContext, ProductionChoiceActions } from '../../../contexts/dialogContext'
import { Check, Edit, Photo } from '@mui/icons-material'
import ValidateShoeWeightDialog from '../../dialogs/production/ValidateShoeWeightDialog'
import UpdateShoeWeightDialog from '../../dialogs/production/UpdateShoeWeightDialog'
import moment from 'moment'
import { months } from '../../../utils/months'



type Props = {
    shoe_weight: IShoeWeight | undefined,
    setShoeWeight: React.Dispatch<React.SetStateAction<IShoeWeight | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    shoe_weights: IShoeWeight[],
    selectedShoeWeights: IShoeWeight[]
    setSelectedShoeWeights: React.Dispatch<React.SetStateAction<IShoeWeight[]>>,
}
function ShoeWeightsTable({ shoe_weight, selectAll, shoe_weights, setSelectAll, setShoeWeight, selectedShoeWeights, setSelectedShoeWeights }: Props) {
    const [data, setData] = useState<IShoeWeight[]>(shoe_weights)
    const { user } = useContext(UserContext)
    const { setChoice } = useContext(ChoiceContext)

    useEffect(() => {
        if (data)
            setData(shoe_weights)
    }, [shoe_weights, data])
    return (
        <>
            <Box sx={{
                overflow: "scroll",
                maxHeight: '80vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>
                            <STableHeadCell
                            >
                                <Checkbox
                                    indeterminate={selectAll ? true : false}
                                    checked={Boolean(selectAll)}
                                    size="small" onChange={(e) => {
                                        if (e.currentTarget.checked) {
                                            setSelectedShoeWeights(shoe_weights)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedShoeWeights([])
                                            setSelectAll(false)
                                        }
                                    }} />

                            </STableHeadCell>
                          
                                <STableHeadCell
                                >

                                    Actions

                                </STableHeadCell>
                            <STableHeadCell
                            >

                                Date

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Shoe Photo

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Machine

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Clock In

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Dye Number
                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Article

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Size

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                St.Shoe Weight

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Shoe Weight
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
                            shoe_weights && shoe_weights.map((shoe_weight, index) => {
                                return (
                                    <STableRow
                                        key={index}
                                    >
                                        {selectAll ?
                                            <STableCell>


                                                <Checkbox size="small"
                                                    checked={Boolean(selectAll)}
                                                />

                                            </STableCell>
                                            :
                                            null
                                        }
                                        {!selectAll ?
                                            <STableCell>

                                                <Checkbox size="small"
                                                    onChange={(e) => {
                                                        setShoeWeight(shoe_weight)
                                                        if (e.target.checked) {
                                                            setSelectedShoeWeights([...selectedShoeWeights, shoe_weight])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedShoeWeights((shoe_weights) => shoe_weights.filter((item) => {
                                                                return item._id !== shoe_weight._id
                                                            }))
                                                        }
                                                    }}
                                                />

                                            </STableCell>
                                            :
                                            null
                                        }
                                        {/* actions */}
                                       
                                            <STableCell style={{ backgroundColor: Boolean(!shoe_weight.is_validated) ? 'rgba(255,0,0,0.1)' : 'rgba(52, 200, 84, 0.6)' }}>
                                                <PopUp
                                                    element={
                                                        <Stack direction="row">
                                                            <>
                                                            {user?.assigned_permissions.includes('shoe_weight_edit') && <Tooltip title="edit">
                                                                    <IconButton color="info"
                                                                        onClick={() => {
                                                                            setChoice({ type: ProductionChoiceActions.update_shoe_weight })
                                                                            setShoeWeight(shoe_weight)
                                                                        }}
                                                                    >
                                                                        <Edit />
                                                                    </IconButton>
                                                                </Tooltip>}

                                                            {user?.assigned_permissions.includes('shoe_weight_edit') &&<Tooltip title="validate">
                                                                    <IconButton color="error"
                                                                        onClick={() => {
                                                                            setChoice({ type: ProductionChoiceActions.validate_weight })
                                                                            setShoeWeight(shoe_weight)
                                                                        }}
                                                                    >
                                                                        <Check />
                                                                    </IconButton>
                                                                </Tooltip>}
                                                            </>

                                                        </Stack>}
                                                />

                                            </STableCell>
                                        <STableCell>
                                            {shoe_weight.created_at && moment(new Date(shoe_weight.created_at)).format('DD/MM/YY')}
                                        </STableCell>
                                        <STableCell>

                                            {shoe_weight.shoe_photo && <IconButton
                                                disabled={!user?.assigned_permissions.includes('shoe_weight_view')}
                                                onClick={() => {
                                                    setShoeWeight(shoe_weight)
                                                    setChoice({ type: ProductionChoiceActions.view_shoe_photo })
                                                }}

                                            ><Photo />
                                            </IconButton>}

                                        </STableCell>
                                        <STableCell>
                                            {shoe_weight.machine.name}
                                        </STableCell>
                                        <STableCell>
                                            {months.find(x => x.month == shoe_weight.month) && months.find(x => x.month == shoe_weight.month)?.label}
                                        </STableCell>
                                        <STableCell>
                                            {shoe_weight.dye.dye_number}
                                        </STableCell>
                                        <STableCell>
                                            {shoe_weight.article.name}
                                        </STableCell>
                                        <STableCell>
                                            {shoe_weight.dye.size}
                                        </STableCell>
                                        <STableCell>
                                            {shoe_weight.dye&&shoe_weight.dye.stdshoe_weight}
                                        </STableCell>
                                        <STableCell>
                                            {shoe_weight.shoe_weight}
                                        </STableCell>
                                        
                                        <STableCell>
                                            {shoe_weight.created_at && new Date(shoe_weight.created_at).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {shoe_weight.created_by.username}
                                        </STableCell>
                                        <STableCell>
                                            {shoe_weight.updated_at && new Date(shoe_weight.updated_at).toLocaleString()}
                                        </STableCell>

                                        <STableCell>
                                            {shoe_weight.updated_by.username}
                                        </STableCell>

                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>

            </Box>
            {shoe_weight && <>
                <ViewShoeWeightPhotoDialog weight={shoe_weight} />
                <ValidateShoeWeightDialog weight={shoe_weight} />
                <UpdateShoeWeightDialog shoe_weight={shoe_weight} />
            </>
            }
        </>
    )
}

export default ShoeWeightsTable