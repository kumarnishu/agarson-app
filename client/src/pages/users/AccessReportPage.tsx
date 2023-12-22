import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { IUser } from '../../types/user.types'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { GetUsers } from '../../services/UserServices'
import { AccessReport } from '../../types/access.types'
import { Box } from '@mui/material'

// react component

const accessTypes = ["users", "crm", "todo", "tasks", "visit", "checklist", "backup", "bot", "templates", "broadcast", "contacts", "greetings", "reminders", "erp passwords", "reports", "alps"]
export default function AccessReportPage() {
    const [reports, setReports] = useState<AccessReport[]>([])
    const [users, setUsers] = useState<IUser[]>([])
    const { data, isLoading } = useQuery<AxiosResponse<IUser[]>, BackendError>(["users"], async () => GetUsers())

    useEffect(() => {
        if (data) {
            setUsers(data.data)
        }
    }, [data])

    useEffect(() => {
        let result = users.map((user) => {
            let reports: AccessReport['reports'] = []
            let type = ""
            accessTypes.forEach((type) => {
                type = type
                reports.push(
                    {
                        user: user,
                        is_hidden: user.user_access_fields.is_hidden,
                        is_editable: user.user_access_fields.is_editable,
                        is_deletion_allowed: user.user_access_fields.is_deletion_allowed
                    }
                )
            })
            return {
                accessType: type,
                reports: reports
            }
        })
        setReports(result)
    }, [users])

    console.log(reports)
    return (
        <>
            {/*  table */}
            {isLoading && <TableSkeleton />}
            {reports && reports.map((report, index) => {
                return (
                    <Box key={index}>
                        <h1>{report.accessType}</h1>
                        {
                            report.reports.map((repo, index) => {
                                return (
                                    <Box key={index}>
                                        <span>{repo.user.username}</span>
                                        <span>{repo.is_editable}</span>
                                        <span>{repo.is_hidden}</span>
                                        <span>{repo.is_deletion_allowed}</span>
                                    </Box>)
                            })
                        }
                    </Box>
                )
            })}

        </>

    )

}

