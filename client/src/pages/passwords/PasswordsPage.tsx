import { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { IPassword } from '../../types/password.types'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import MyPasswordTable from '../../components/tables/MyPasswordTable'
import { LinearProgress, Typography } from '@mui/material'
import { GetMyPasswords } from '../../services/PasswordServices'


export default function PasswordsPage() {
    const [passwords, setPasswords] = useState<IPassword[]>([])
    const MemoData = React.useMemo(() => passwords, [passwords])
    const { data, isLoading } = useQuery<AxiosResponse<IPassword[]>, BackendError>("self_passwords", GetMyPasswords)
   

    useEffect(() => {
        if (data)
            setPasswords(data?.data)
    }, [data])

    return (
        <>

            {
                isLoading && <LinearProgress />
            }

            {/* table */}
            {isLoading && <TableSkeleton />}
            {!isLoading && passwords.length > 0 &&
                < MyPasswordTable
                    passwords={MemoData}
                />}
            {passwords.length == 0 && <Typography textAlign={'center'} color="error" fontWeight="bold" p={2} variant="subtitle1">NoPasswords Available yet !</Typography>}
        </>

    )

}

