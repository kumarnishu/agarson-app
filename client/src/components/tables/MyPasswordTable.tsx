import { Box, IconButton, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'
import { IPassword } from '../../types/password.types'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import { RemoveRedEye } from '@mui/icons-material'


type Props = {
    passwords: IPassword[]
}

function MyPasswordTable({ passwords }: Props) {
    const [data, setData] = useState<IPassword[]>(passwords)
    useEffect(() => {
        setData(passwords)
    }, [passwords])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                height: '80vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>
                            <STableHeadCell
                            >

                                Actions

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                State

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Username

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Password

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Persons

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Timestamp

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Created By

                            </STableHeadCell>
                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {

                            data && data.map((password, index) => {
                                return (
                                    <STableRow
                                        key={index}
                                    >
                                        <STableCell>
                                            <Tooltip title="view">
                                                <IconButton color="error"
                                                    onClick={() => {
                                                        alert("Switch to tenant and type agarson in the given input")
                                                        window.open('http://103.11.85.217:8081/', '_blank')
                                                    }}
                                                >
                                                    <RemoveRedEye />
                                                </IconButton>
                                            </Tooltip>
                                        </STableCell>

                                        <STableCell>
                                            {password.state}

                                        </STableCell>
                                        <STableCell>
                                            {password.username}

                                        </STableCell>
                                        <STableCell>
                                            {password.password}
                                        </STableCell>
                                        <STableCell>
                                            {password.persons && password.persons.map((per) => { return per.username }).toString()}
                                        </STableCell>

                                        <STableCell>
                                            {new Date(password.created_at).toLocaleString()}

                                        </STableCell>
                                        <STableCell>
                                            {password.created_by && password.created_by.username}

                                        </STableCell>
                                    </STableRow>
                                )
                            })

                        }
                    </STableBody>
                </STable>
            </Box >

        </>
    )
}

export default MyPasswordTable