import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext'
import PopUp from '../../popup/PopUp'
import { Delete, Edit } from '@mui/icons-material'
import { UserContext } from '../../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../styled/STyledTable'
import CreateOrEditCityDialog from '../../dialogs/crm/CreateOrEditCityDialog'
import { ICRMCity } from '../../../types/crm.types'
import DeleteCrmItemDialog from '../../dialogs/crm/DeleteCrmItemDialog'
import { is_authorized } from '../../../utils/auth'


type Props = {
    city: { city: ICRMCity, users: { _id: string, username: string }[] } | undefined,
    setCity: React.Dispatch<React.SetStateAction<{ city: ICRMCity, users: { _id: string, username: string }[] } | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    cities: { city: ICRMCity, users: { _id: string, username: string }[] }[],
    selectedCities: { city: ICRMCity, users: { _id: string, username: string }[] }[]
    setSelectedCities: React.Dispatch<React.SetStateAction<{ city: ICRMCity, users: { _id: string, username: string }[] }[]>>,
}
function LeadsCityTable({ city, selectAll, cities, setSelectAll, setCity, selectedCities, setSelectedCities }: Props) {
    const [data, setData] = useState<{ city: ICRMCity, users: { _id: string, username: string }[] }[]>(cities)
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    useEffect(() => {
        if (data)
            setData(cities)
    }, [cities, data])
    return (
        <> {cities && cities.length == 0 ? <div style={{ textAlign: "center", padding: '10px' }}>No Data Found</div>
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
                                            setSelectedCities(cities)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedCities([])
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

                                City

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Assigned Users

                            </STableHeadCell>




                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {
                            cities && cities.map((city, index) => {
                                return (
                                    <STableRow
                                        style={{ backgroundColor: selectedCities.length > 0 && selectedCities.find((t) => t.city._id === city.city._id) ? "lightgrey" : "white" }}
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
                                                        setCity(city)
                                                        if (e.target.checked) {
                                                            setSelectedCities([...selectedCities, city])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedCities((cities) => cities.filter((item) => {
                                                                return item.city._id !== city.city._id
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
                                                            {user?.is_admin &&
                                                                <Tooltip title="delete">
                                                                    <IconButton color="error"
                                                                        disabled={user?.assigned_roles && is_authorized('leads_view', user?.assigned_roles)}

                                                                        onClick={() => {
                                                                            setChoice({ type: LeadChoiceActions.delete_crm_item })
                                                                            setCity(city)

                                                                        }}
                                                                    >
                                                                        <Delete />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            }

                                                            {<Tooltip title="edit">
                                                                <IconButton
                                                                    disabled={user?.assigned_roles && is_authorized('leads_view', user?.assigned_roles)}
                                                                    onClick={() => {
                                                                        setCity(city)
                                                                        setChoice({ type: LeadChoiceActions.create_or_edit_city })
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
                                            {city.city.city}
                                        </STableCell>
                                        <STableCell>
                                            {city.users.map((u) => { return u.username }).toString()}
                                        </STableCell>

                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>
                <CreateOrEditCityDialog city={city?.city} />
                <DeleteCrmItemDialog city={city?.city} />
            </Box>}
        </>
    )
}

export default LeadsCityTable