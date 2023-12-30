import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { useContext, useEffect, useState } from 'react'
import { Button, Stack, Typography } from '@mui/material'
import { BackendError } from '../..'
import { GetDepartments } from '../../services/UserServices'
import { IUserDepartment } from '../../types/user.types'
import { ChoiceContext, UserChoiceActions } from '../../contexts/dialogContext'
import CreateDepartmentDialog from '../../components/dialogs/users/CreateDepartmentDialog'


function DepartmentsPage() {
    const { setChoice } = useContext(ChoiceContext)
    const [departments, setDepartments] = useState<IUserDepartment[]>([])
    const [department, setDepartment] = useState<IUserDepartment>()
    const { data, isSuccess: isDepartmentsSuccess } = useQuery<AxiosResponse<IUserDepartment[]>, BackendError>("departments", GetDepartments)

    useEffect(() => {
        if (isDepartmentsSuccess) {
            setDepartments(data.data)
        }
    }, [isDepartmentsSuccess])

    useEffect(() => {
        setDepartment(department)
    }, [department])
    return (
        <>
            <Button onClick={() => {
                setChoice({ type: UserChoiceActions.create_department })
            }}>New Department</Button>
            <Stack>
                {departments && departments.map((d, index) => {
                    return (
                        <Typography variant="button" key={index}>
                            {d.department}
                        </Typography>
                    )
                })}
            </Stack>
            <CreateDepartmentDialog />
        </>
    )
}

export default DepartmentsPage