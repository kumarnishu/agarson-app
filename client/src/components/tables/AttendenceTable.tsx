import { Box, Checkbox } from '@mui/material'
import { useEffect, useState } from 'react'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from "../styled/STyledTable"
import ViewTextDialog from '../dialogs/text/ViewTextDialog'
import { IVisit } from '../../types/visit.types'


type Props = {
    attendence: {
        _id: string,
        date: Date,
        visits: IVisit[];
    } | undefined
    setAttendence: React.Dispatch<React.SetStateAction<{
        _id: string,
        date: Date,
        visits: IVisit[];
    } | undefined>>,
    attendences: {
        _id: string,
        date: Date,
        visits: IVisit[];
    }[],
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    selectedAttendeces: {
        _id: string,
        date: Date,
        visits: IVisit[]
    }[]
    setSelectedAttendeces: React.Dispatch<React.SetStateAction<{
        _id: string,
        date: Date,
        visits: IVisit[]
    }[]>>
}

function AttendenceTable({ attendences, selectedAttendeces, setSelectedAttendeces, setAttendence, selectAll, setSelectAll }: Props) {
    const [data, setData] = useState<{
        _id: string,
        date: Date,
        visits: IVisit[];
    }[]>(attendences)
    const [text, setText] = useState<string>()

    useEffect(() => {
        setData(attendences)
    }, [attendences])

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
                                            setSelectedAttendeces(attendences)
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
                                                                return item._id !== attendence._id
                                                            }))
                                                        }
                                                    }}
                                                />

                                            </STableCell>
                                            :
                                            null}
                                        <STableCell>
                                            {attendence.date && new Date(attendence.date).toLocaleDateString()}
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