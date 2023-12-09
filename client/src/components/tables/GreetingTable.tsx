import { Delete, Edit,  Stop } from '@mui/icons-material'
import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { GreetingChoiceActions, ChoiceContext } from '../../contexts/dialogContext'
import UpdateGreetingDialog from '../dialogs/greetings/UpdateGreetingDialog'
import DeleteGreetingDialog from '../dialogs/greetings/DeleteGreetingDialog'
import PopUp from '../popup/PopUp'
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
function GreetingsTable({ greeting, selectAll, greetings, setSelectAll, setGreeting, selectedGreetings, setSelectedGreetings }: Props) {
    const [data, setData] = useState<IGreeting[]>(greetings)
    const { setChoice } = useContext(ChoiceContext)
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
                            <STableHeadCell>


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
                            {user?.greetings_access_fields.is_editable &&
                                <STableHeadCell
                                >

                                    Actions

                                </STableHeadCell>}
                            <STableHeadCell
                            >

                                Status

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Name

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Party

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Mobile

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Catgeory

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                D.O.B

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Anniversery

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Start Date

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Connected Number

                            </STableHeadCell>




                            <STableHeadCell
                            >

                                Created By

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
                                        {user?.greetings_access_fields.is_editable &&
                                            <STableCell>
                                                <PopUp element={<Stack direction="row">
                                                    <Tooltip title="edit">
                                                        <IconButton
                                                            color="success"
                                                            size="medium"
                                                            disabled={Boolean(greeting.is_active)}
                                                            onClick={() => {
                                                                setChoice({ type: GreetingChoiceActions.update_greeting })
                                                                setGreeting(greeting)
                                                            }}>
                                                            <Edit />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {user?.greetings_access_fields.is_deletion_allowed &&
                                                        <Tooltip title="delete">
                                                            <IconButton
                                                                color="error"
                                                                size="medium"
                                                                onClick={() => {

                                                                    setChoice({ type: GreetingChoiceActions.delete_greeting })
                                                                    setGreeting(greeting)
                                                                }}>
                                                                <Delete />
                                                            </IconButton>
                                                        </Tooltip>}

                                                </Stack>} />
                                            </STableCell>}

                                        <STableCell>
                                            {greeting.is_active ?
                                                <Stop /> :
                                                "stopped"
                                            }
                                        </STableCell>
                                        <STableCell>
                                            {greeting.name}
                                        </STableCell>
                                        <STableCell>
                                            {greeting.party}
                                        </STableCell>
                                        <STableCell>
                                            {greeting.mobile && greeting.mobile.toString().replace("91", "").replace("@c.us", "")}
                                        </STableCell>
                                        <STableCell>
                                            {greeting.category}
                                        </STableCell>

                                        <STableCell>
                                            {greeting.dob_time && new Date(greeting.dob_time).toLocaleDateString()}
                                        </STableCell>

                                        <STableCell>
                                            {greeting.anniversary_time && new Date(greeting.anniversary_time).toLocaleDateString()}
                                        </STableCell>
                                        <STableCell>
                                            {greeting.start_date && new Date(greeting.start_date).toLocaleString()}
                                        </STableCell>


                                        <STableCell>
                                            {greeting.connected_number && greeting.connected_number.toString().replace("91", "").replace("@c.us", "")}
                                        </STableCell>

                                      
                                        <STableCell>
                                            {greeting.created_by.username}
                                        </STableCell>
                                       

                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>
                {
                    greeting ?
                        <>
                            <UpdateGreetingDialog greeting={greeting} />
                            <DeleteGreetingDialog greeting={greeting} />
                        </> : null
                }
            </Box >
        </>
    )
}

export default GreetingsTable