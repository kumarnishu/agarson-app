import { Box, Checkbox, FormControlLabel, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
import { useContext, useEffect, useState } from 'react'
import PopUp from '../popup/PopUp'
import { Chat, Check, Comment, Edit, RemoveRedEye } from '@mui/icons-material'
import { ChoiceContext, VisitChoiceActions } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'
import { IVisitReport } from '../../types/visit.types'
import EditSummaryInDialog from '../dialogs/visit/EditSummaryDialog'
import ValidateVisitDialog from '../dialogs/visit/ValidateVisitDialog'
import AddAnkitInputDialog from '../dialogs/visit/AddAnkitInputDialog'
import AddBrijeshInputDialog from '../dialogs/visit/AddBrjeshInputDialog'
import ViewVisitDialog from '../dialogs/visit/ViewVisitDialog'
import ViewCommentsDialog from '../dialogs/visit/ViewCommentsDialog'



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
                    sx={{ width: "3500px" }}
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
                                    Date
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
                                    Salesman
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
                                    Visit In Address
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
                                    Is Old ?
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
                                    References taken
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
                                    Reviews Taken
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
                                    Ankit Input
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
                                    Brijesh Input
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
                                    Created at
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
                                    Updated at
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
                                            <TableCell sx={{ bgcolor: visit.visit_validated ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)' }} >
                                                <PopUp
                                                    element={
                                                        <Stack
                                                            direction="row" spacing={1}>
                                                            {
                                                                <>
                                                                    <Tooltip title="Visit Details ">
                                                                        <IconButton color="success"
                                                                            onClick={() => {
                                                                                setChoice({ type: VisitChoiceActions.view_visit })
                                                                                setVisit(visit)
                                                                            }}
                                                                        >
                                                                            <RemoveRedEye />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="View Comments ">
                                                                        <IconButton color="success"
                                                                            onClick={() => {
                                                                                setChoice({ type: VisitChoiceActions.view_comments })
                                                                                setVisit(visit)
                                                                            }}
                                                                        >
                                                                            <Chat />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    {!visit.visit_validated && <Tooltip title="validate">
                                                                        <IconButton color="error"
                                                                            onClick={() => {
                                                                                setChoice({ type: VisitChoiceActions.validate_visit })
                                                                                setVisit(visit)
                                                                            }}
                                                                        >
                                                                            <Check />
                                                                        </IconButton>
                                                                    </Tooltip>}
                                                                    <Tooltip title="Edit Summary">
                                                                        <IconButton color="success"
                                                                            onClick={() => {
                                                                                setChoice({ type: VisitChoiceActions.edit_summary })
                                                                                setVisit(visit)
                                                                            }}
                                                                        >
                                                                            <Edit />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="ankit input">
                                                                        <IconButton color="primary"
                                                                            onClick={() => {
                                                                                setChoice({ type: VisitChoiceActions.add_ankit_input })
                                                                                setVisit(visit)
                                                                            }}
                                                                        >
                                                                            <Comment />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </>

                                                            }
                                                        </Stack>
                                                    } />
                                            </TableCell>}
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{new Date(visit.visit.start_day_credientials&&visit.visit.start_day_credientials.timestamp).toLocaleDateString()}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{new Date(visit.visit_in_credientials&&visit.visit_in_credientials.timestamp).toLocaleTimeString()}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{new Date(visit.visit_out_credentials&&visit.visit_out_credentials.timestamp).toLocaleTimeString()}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{visit.party_name}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{visit.city}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{visit.person.username}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{visit.visit_in_credientials && visit.visit_in_credientials.address && visit.visit_in_credientials.address}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{visit.is_old_party ? "Old " : "New "}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{visit.turnover}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{visit.dealer_of}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{visit.refs_given}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{visit.reviews_taken}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{visit.ankit_input && visit.ankit_input.input}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{visit.brijesh_input && visit.brijesh_input.input}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{new Date(visit.created_at).toLocaleString()}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}> {new Date(visit.updated_at).toLocaleString()}</Typography>
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
                        <ViewVisitDialog visit={visit} />
                        <ViewCommentsDialog visit={visit} />
                        <ValidateVisitDialog visit={visit} />
                        <EditSummaryInDialog visit={visit} />
                        <AddBrijeshInputDialog visit={visit} />
                        <AddAnkitInputDialog visit={visit} />
                    </>
                    : null
            }
        </>
    )
}

export default VisitTable