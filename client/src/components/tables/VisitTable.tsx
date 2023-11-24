import { Box, Checkbox, FormControlLabel, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
import { useContext, useEffect, useState } from 'react'
import PopUp from '../popup/PopUp'
import { Edit } from '@mui/icons-material'
import { ChoiceContext, VisitChoiceActions } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'
import { IVisitReport } from '../../types/visit.types'



type Props = {
    visit: IVisitReport | undefined
    setVisit: React.Dispatch<React.SetStateAction<IVisitReport | undefined>>,
    visits: IVisitReport[],
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    selectedVisits: IVisitReport[]
    setSelectedVisits: React.Dispatch<React.SetStateAction<IVisitReport[]>>,
}

function VisitTable({ visit, visits, setVisit, selectAll, setSelectAll, selectedVisits, setSelectedVisits }: Props) {
    const [data, setData] = useState<IVisitReport[]>(visits)
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    useEffect(() => {
        setData(visits)
    }, [visits])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                minHeight: '53.5vh'
            }}>
                <Table
                    stickyHeader
                    sx={{ width: "2000px" }}
                    size="small">
                    <TableHead
                    >
                        <TableRow>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <FormControlLabel sx={{ fontSize: 12 }} control={
                                        <Checkbox
                                            indeterminate={selectAll ? true : false}
                                            checked={Boolean(selectAll)}
                                            size="small" onChange={(e) => {
                                                if (e.currentTarget.checked) {
                                                    setSelectedVisits(visits)
                                                    setSelectAll(true)
                                                }
                                                if (!e.currentTarget.checked) {
                                                    setSelectedVisits([])
                                                    setSelectAll(false)
                                                }
                                            }} />}
                                        label=""
                                    />
                                </Stack>
                            </TableCell>

                            {/* actions popup */}
                            {user?.user_access_fields.is_editable && <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Actions
                                </Stack>
                            </TableCell>}




                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Start Day
                                </Stack>
                            </TableCell>

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Visit In
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Visit Out
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    End Day
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Party
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Station
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Visit In
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Visit Out
                                </Stack>
                            </TableCell>
                          
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Is Old
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Turnover
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Dealer Of
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    References
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Reviews
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Created At
                                </Stack>
                            </TableCell>

                            {/* updated at */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Updated At
                                </Stack>
                            </TableCell>

                            {/* created by */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Created By
                                </Stack>
                            </TableCell>

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Updated By
                                </Stack>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {

                            data && data.map((visit, index) => {
                                return (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            '&:nth-of-type(odd)': { bgcolor: color1 },
                                            '&:nth-of-type(even)': { bgcolor: color2 },
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer' }
                                        }}>
                                        {selectAll ?

                                            <TableCell>
                                                <Stack direction="row"
                                                    spacing={2}
                                                    justifyContent="left"
                                                    alignItems="center"
                                                >

                                                    <Checkbox size="small"
                                                        checked={Boolean(selectAll)}
                                                    />

                                                </Stack>
                                            </TableCell>
                                            :
                                            null}
                                        {!selectAll ?

                                            <TableCell>
                                                <Stack direction="row"
                                                    spacing={2}
                                                    justifyContent="left"
                                                    alignItems="center"
                                                >
                                                    <Checkbox size="small"
                                                        onChange={(e) => {
                                                            setVisit(visit)
                                                            if (e.target.checked) {
                                                                setSelectedVisits([...selectedVisits, visit])
                                                            }
                                                            if (!e.target.checked) {
                                                                setSelectedVisits((visits) => visits.filter((item) => {
                                                                    return item._id !== visit._id
                                                                }))
                                                            }
                                                        }}
                                                    />
                                                </Stack>
                                            </TableCell>
                                            :
                                            null/* actions popup */}
                                        {user?.user_access_fields.is_editable &&
                                            <TableCell>
                                                <PopUp
                                                    element={
                                                        <Stack direction="row" spacing={1}>
                                                            {

                                                                <>
                                                                    <Tooltip title="Edit">
                                                                        <IconButton color="info"
                                                                            onClick={() => {
                                                                                setChoice({ type: VisitChoiceActions.edit_visit })
                                                                                setVisit(visit)
                                                                            }}
                                                                        >
                                                                            <Edit />
                                                                        </IconButton>
                                                                    </Tooltip>


                                                                </>

                                                            }
                                                        </Stack>
                                                    } />
                                            </TableCell>}



                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{new Date(visit.visit.start_day_credientials.timestamp).toLocaleString()}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(visit.created_at).toLocaleTimeString()}</Typography>

                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(visit.updated_at).toLocaleTimeString()}</Typography>

                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{visit.created_by.username}</Typography>

                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{visit.updated_by.username}</Typography>

                                        </TableCell>

                                    </TableRow>
                                )
                            })

                        }
                    </TableBody>
                </Table>
            </Box >
            {
                visit ?
                    <>

                    </>
                    : null
            }
        </>
    )
}

export default VisitTable