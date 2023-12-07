import { Pause, Stop } from '@mui/icons-material'
import { Box, Checkbox } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { IGreeting } from '../../types/greeting.types'
import { UserContext } from '../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'


type Props = {
    greeting: IGreeting | undefined,
    setGreeting: React.Dispatch<React.SetStateAction<IGreeting | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    greetings: IGreeting[],
    selectedGreetings: IGreeting[]
    setSelectedGreetings: React.Dispatch<React.SetStateAction<IGreeting[]>>,
}
function GreetingsSTable({ greeting, selectAll, greetings, setSelectAll, setGreeting, selectedGreetings, setSelectedGreetings }: Props) {
    const [data, setData] = useState<IGreeting[]>(greetings)
    const { user } = useContext(UserContext)
    useEffect(() => {
        if (data)
            setData(greetings)
    }, [greetings, data])
    return (
        <>
            <Box sx={{
                overflow: "scroll",
                maxHeight: '67vh'
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
                                            setSelectedGreetings(greetings)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedGreetings([])
                                            setSelectAll(false)
                                        }
                                    }} />

                            </STableHeadCell>
                            {user?.crm_access_fields.is_editable &&
                                <STableHeadCell
                                >

                                    Actions

                                </STableHeadCell>}
                            <STableHeadCell
                            >

                                Greeting Name

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Serial Number

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Type

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Run Once

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Greeting Status

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Start Time

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Next Run Date

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Message Type

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Frequency Type

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Frequency

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Random Templates

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Connected Number

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Status Updated

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
                            greetings && greetings.map((greeting, index) => {
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
                                            null
                                        }
                                        {!selectAll ?
                                            <STableCell>

                                                <Checkbox size="small"
                                                    onChange={(e) => {
                                                        setGreeting(greeting)
                                                        if (e.target.checked) {
                                                            setSelectedGreetings([...selectedGreetings, greeting])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedGreetings((greetings) => greetings.filter((item) => {
                                                                return item._id !== greeting._id
                                                            }))
                                                        }
                                                    }}
                                                />

                                            </STableCell>
                                            :
                                            null
                                        }
                                        {/* actions */}
                                        <STableCell>
                                            action
                                        </STableCell>
                                        <STableCell>
                                            {greeting.name}
                                        </STableCell>
                                        <STableCell>
                                            {greeting.party}
                                        </STableCell>
                                        <STableCell>
                                            {greeting.category}
                                        </STableCell>
                                        <STableCell>
                                            {greeting.mobile}
                                        </STableCell>
                                        <STableCell>
                                            {greeting.is_active ?
                                                <>
                                                    {greeting.is_paused ? <Pause /> : <Stop />}
                                                </> :
                                                'Stopped'
                                            }

                                        </STableCell>


                                        <STableCell>
                                            {greeting.updated_at && new Date(greeting.updated_at).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {greeting.created_by.username}
                                        </STableCell>
                                        <STableCell>
                                            {greeting.updated_by.username}
                                        </STableCell>

                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>
                {
                    greeting ?
                        <>

                        </> : null
                }
            </Box >
        </>
    )
}

export default GreetingsSTable