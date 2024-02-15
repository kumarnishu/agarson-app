import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import PopUp from '../popup/PopUp'
import { UserContext } from '../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import { IProduction } from '../../types/production.types'
import { ChoiceContext, ProductionChoiceActions } from '../../contexts/dialogContext'
import { Delete, Edit } from '@mui/icons-material'
import UpdateProductionDialog from '../dialogs/production/UpdateProductionDialog'
import moment from 'moment'
import DeleteProductionDialog from '../dialogs/production/DeleteProductionDialog'


type Props = {
    production: IProduction | undefined,
    setProduction: React.Dispatch<React.SetStateAction<IProduction | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    productions: IProduction[],
    selectedProductions: IProduction[]
    setSelectedProductions: React.Dispatch<React.SetStateAction<IProduction[]>>,
}
function ProductionsTable({ production, selectAll, productions, setSelectAll, setProduction, selectedProductions, setSelectedProductions }: Props) {
    const [data, setData] = useState<IProduction[]>(productions)
    const { user } = useContext(UserContext)
    const { setChoice } = useContext(ChoiceContext)

    useEffect(() => {
        if (data)
            setData(productions)
    }, [productions, data])
    return (
        <>
            <Box sx={{
                overflow: "auto",
                height: '70vh'
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
                                            setSelectedProductions(productions)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedProductions([])
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

                                Date

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Article

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Machine

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Thekedar
                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Production

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Production Hours

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Man Power

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Small Repair

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Big Repair
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
                            productions && productions.map((production, index) => {
                                return (
                                    <STableRow
                                        style={{ backgroundColor: selectedProductions.length > 0 && selectedProductions.find((t) => t._id === production._id) ? "lightgrey" : "white" }}
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
                                                        setProduction(production)
                                                        if (e.target.checked) {
                                                            setSelectedProductions([...selectedProductions, production])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedProductions((productions) => productions.filter((item) => {
                                                                return item._id !== production._id
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
                                                                {user?.productions_access_fields.is_editable && <Tooltip title="edit">
                                                                    <IconButton color="info"
                                                                        onClick={() => {
                                                                            setChoice({ type: ProductionChoiceActions.update_production })
                                                                            setProduction(production)
                                                                        }}
                                                                    >
                                                                        <Edit />
                                                                    </IconButton>
                                                                </Tooltip>}
                                                                {user?.productions_access_fields.is_deletion_allowed && <Tooltip title="delete">
                                                                    <IconButton color="error"
                                                                        onClick={() => {
                                                                            setChoice({ type: ProductionChoiceActions.delete_production })
                                                                            setProduction(production)
                                                                        }}
                                                                    >
                                                                        <Delete />
                                                                    </IconButton>
                                                                </Tooltip>}
                                                            </>

                                                        </Stack>}
                                                />

                                            </STableCell>}
                                        <STableCell>
                                            {production.date && moment(new Date(production.date)).format('DD/MM/YY')}
                                        </STableCell>

                                        <STableCell>
                                            {production.articles.map((a) => { return a.display_name }).toString()}
                                        </STableCell>

                                        <STableCell>
                                            {production.machine.name}
                                        </STableCell>
                                        <STableCell>
                                            {production.thekedar.username}
                                        </STableCell>


                                        <STableCell>
                                            {production.production}
                                        </STableCell>
                                        <STableCell>
                                            {production.production_hours}
                                        </STableCell>
                                        <STableCell>
                                            {production.manpower}
                                        </STableCell>
                                        <STableCell>
                                            {production.small_repair}
                                        </STableCell>
                                        <STableCell>
                                            {production.big_repair}
                                        </STableCell>
                                        <STableCell>
                                            {production.created_at && new Date(production.created_at).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {production.created_by.username}
                                        </STableCell>
                                        <STableCell>
                                            {production.updated_at && new Date(production.updated_at).toLocaleString()}
                                        </STableCell>

                                        <STableCell>
                                            {production.updated_by.username}
                                        </STableCell>

                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>

            </Box>
            {production && <>
                <UpdateProductionDialog production={production} />
                <DeleteProductionDialog production={production} />
            </>
            }
        </>
    )
}

export default ProductionsTable