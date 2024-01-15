import { GetLeadFieldsUpdatable, UpdateLeadFieldsUpdatable } from '../../services/LeadsServices'
import { AxiosResponse } from 'axios'
import { useMutation, useQuery } from 'react-query'
import { useContext, useEffect, useState } from 'react'
import { Button, Grid, Stack, TextField, Typography } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { BackendError } from '../..'
import AlertBar from '../../components/snacks/AlertBar'
import { ILeadUpdatableField } from '../../types/crm.types'
import { UserContext } from '../../contexts/userContext'


function UpdateLeadFieldsPage() {
    const { user } = useContext(UserContext)
    const { data: updated_fields, mutate, isLoading, isSuccess } = useMutation
        <AxiosResponse<ILeadUpdatableField>, BackendError, {
            body?: {
                stages: string[],
                lead_types: string[],
                lead_sources: string[],
            }
        }>(UpdateLeadFieldsUpdatable)

    const { data, isSuccess: isFieldsSuccess } = useQuery<AxiosResponse<ILeadUpdatableField>, BackendError>("updateble-lead-leads", GetLeadFieldsUpdatable, {
        staleTime: 10000
    })

    const [fields, setFields] = useState<ILeadUpdatableField>()

    const [stage, setStage] = useState<string>()
    const [type, setType] = useState<string>()
    const [source, setSource] = useState<string>()


    useEffect(() => {
        if (isFieldsSuccess) {
            setFields(data.data)
        }
    }, [isFieldsSuccess, data])



    useEffect(() => {
        if (isSuccess) {
            setFields(updated_fields?.data)
        }
    }, [isSuccess, updated_fields])
    return (
        <>
            {isSuccess && <AlertBar message='Fields Saved Successfuly' color="success" />}

            {user?.crm_access_fields.is_editable &&
                <Button size="large" sx={{ position: 'absolute', right: 20, m: 1 }} variant='outlined' color="primary" onClick={() => {
                    mutate({ body: fields })
                }}
                    disabled={isLoading || !user?.crm_access_fields.is_deletion_allowed}
                >
                    Save
                </Button>}

            {/* grid */}
            <Grid container spacing={2} padding={2}>
                <Grid item xs={12} md={4}>
                    <Stack spacing={2} p={1} direction="column">
                        <Typography variant="button" sx={{ fontWeight: 'bold' }}>Lead Stage</Typography>
                        <Stack spacing={2} direction="row" alignItems="center">
                            <TextField size="small" placeholder='Add new stage' onChange={(e) => setStage(e.target.value)}>
                            </TextField>
                            <Button color="inherit" sx={{ borderRadius: 2 }} variant="contained" onClick={() => {
                                if (stage && fields?.stages)
                                    if (!fields.stages.includes(stage))
                                        setFields({
                                            ...fields,
                                            stages: [...fields.stages, stage]
                                        })
                            }}>+</Button>
                        </Stack>
                        {fields && fields.stages && fields.stages?.map((item) => {
                            return (
                                <Stack key={item} spacing={2} direction="row" alignItems="center">
                                    <TextField disabled defaultValue={item}>
                                    </TextField>
                                    <Button color="error"
                                        disabled={isLoading || !user?.crm_access_fields.is_deletion_allowed}
                                        sx={{ borderRadius: 2 }} variant="contained" onClick={() => {
                                            if (fields?.stages) {
                                                setFields({
                                                    ...fields,
                                                    stages: fields.stages.filter((value) => { return value !== item })
                                                })
                                            }
                                        }}>
                                        <Delete />
                                    </Button>
                                </Stack>
                            )
                        })}
                    </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Stack spacing={2} p={1} direction="column">
                        <Typography variant="button" sx={{ fontWeight: 'bold' }}>Lead Types</Typography>
                        <Stack spacing={2} direction="row" alignItems="center">
                            <TextField size="small" placeholder='Add new Lead Type'
                                onChange={(e) => setType(e.target.value)}
                            >
                            </TextField>
                            <Button color="inherit" sx={{ borderRadius: 2 }} variant="contained" onClick={() => {
                                if (type && fields?.lead_types)
                                    if (!fields?.lead_types.includes(type))
                                        setFields({
                                            ...fields,
                                            lead_types: [...fields.lead_types, type]
                                        })
                            }}>
                                +
                            </Button>
                        </Stack>
                        {fields && fields?.lead_types && fields.lead_types.map((item) => {
                            return (
                                <Stack key={item} spacing={2} direction="row" alignItems="center">
                                    <TextField disabled defaultValue={item}>
                                    </TextField>
                                    <Button color="error"
                                        disabled={isLoading || !user?.crm_access_fields.is_deletion_allowed}
                                        sx={{ borderRadius: 2 }} variant="contained" onClick={() => {
                                            if (fields?.lead_types)
                                                setFields({
                                                    ...fields,
                                                    lead_types: fields.lead_types.filter((value) => { return value !== item })
                                                })


                                        }}>
                                        <Delete />
                                    </Button>
                                </Stack>
                            )
                        })}
                    </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Stack spacing={2} p={1} direction="column">
                        <Typography variant="button" sx={{ fontWeight: 'bold' }}>Lead Sources</Typography>
                        <Stack spacing={2} direction="row" alignItems="center">
                            <TextField size="small" placeholder='Add new Lead SOurce'
                                onChange={(e) => setSource(e.target.value)}
                            >
                            </TextField>
                            <Button color="inherit" sx={{ borderRadius: 2 }} variant="contained" onClick={() => {
                                if (source && fields?.lead_sources)
                                    if (!fields?.lead_sources.includes(source))
                                        setFields({
                                            ...fields,
                                            lead_sources: [...fields.lead_sources, source]
                                        })
                            }}>+</Button>
                        </Stack>
                        {fields && fields?.lead_sources && fields.lead_sources.map((item) => {
                            return (
                                <Stack key={item} spacing={2} direction="row" alignItems="center">
                                    <TextField disabled defaultValue={item}>
                                    </TextField>
                                    <Button color="error"
                                        disabled={isLoading || !user?.crm_access_fields.is_deletion_allowed}
                                        sx={{ borderRadius: 2 }} variant="contained" onClick={() => {
                                            if (fields?.lead_sources)
                                                setFields({
                                                    ...fields,
                                                    lead_sources: fields.lead_sources.filter((value) => { return value !== item })
                                                })
                                        }}>
                                        <Delete />
                                    </Button>
                                </Stack>
                            )
                        })}
                    </Stack>
                </Grid>
            </Grid>
        </>
    )
}

export default UpdateLeadFieldsPage