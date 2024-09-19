import { AxiosResponse } from 'axios'
import { useMutation, useQuery } from 'react-query'
import { useContext, useEffect, useState } from 'react'
import { Button, Stack, TextField, Typography } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { BackendError } from '../..'
import AlertBar from '../../components/snacks/AlertBar'
import { UserContext } from '../../contexts/userContext'
import { GetMachineCategories, UpdateMachineCategories } from '../../services/ProductionServices'
import { GetUserDto } from '../../dtos/users/user.dto'

export type ITemplateCategoryField = {
    _id: string,
    categories: string[],
    updated_at: Date,
    created_at: Date,
    created_by: GetUserDto,
    updated_by: GetUserDto
}

function UpdateMachineCategoriesPage() {
    const { user } = useContext(UserContext)
    const { mutate, isSuccess } = useMutation
        <AxiosResponse<ITemplateCategoryField>, BackendError, {
            body: { categories: string[] }
        }>(UpdateMachineCategories)

    const { data, isSuccess: isFieldsSuccess, refetch } = useQuery<AxiosResponse<ITemplateCategoryField>, BackendError>("catgeories", GetMachineCategories, {
        staleTime: 10000
    })


    const [fields, setFields] = useState<string[]>([])
    const [field, setField] = useState<string>()

    function handleAdd() {
        if (field) {
            let tmps = fields
            if (!tmps.find((tmp) => tmp === field)) {
                tmps?.push(field)
                setFields(tmps)
            }
            setField(undefined)
        }
    }

    useEffect(() => {
        if (isFieldsSuccess && data) {
            if (data.data && data.data.categories && data.data.categories.length > 0)
                setFields(data.data.categories)
        }
    }, [isFieldsSuccess, data])

    useEffect(() => {
        if (isSuccess) {
            refetch
        }
    }, [isSuccess])

    return (
        <>

            {isSuccess && <AlertBar message='categories Saved Successfuly' color="success" />}

            {user?.assigned_permissions.includes('machine_category_create') && <Button size="large" sx={{ position: 'absolute', right: 20, m: 1 }} variant='outlined' color="primary" onClick={() => {
                if (fields) {
                    mutate({ body: { categories: fields } })
                }
            }}

            >
                Save
            </Button>}

            {/* grid */}

            <Stack spacing={2} p={1} direction="column">
                <Typography variant="button" sx={{ fontWeight: 'bold' }}>Machine Categories</Typography>
                <Stack spacing={2} direction="row" alignItems="center">
                    <TextField size="small" placeholder='Add new catgeory'
                        onChange={(e) => setField(e.target.value)}
                    >
                    </TextField>
                    {user?.assigned_permissions.includes('machine_category_edit') && <Button color="inherit" sx={{ borderRadius: 2 }} variant="contained" onClick={() => { handleAdd() }}>
                        +
                    </Button>}
                </Stack>
                {fields && fields.map((item) => {
                    return (
                        <Stack key={item} spacing={2} direction="row" alignItems="center">
                            <TextField disabled defaultValue={item}>
                            </TextField>
                            {user?.is_admin && user?.assigned_permissions.includes('machine_category_delete') && <Button color="error"

                                sx={{ borderRadius: 2 }} variant="contained" onClick={() => {
                                    let tmps = fields.filter((field) => { return field !== item })
                                    setFields(tmps)

                                }}>
                                <Delete />
                            </Button>}
                        </Stack>
                    )
                })}
            </Stack >

        </>
    )
}

export default UpdateMachineCategoriesPage