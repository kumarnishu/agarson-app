import { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { IUser } from '../../types/user.types'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { GetUsers } from '../../services/UserServices'
import { AccessReport } from '../../types/access.types'
import ReportsTable from '../../components/tables/AccessReportTable'
import { Box, Stack, TextField, Typography } from '@mui/material'

// react component

const accessTypes = ["users", "crm", "todo", "tasks", "visit", "checklist", "backup", "bot", "templates", "broadcast", "contacts", "greetings", "reminders", "erp passwords", "reports", "alps"]

export default function AccessReportPage() {
    const [reports, setReports] = useState<AccessReport[]>([])
    const [filteredData, setFilteredData] = useState<AccessReport[]>([])
    const [filter, setFilter] = useState<string | undefined>('users')
    const [report, setReport] = useState<AccessReport>()
    const [users, setUsers] = useState<IUser[]>([])
    const { data, isLoading } = useQuery<AxiosResponse<IUser[]>, BackendError>(["users"], async () => GetUsers())

    useEffect(() => {
        if (data) {
            setUsers(data.data)
        }
    }, [data])

    useEffect(() => {
        let result: AccessReport[] = []
        let tmpReports: AccessReport['reports'] = []
        for (let i = 0; i < accessTypes.length; i++) {
            users.forEach((user) => {
                tmpReports.push(
                    {
                        user: user,
                        is_hidden: user.user_access_fields.is_hidden,
                        is_editable: user.user_access_fields.is_editable,
                        is_deletion_allowed: user.user_access_fields.is_deletion_allowed
                    }
                )
            })
            result.push({
                accessType: accessTypes[i],
                reports: tmpReports
            })
            tmpReports = []
        }
        setFilteredData(result)
        setReports(result)
    }, [users])

    useEffect(() => {
        if (filter) {
            let searchResult = filteredData.filter((res) => {
                return res.accessType === filter
            })
            setReports(searchResult)
        }
        if (!filter)
            setReports(filteredData)

    }, [filter])
    return (
        <>
            {
                isLoading ? <TableSkeleton /> :

                    <Box sx={{ px: 2 }}>
                        {/*  table */}

                        < Stack spacing={2}
                            py={2}
                            direction="row"
                            justifyContent="space-between"
                        >
                            <Typography
                                variant={'h6'}
                                component={'h1'}
                                sx={{ pl: 1, display: 'block' }}
                            >
                                Access
                            </Typography>

                            <Stack direction="row" spacing={2}>

                                <TextField
                                    select
                                    SelectProps={{
                                        native: true,
                                    }}
                                    label="Select Feature"
                                    fullWidth
                                    size="small"
                                    onChange={(e) => {
                                        setFilter(e.currentTarget.value)
                                    }}
                                    placeholder={`${reports?.length} records...`}
                                    style={{
                                        fontSize: '1.1rem',
                                        border: '0',
                                    }}
                                    focused
                                >
                                    <option key={'00'} value={filter}>Default</option>
                                    {
                                        accessTypes.map((type, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <option value={type}>{type}</option>
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                </TextField>
                            </Stack>
                        </Stack >
                        <ReportsTable reports={reports} report={report} setReport={setReport} />
                    </Box>
            }
        </>
    )

}

