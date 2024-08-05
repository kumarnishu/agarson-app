import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext,  ProductionChoiceActions } from '../../../contexts/dialogContext'
import PopUp from '../../popup/PopUp'
import { Delete, Edit } from '@mui/icons-material'
import { UserContext } from '../../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../styled/STyledTable'
import { IDyeLocation } from '../../../types/production.types'
import CreateOrEditDyeLocationDialog from '../../dialogs/production/CreateOrEditDyeLocationDialog'
import DeleteDyeLocationDialog from '../../dialogs/production/DeleteDyeLocationDialog'


type Props = {
    location: IDyeLocation | undefined,
    setDyeLocation: React.Dispatch<React.SetStateAction<IDyeLocation | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    locations: IDyeLocation[],
    selectedDyeLocations: IDyeLocation[]
    setSelectedDyeLocations: React.Dispatch<React.SetStateAction<IDyeLocation[]>>,
}
function DyeLocationTable({ location, selectAll, locations, setSelectAll, setDyeLocation, selectedDyeLocations, setSelectedDyeLocations }: Props) {
    const [data, setData] = useState<IDyeLocation[]>(locations)
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    useEffect(() => {
        if (data)
            setData(locations)
    }, [locations, data])
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
                                            setSelectedDyeLocations(locations)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedDyeLocations([])
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

                             Name

                            </STableHeadCell>
                         
                            <STableHeadCell style={{ width: '200px' }}
                            >

                                Display Name

                            </STableHeadCell>




                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {
                            locations && locations.map((location, index) => {
                                return (
                                    <STableRow
                                        style={{ backgroundColor: selectedDyeLocations.length > 0 && selectedDyeLocations.find((t) => t._id === location._id) ? "lightgrey" : "white" }}
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
                                                    checked={selectedDyeLocations.length > 0 && selectedDyeLocations.find((t) => t._id === location._id) ? true : false}
                                                    onChange={(e) => {
                                                        setDyeLocation(location)
                                                        if (e.target.checked) {
                                                            setSelectedDyeLocations([...selectedDyeLocations, location])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedDyeLocations((locations) => locations.filter((item) => {
                                                                return item._id !== location._id
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

                                                            {user?.is_admin && user.assigned_permissions.includes('dye_location_delete') &&
                                                                    <Tooltip title="delete">
                                                                        <IconButton color="error"
                                                                     
                                                                            onClick={() => {
                                                                                setDyeLocation(location)
                                                                                setChoice({ type: ProductionChoiceActions.delete_dye_location })

                                                                            }}
                                                                        >
                                                                            <Delete />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                }
                                                            {user?.assigned_permissions.includes('dye_location_edit') &&<Tooltip title="edit">
                                                                    <IconButton
                                                                   
                                                                        onClick={() => {
                                                                            setDyeLocation(location)
                                                                            setChoice({ type: ProductionChoiceActions.create_or_edit_location })
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
                                            {location.name}
                                        </STableCell>
                                        <STableCell style={{ width: '200px' }}>
                                            {location.display_name}
                                        </STableCell>

                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>
                <CreateOrEditDyeLocationDialog location={location} />
                {location &&<DeleteDyeLocationDialog location={location}/>}
            </Box>
        </>
    )
}

export default DyeLocationTable