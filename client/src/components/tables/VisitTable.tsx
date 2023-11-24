import { Box, Checkbox, FormControlLabel, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
import { useContext, useEffect, useState } from 'react'
import PopUp from '../popup/PopUp'
import { Edit } from '@mui/icons-material'
import { ChoiceContext, VisitChoiceActions } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'
import { IVisitReport } from '../../types/visit.types'
import { DownloadFile } from '../../utils/DownloadFile'



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
                    sx={{ width: "2500px" }}
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
                                    Party Details
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
                                    Visit Summary
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
                                    Extras
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
                                            <TableCell sx={{ bgcolor: visit.visit_validated ? 'green' : 'red' }} >
                                                <PopUp
                                                    element={
                                                        <Stack
                                                            direction="row" spacing={1}>
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
                                            <Stack direction="row"
                                                spacing={2}
                                                justifyContent="left"
                                                alignItems="center"
                                            >
                                                <Stack>
                                                    {visit.visit.start_day_photo && <img
                                                        onDoubleClick={() => {
                                                            if (visit.visit.start_day_photo && visit.visit.start_day_photo?.public_url) {
                                                                DownloadFile(visit.visit.start_day_photo?.public_url, visit.visit.start_day_photo?.filename)
                                                            }
                                                        }}
                                                        src={visit.visit.start_day_photo?.public_url} style={{ borderRadius: '5px', height: '100px' }} />}

                                                </Stack >
                                                <Stack>
                                                    <Typography sx={{ textTransform: "capitalize" }}>Timestamp : <b>{new Date(visit.visit.start_day_credientials.timestamp).toLocaleString()}</b></Typography>
                                                    <Typography variant="subtitle1">Coordinates: <b>{visit.visit.start_day_credientials.latitude},{visit.visit.start_day_credientials.longitude}</b></Typography>
                                                    <Typography variant="subtitle1"><b>{visit.visit.start_day_credientials.address}</b></Typography>
                                                </Stack >
                                            </Stack>
                                        </TableCell>

                                        <TableCell>
                                            <Stack direction="row"
                                                spacing={2}
                                                justifyContent="left"
                                                alignItems="center"
                                            >
                                                <Stack>
                                                    {visit.visit.end_day_photo && <img
                                                        onDoubleClick={() => {
                                                            if (visit.visit.end_day_photo && visit.visit.end_day_photo?.public_url) {
                                                                DownloadFile(visit.visit.end_day_photo?.public_url, visit.visit.end_day_photo?.filename)
                                                            }
                                                        }}
                                                        src={visit.visit.end_day_photo?.public_url} style={{ borderRadius: '5px', height: '100px' }} />}

                                                </Stack >
                                                <Stack>
                                                    <Typography sx={{ textTransform: "capitalize" }}>Timestamp : <b>{new Date(visit.visit.end_day_credentials.timestamp).toLocaleTimeString()}</b></Typography>
                                                    <Typography variant="subtitle1">Coordinates: <b>{visit.visit.end_day_credentials.latitude},{visit.visit.end_day_credentials.longitude}</b></Typography>
                                                    <Typography variant="subtitle1"><b>{visit.visit.end_day_credentials.address}</b></Typography>
                                                </Stack >
                                            </Stack>
                                        </TableCell>

                                        <TableCell>
                                            <Stack direction="row"
                                                spacing={2}
                                                justifyContent="left"
                                                alignItems="center"
                                            >
                                                <Stack>
                                                    {visit.visit_in_photo && <img
                                                        onDoubleClick={() => {
                                                            if (visit.visit_in_photo && visit.visit_in_photo?.public_url) {
                                                                DownloadFile(visit.visit_in_photo?.public_url, visit.visit_in_photo?.filename)
                                                            }
                                                        }}
                                                        src={visit.visit_in_photo?.public_url} style={{ borderRadius: '5px', height: '100px' }} />}

                                                </Stack >
                                                <Stack>
                                                    <Typography sx={{ textTransform: "capitalize" }}>Timestamp : <b>{new Date(visit.visit_in_credientials.timestamp).toLocaleTimeString()}</b></Typography>
                                                    <Typography variant="subtitle1">Coordinates: <b>{visit.visit_in_credientials.latitude},{visit.visit_in_credientials.longitude}</b></Typography>
                                                    <Typography variant="subtitle1"><b>{visit.visit_in_credientials.address}</b></Typography>
                                                </Stack >
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="column"
                                                justifyContent="left"
                                            >
                                                <Typography sx={{ textTransform: "capitalize" }}>Timestamp : <b>{new Date(visit.visit_out_credentials.timestamp).toLocaleTimeString()}</b></Typography>
                                                <Typography variant="subtitle1">Coordinates: <b>{visit.visit_out_credentials.latitude},{visit.visit_out_credentials.longitude}</b></Typography>
                                                <Typography variant="subtitle1"><b>{visit.visit_out_credentials.address}</b></Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row"
                                                spacing={2}
                                                justifyContent="left"
                                            >
                                                <Stack>
                                                    <Typography variant="subtitle1">Salesperson: <b>{visit.person.username}</b></Typography>
                                                    <Typography sx={{ textTransform: "capitalize" }}>Party : <b>{visit.party_name}</b></Typography>
                                                    <Typography sx={{ textTransform: "capitalize" }}>Station : <b>{visit.city}</b></Typography>
                                                    <Typography variant="subtitle1">Salesperson: <b>{visit.person.username}</b></Typography>
                                                    <Typography variant="subtitle1">Google Reviews: <b>{visit.reviews_taken}</b></Typography>
                                                </Stack>
                                                <Stack>
                                                    <Typography variant="subtitle1">Dealer Of: <b>{visit.dealer_of}</b></Typography>
                                                    <Typography sx={{ textTransform: "capitalize" }}>Refernces : <b>{visit.refs_given}</b></Typography>
                                                    <Typography sx={{ textTransform: "capitalize" }}>Station : <b>{visit.city}</b></Typography>
                                                    <Typography variant="subtitle1">Is Old: <b>{visit.is_old_party ? "Yes" : "Not"}</b></Typography>
                                                    <Typography variant="subtitle1">Turnover: <b>{visit.turnover}</b></Typography>
                                                </Stack>

                                            </Stack>

                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{visit.summary}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>Created At : <b>{new Date(visit.created_at).toLocaleTimeString()}</b></Typography>
                                            <Typography sx={{ textTransform: "capitalize" }}>Updated At : <b>{new Date(visit.updated_at).toLocaleTimeString()}</b></Typography>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">Created By : {visit.created_by.username}</Typography>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">Updated By : {visit.updated_by.username}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{visit.ankit_input && new Date(visit.ankit_input.timestamp).toLocaleTimeString()}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{visit.brijesh_input && new Date(visit.brijesh_input.timestamp).toLocaleTimeString()}  {visit.brijesh_input && visit.brijesh_input.input}</Typography>
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