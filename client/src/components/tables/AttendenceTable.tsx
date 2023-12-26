import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import PopUp from '../popup/PopUp'
import { Chat, Check, Comment, Edit, Photo, RemoveRedEye } from '@mui/icons-material'
import { ChoiceContext, VisitChoiceActions } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'
import { IVisit } from '../../types/attendence.types'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import ViewTextDialog from '../dialogs/text/ViewTextDialog'


type Props = {
    attendence: {
        date: Date;
        attendences: IVisit[];
    } | undefined
    setAttendence: React.Dispatch<React.SetStateAction<{
        date: Date;
        attendences: IVisit[];
    } | undefined>>,
    attendeces: {
        date: Date;
        attendences: IVisit[];
    }[],
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    selectedAttendeces: {
        date: Date;
        attendences: IVisit[];
    }[]
    setSelectedAttendeces: React.Dispatch<React.SetStateAction<{
        date: Date;
        attendences: IVisit[];
    }[]>>
}

function AttendenceTable({ attendeces, selectedAttendeces, setSelectedAttendeces, setAttendence, selectAll, setSelectAll }: Props) {
    const [data, setData] = useState<{
        date: Date;
        attendences: IVisit[];
    }[]>(attendeces)
    const { setChoice } = useContext(ChoiceContext)
    const [text, setText] = useState<string>()
    const { user } = useContext(UserContext)

    useEffect(() => {
        setData(attendeces)
    }, [attendeces])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                maxHeight: '63vh'
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
                                            setSelectedAttendeces(attendeces)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedAttendeces([])
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

                                Person

                            </STableHeadCell>



                            <STableHeadCell
                            >

                                Address

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

                            data && data.map((attendence, index) => {
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
                                                                return item.date !== attendence.date
                                                            }))
                                                        }
                                                    }}
                                                />

                                            </STableCell>
                                            :
                                            null}
                                        <STableCell style={{ backgroundColor: Boolean(!attendence.) ? 'rgba(255,0,0,0.1)' : 'rgba(52, 200, 84, 0.6)' }}>
                                            click
                                        </STableCell>





                                        <STableCell>
                                            {new Date(attendence.attendence.start_day_credientials && attendence.attendence.start_day_credientials.timestamp).toLocaleDateString()}
                                        </STableCell>

                                        <STableCell>

                                            {attendence.attendence_in_photo && <IconButton
                                                onClick={() => {
                                                    setAttendence(attendence)
                                                    setChoice({ type: VisitChoiceActions.view_attendence_photo })
                                                }}

                                            ><Photo />
                                            </IconButton>}

                                        </STableCell>
                                        <STableCell>
                                            {moment(new Date(attendence.attendence_in_credientials && attendence.attendence_in_credientials.timestamp)).format('LT')}
                                        </STableCell>

                                        <STableCell>

                                            {attendence.attendence_out_credentials && moment(attendence.attendence_out_credentials && attendence.attendence_out_credentials.timestamp && new Date(attendence.attendence_out_credentials.timestamp)).format('LT')}
                                        </STableCell>
                                        <STableCell
                                            onClick={() => {
                                                setText(attendence.party_name)
                                            }}
                                        >
                                            {attendence.party_name && attendence.party_name.slice(0, 30)}
                                        </STableCell>
                                        <STableCell>
                                            {attendence.city}
                                        </STableCell>
                                        <STableCell>
                                            {attendence.mobile}
                                        </STableCell>
                                        <STableCell>
                                            {attendence.is_old_party ? "Old " : "New "}
                                        </STableCell>
                                        <STableCell>
                                            {attendence.turnover ? attendence.turnover : ""}
                                        </STableCell>
                                        <STableCell>
                                            {attendence.dealer_of ? attendence.dealer_of : ""}
                                        </STableCell>
                                        <STableCell>
                                            {attendence.person.username}
                                        </STableCell>

                                        <STableCell title={attendence.summary} onClick={() => {
                                            if (attendence.summary) {
                                                setText(attendence.summary)
                                            }
                                        }}>
                                            {attendence.summary && attendence.summary.slice(0, 50) + "..."}
                                        </STableCell>
                                        <STableCell onClick={() => {
                                            if (attendence.ankit_input) {
                                                setText(attendence.ankit_input.input)
                                            }
                                        }}>
                                            {attendence.ankit_input && attendence.ankit_input.input.slice(0, 50) + "..."}

                                        </STableCell>

                                        <STableCell onClick={() => {
                                            if (attendence.brijesh_input) {
                                                setText(attendence.brijesh_input.input)
                                            }
                                        }}>
                                            {attendence.brijesh_input && attendence.brijesh_input.input.slice(0, 50) + "..."}
                                        </STableCell>

                                        <STableCell>
                                            {attendence.refs_given ? attendence.refs_given : ""}
                                        </STableCell>
                                        <STableCell>
                                            {attendence.reviews_taken}
                                        </STableCell>
                                        <STableCell>
                                            {attendence.attendence_in_credientials && attendence.attendence_in_credientials.address && attendence.attendence_in_credientials.address}
                                        </STableCell>
                                        <STableCell>
                                            {new Date(attendence.created_at).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {new Date(attendence.updated_at).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {attendence.created_by.username}
                                        </STableCell>
                                        <STableCell>
                                            {attendence.updated_by.username}
                                        </STableCell>

                                    </STableRow>
                                )
                            })

                        }
                    </STableBody>
                </STable>
            </Box >

            {text && <ViewTextDialog text={text} setText={setText} />}
        </>
    )
}

export default AttendenceTable