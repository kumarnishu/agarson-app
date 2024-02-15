import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from "../styled/STyledTable"
import ViewTextDialog from '../dialogs/text/ViewTextDialog'
import moment from 'moment'
import ToogleAttendenceDialog from '../dialogs/visit/ToogleAttendenceDialog'
import { Edit } from '@mui/icons-material'
import { ChoiceContext, VisitChoiceActions } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'
import { IVisit } from '../../types/visit.types'


type Props = {
    attendence: IVisit | undefined
    setAttendence: React.Dispatch<React.SetStateAction<IVisit | undefined>>,
    attendences: IVisit[],
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    selectedAttendeces: IVisit[]
    setSelectedAttendeces: React.Dispatch<React.SetStateAction<IVisit[]>>
}

function AttendenceTable({ attendences, attendence, selectedAttendeces, setSelectedAttendeces, setAttendence, selectAll, setSelectAll }: Props) {
    const { user } = useContext(UserContext)
    const { setChoice } = useContext(ChoiceContext)
    const [data, setData] = useState<IVisit[]>(attendences)
    const [text, setText] = useState<string>()

    useEffect(() => {
        setData(attendences)
    }, [attendences])
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
                                            setSelectedAttendeces(attendences)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedAttendeces([])
                                            setSelectAll(false)
                                        }
                                    }} />

                            </STableHeadCell>

                            {user?.visit_access_fields.is_editable && <STableHeadCell
                            >

                                Actions

                            </STableHeadCell>}
                            <STableHeadCell
                            >

                                No

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Date

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                First Visit

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                City

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Geo City

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Person

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Attendence

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Address

                            </STableHeadCell>

                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {

                            data && data.map((attendence, index) => {
                                return (
                                    <STableRow
                                        style={{ backgroundColor: selectedAttendeces.length > 0 && selectedAttendeces.find((t) => t._id === attendence._id) ? "lightgrey" : "white" }}
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
                                                        setAttendence(attendence)
                                                        if (e.target.checked) {
                                                            setSelectedAttendeces([...selectedAttendeces, attendence])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedAttendeces((attendences) => attendences.filter((item) => {
                                                                return item._id !== attendence._id
                                                            }))
                                                        }
                                                    }}
                                                />

                                            </STableCell>
                                            :
                                            null}
                                        {user?.visit_access_fields.is_editable && <STableCell>
                                            <Tooltip title="change attendence">
                                                <IconButton color="success"
                                                    onClick={() => {
                                                        setChoice({ type: VisitChoiceActions.mark_attendence })
                                                        setAttendence(attendence)
                                                    }}
                                                >
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                        </STableCell>}
                                        <STableCell>
                                            {index + 1}
                                        </STableCell>
                                        <STableCell>
                                            {attendence.created_at && moment(new Date(attendence.created_at)).format('DD/MM/YY')}
                                        </STableCell>

                                        <STableCell>
                                            {attendence.visit_reports[0] && attendence.visit_reports[0].visit_in_credientials && attendence.visit_reports[0].visit_in_credientials.timestamp && moment(new Date(attendence.visit_reports[0].visit_in_credientials.timestamp)).format('LT')}
                                        </STableCell>
                                        <STableCell>
                                            {attendence.visit_reports[0] && attendence.visit_reports[0].city}
                                        </STableCell>
                                        <STableCell>
                                            {attendence.visit_reports[0] && attendence.visit_reports[0].real_city || ""}
                                        </STableCell>
                                        <STableCell>
                                            {attendence && attendence.created_by.username}
                                        </STableCell>
                                        <STableCell>
                                            {attendence.is_present ? "Present" : ""}
                                        </STableCell>

                                        <STableCell>
                                            {attendence.visit_reports[0] && attendence.visit_reports[0].visit_in_credientials.address}
                                        </STableCell>
                                    </STableRow>
                                )
                            })

                        }
                    </STableBody>
                </STable>
            </Box >
            {attendence && <ToogleAttendenceDialog visit={attendence} />}
            {text && <ViewTextDialog text={text} setText={setText} />}
        </>
    )
}

export default AttendenceTable