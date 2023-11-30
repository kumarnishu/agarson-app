import { Box, Checkbox, FormControlLabel, IconButton, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
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
import { DownloadFile } from '../../utils/DownloadFile'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'



type Props = {
    visit: IVisitReport | undefined
    setVisit: React.Dispatch<React.SetStateAction<IVisitReport | undefined>>,
    visits: IVisitReport[],
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    selectedVisits: IVisitReport[]
    setSelectedVisits: React.Dispatch<React.SetStateAction<IVisitReport[]>>,
}

function VisitSTable({ visit, visits, setVisit, selectAll, setSelectAll, selectedVisits, setSelectedVisits }: Props) {
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
                <STable
                >
                    <STableHead
                    >
                        <STableRow>
                            <STableHeadCell
                            >
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
                            </STableHeadCell>

                            {/* actions popup */}
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Actions
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Date
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Visit in Photo
                                </Stack>
                            </STableHeadCell>

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Visit In
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Visit Out
                                </Stack>
                            </STableHeadCell>

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Party
                                </Stack>
                            </STableHeadCell>

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Station
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Salesman
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Visit In Address
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Is Old ?
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Turnover
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Dealer Of
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    References taken
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Reviews Taken
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Summary
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Ankit Input
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Brijesh Input
                                </Stack>
                            </STableHeadCell>

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Created at
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Updated at
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Created By
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Updated By
                                </Stack>
                            </STableHeadCell>

                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {

                            data && data.map((visit, index) => {
                                return (
                                    <STableRow
                                        key={index}
                                    >
                                        {selectAll ?

                                            <STableCell>
                                                <Stack direction="row"
                                                    spacing={2}
                                                    justifyContent="left"
                                                    alignItems="center"
                                                >

                                                    <Checkbox size="small"
                                                        checked={Boolean(selectAll)}
                                                    />

                                                </Stack>
                                            </STableCell>
                                            :
                                            null}
                                        {!selectAll ?

                                            <STableCell>
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
                                            </STableCell>
                                            :
                                            null/* actions popup */}
                                        <STableCell style={{ backgroundColor: visit.visit_validated ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)' }} >
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
                                                                {!visit.visit_validated && user?.visit_access_fields.is_editable && <Tooltip title="validate">
                                                                    <IconButton color="error"
                                                                        onClick={() => {
                                                                            setChoice({ type: VisitChoiceActions.validate_visit })
                                                                            setVisit(visit)
                                                                        }}
                                                                    >
                                                                        <Check />
                                                                    </IconButton>
                                                                </Tooltip>}
                                                                {user?.visit_access_fields.is_editable && <Tooltip title="Edit Summary">
                                                                    <IconButton color="success"
                                                                        onClick={() => {
                                                                            setChoice({ type: VisitChoiceActions.edit_summary })
                                                                            setVisit(visit)
                                                                        }}
                                                                    >
                                                                        <Edit />
                                                                    </IconButton>
                                                                </Tooltip>}
                                                                {user?.visit_access_fields.is_editable &&
                                                                    <Tooltip title="ankit input">
                                                                        <IconButton color="primary"
                                                                            onClick={() => {
                                                                                setChoice({ type: VisitChoiceActions.add_ankit_input })
                                                                                setVisit(visit)
                                                                            }}
                                                                        >
                                                                            <Comment />
                                                                        </IconButton>
                                                                    </Tooltip>}
                                                                {user?.reports_access_fields.is_editable &&
                                                                    <Tooltip title="brijesh input">
                                                                        <IconButton color="primary"
                                                                            onClick={() => {
                                                                                setChoice({ type: VisitChoiceActions.add_brijesh_input })
                                                                                setVisit(visit)
                                                                            }}
                                                                        >
                                                                            <Comment />
                                                                        </IconButton>
                                                                    </Tooltip>}
                                                            </>

                                                        }
                                                    </Stack>
                                                } />
                                        </STableCell>





                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{new Date(visit.visit.start_day_credientials && visit.visit.start_day_credientials.timestamp).toLocaleDateString()}</Typography>
                                        </STableCell>

                                        <STableCell>
                                            <Stack gap={1}
                                                direction={'row'}
                                                justifyContent="left"
                                            >
                                                {visit.visit_in_photo && <img
                                                    onDoubleClick={() => {
                                                        if (visit.visit_in_photo && visit.visit_in_photo?.public_url) {
                                                            DownloadFile(visit.visit_in_photo?.public_url, visit.visit_in_photo?.filename)
                                                        }
                                                    }}
                                                    src={visit.visit_in_photo?.public_url} style={{ borderRadius: '5px', height: '40px' }} />}

                                            </Stack >
                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{new Date(visit.visit_in_credientials && visit.visit_in_credientials.timestamp).toLocaleTimeString()}</Typography>
                                        </STableCell>

                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{new Date(visit.visit_out_credentials && visit.visit_out_credentials.timestamp).toLocaleTimeString()}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{visit.party_name}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{visit.city}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{visit.person.username}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{visit.visit_in_credientials && visit.visit_in_credientials.address && visit.visit_in_credientials.address}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{visit.is_old_party ? "Old " : "New "}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{visit.turnover}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{visit.dealer_of}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{visit.refs_given}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{visit.reviews_taken}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography title={visit.summary && visit.summary} sx={{ textTransform: "capitalize" }} variant="body1">{visit.summary && visit.summary.slice(0, 50) + "..."}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} title={visit.ankit_input && visit.ankit_input.input} variant="body1">{visit.ankit_input && visit.ankit_input.input.slice(0, 50) + "..."}</Typography>
                                        </STableCell>

                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} title={visit.brijesh_input && visit.brijesh_input.input} variant="body1">{visit.brijesh_input && visit.brijesh_input.input.slice(0, 50) + "..."}</Typography>
                                        </STableCell>

                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{new Date(visit.created_at).toLocaleString()}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}> {new Date(visit.updated_at).toLocaleString()}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{visit.created_by.username}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{visit.updated_by.username}</Typography>
                                        </STableCell>

                                    </STableRow>
                                )
                            })

                        }
                    </STableBody>
                </STable>
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

export default VisitSTable