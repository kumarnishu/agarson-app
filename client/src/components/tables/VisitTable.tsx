import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import PopUp from '../popup/PopUp'
import { Chat, Check, Comment, Edit, Photo, RemoveRedEye } from '@mui/icons-material'
import { ChoiceContext, VisitChoiceActions } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'
import { IVisitReport } from '../../types/visit.types'
import EditSummaryInDialog from '../dialogs/visit/EditSummaryDialog'
import ValidateVisitDialog from '../dialogs/visit/ValidateVisitDialog'
import AddAnkitInputDialog from '../dialogs/visit/AddAnkitInputDialog'
import ViewVisitDialog from '../dialogs/visit/ViewVisitDialog'
import ViewCommentsDialog from '../dialogs/visit/ViewCommentsDialog'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import ViewVisitPhotoDialog from '../dialogs/visit/ViewVisitPhotoDialog'
import moment from 'moment'
import ViewTextDialog from '../dialogs/text/ViewTextDialog'


type Props = {
    visit: IVisitReport | undefined
    setVisit: React.Dispatch<React.SetStateAction<IVisitReport | undefined>>,
    visits: IVisitReport[],
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    selectedVisits: IVisitReport[]
    setSelectedVisits: React.Dispatch<React.SetStateAction<IVisitReport[]>>,
    setSorted: React.Dispatch<React.SetStateAction<boolean>>
    sorted: boolean
}

function VisitSTable({ visit, visits, setVisit, selectAll, sorted, setSorted, setSelectAll, selectedVisits, setSelectedVisits }: Props) {
    const [data, setData] = useState<IVisitReport[]>(visits)
    const { setChoice } = useContext(ChoiceContext)
    const [text, setText] = useState<string>()
    const { user } = useContext(UserContext)
  

    useEffect(() => {
        setData(visits)
    }, [visits])
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

                                No

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Photo

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Visit In

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Visit Out

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Party

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Station

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Geo Station

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Phone

                            </STableHeadCell>
                            <STableHeadCell style={{ color: sorted ? "red" : "", fontWeight: 'bold' }}
                                onClick={() => setSorted(!sorted)}
                            >

                                Salesman

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Summary

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Is Old ?

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Turnover

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Dealer Of

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Ankit Input

                            </STableHeadCell>





                            <STableHeadCell
                            >

                                References taken

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Reviews Taken

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Visit In Address

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Created at

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Updated at

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Created By

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Updated By

                            </STableHeadCell>

                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {

                            data && data.map((visit, index) => {
                                return (
                                    <STableRow
                                        style={{ backgroundColor: selectedVisits.length > 0 && selectedVisits.find((t) => t._id === visit._id) ? "lightgrey" : "white" }}
                                        key={index}
                                    >
                                        {selectAll ?

                                            <STableCell>


                                                <Checkbox size="small"
                                                    checked={Boolean(selectAll)}
                                                />


                                            </STableCell>
                                            :
                                            null}
                                        {!selectAll ?

                                            <STableCell>

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

                                            </STableCell>
                                            :
                                            null}
                                        <STableCell style={{ backgroundColor: Boolean(!visit.visit_validated) ? 'rgba(255,0,0,0.1)' : 'rgba(52, 200, 84, 0.6)' }}>
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

                                                                {user?.assigned_users && user?.assigned_users.find((user) => user._id === visit.created_by._id) &&
                                                                    <>

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

                                                                    </>
                                                                }
                                                            </>

                                                        }

                                                    </Stack>
                                                }


                                            />
                                        </STableCell>

                                        <STableCell>
                                            {visit.visit && visit.visit.start_day_credientials && moment(new Date(visit.visit.start_day_credientials.timestamp)).format('DD/MM/YY')}
                                        </STableCell>
                                        <STableCell>
                                            {index + 1}
                                        </STableCell>
                                        <STableCell>

                                            {visit.visit_in_photo && <IconButton
                                                onClick={() => {
                                                    setVisit(visit)
                                                    setChoice({ type: VisitChoiceActions.view_visit_photo })
                                                }}

                                            ><Photo />
                                            </IconButton>}

                                        </STableCell>
                                        <STableCell>
                                            {moment(new Date(visit.visit_in_credientials && visit.visit_in_credientials.timestamp)).format('LT')}
                                        </STableCell>

                                        <STableCell>

                                            {visit.visit_out_credentials && moment(visit.visit_out_credentials && visit.visit_out_credentials.timestamp && new Date(visit.visit_out_credentials.timestamp)).format('LT')}
                                        </STableCell>
                                        <STableCell
                                            onClick={() => {
                                                if (visit.summary) {
                                                    setText(visit.summary)
                                                }
                                            }}
                                        >
                                            {visit.party_name && visit.party_name.slice(0, 30)}{visit.is_old_party ? <span style={{ color: 'red' }}> : old</span> : ""}
                                        </STableCell>

                                        <STableCell>
                                            {visit.city}
                                        </STableCell>
                                        <STableCell title="click to view complete address" onClick={() => {
                                            setText(visit.visit_in_credientials.address)
                                        }}>
                                            {visit.real_city && visit.real_city || ""}
                                        </STableCell>
                                        <STableCell>
                                            {visit.mobile}
                                        </STableCell>
                                        <STableCell >
                                            {visit.person.username}
                                        </STableCell>

                                        <STableCell title={visit.summary} onClick={() => {
                                            if (visit.summary) {
                                                setText(visit.summary)
                                            }
                                        }}>
                                            {visit.summary && visit.summary.slice(0, 50) + "..."}
                                        </STableCell>
                                        <STableCell>
                                            {visit.is_old_party ? "Old " : "New "}
                                        </STableCell>
                                        <STableCell>
                                            {visit.turnover ? visit.turnover : ""}
                                        </STableCell>
                                        <STableCell>
                                            {visit.dealer_of ? visit.dealer_of : ""}
                                        </STableCell>

                                        <STableCell onClick={() => {
                                            if (visit.ankit_input) {
                                                setText(visit.ankit_input.input)
                                            }
                                        }}>
                                            {visit.ankit_input && visit.ankit_input.input.slice(0, 50) + "..."}

                                        </STableCell>



                                        <STableCell>
                                            {visit.refs_given ? visit.refs_given : ""}
                                        </STableCell>
                                        <STableCell>
                                            {visit.reviews_taken}
                                        </STableCell>
                                        <STableCell>
                                            {visit.visit_in_credientials && visit.visit_in_credientials.address && visit.visit_in_credientials.address}
                                        </STableCell>
                                        <STableCell>
                                            {new Date(visit.created_at).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {new Date(visit.updated_at).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {visit.created_by.username}
                                        </STableCell>
                                        <STableCell>
                                            {visit.updated_by.username}
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
                        <AddAnkitInputDialog visit={visit} />
                        <ViewVisitPhotoDialog visit={visit} />

                    </>
                    : null
            }
            {text && <ViewTextDialog wrap={true} text={text} setText={setText} />}
        </>
    )
}

export default VisitSTable