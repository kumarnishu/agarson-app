import { AxiosResponse } from 'axios'
import { useMutation, useQuery } from 'react-query'
import { useContext, useEffect, useState } from 'react'
import { Button, Stack, TextField, Typography } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { BackendError } from '../..'
import AlertBar from '../../components/snacks/AlertBar'
import { UserContext } from '../../contexts/userContext'
import { ITemplateCategoryField } from '../../types/template.types'
import { GetMachineCategories, UpdateMachineCategories } from '../../services/ProductionServices'


function UpdateMachineCategoriesPage() {
    const { user } = useContext(UserContext)
    const { mutate, isLoading, isSuccess } = useMutation
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

            {user?.productions_access_fields.is_editable && <Button size="large" sx={{ position: 'absolute', right: 20, m: 1 }} variant='outlined' color="primary" onClick={() => {
                if (fields) {
                    mutate({ body: { categories: fields } })
                }
            }}
                disabled={isLoading || !user?.productions_access_fields.is_deletion_allowed}
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
                    <Button color="inherit" sx={{ borderRadius: 2 }} variant="contained" onClick={() => { handleAdd() }}>
                        +
                    </Button>
                </Stack>
                {fields && fields.map((item) => {
                    return (
                        <Stack key={item} spacing={2} direction="row" alignItems="center">
                            <TextField disabled defaultValue={item}>
                            </TextField>
                            <Button color="error"
                                disabled={isLoading || !user?.productions_access_fields.is_deletion_allowed}
                                sx={{ borderRadius: 2 }} variant="contained" onClick={() => {
                                    let tmps = fields.filter((field) => { return field !== item })
                                    setFields(tmps)

                                }}>
                                <Delete />
                            </Button>
                        </Stack>
                    )
                })}
            </Stack >

        </>
    )
}

export default UpdateMachineCategoriesPage