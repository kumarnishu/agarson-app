import { Button, CircularProgress, FormControlLabel, FormGroup, Stack, Switch, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup"
import { BackendError } from '../../..';
import { IBroadcast, IBroadcastReport, IMessageTemplate, IUser } from '../../../types';
import { queryClient } from '../../../main';
import { GetTemplates } from '../../../services/TemplateServices';
import { GetBroadcastReports, UpdateBroadCast } from '../../../services/BroadCastServices';
import AlertBar from '../../snacks/AlertBar';
import { BroadcastChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';


type TformData = {
    name: string,
    templates: string[],
    mobiles?: string[] | string
}

function EditBroadcastForm({ broadcast }: { broadcast: IBroadcast }) {
    const { data: reports, isLoading: isReportsLoading, refetch } = useQuery<AxiosResponse<IBroadcastReport[]>, BackendError>(["broadcasts_reports", broadcast._id], async () => GetBroadcastReports(broadcast._id), { refetchOnMount: true, enabled: false })
    const [showLeads, setShowLeads] = useState(Boolean(broadcast.leads_selected))
    const [mobiles, setMobiles] = useState<string | undefined>()
    const { data, isLoading: isLoadingtemplates } = useQuery<AxiosResponse<IMessageTemplate[]>, BackendError>("templates", GetTemplates)
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IUser>, BackendError, { id: string, body: FormData }>
        (UpdateBroadCast, {
            onSuccess: () => {
                queryClient.invalidateQueries('broadcasts')
            }
        })

    const [extemplates, setExtemplates] = useState<IMessageTemplate[]>()
    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<TformData>({
        initialValues: {
            name: broadcast.name,
            templates: broadcast.templates.map((t) => { return t._id }),
            mobiles: mobiles
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Required field'),
            templates: Yup.array().required('Required field'),
            mobiles: Yup.string().test(() => {
                if (showLeads)
                    return true
                else if (!showLeads && formik.values.mobiles)
                    return true
                return false
            })
        }),
        onSubmit: (values: TformData) => {
            let formdata = new FormData()
            let Data: TformData | undefined = undefined
            if (values.mobiles && !showLeads) {
                Data = {
                    name: values.name,
                    templates: values.templates,
                    mobiles: values.mobiles.toString().replaceAll("\n", ",").split(",")
                }
            }
            else
                Data = {
                    name: values.name,
                    templates: values.templates
                }
            formdata.append("body", JSON.stringify(Data))
            mutate({ id: broadcast._id, body: formdata })
        }
    });

    useEffect(() => {
        if (data) {
            setExtemplates(data.data)
        }
    }, [data])

    useEffect(() => {
        if (!showLeads) {
            let result = reports && reports.data.map((r) => {
                return r.mobile.replace("91", "").replace("@c.us", "")
            }).toString().replaceAll(",", "\n")
            setMobiles(result)
        }
        else {
            return undefined
        }
    }, [reports])

    useEffect(() => {
        if (broadcast && !broadcast.leads_selected)
            refetch()
    }, [broadcast])
    
    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setChoice({ type: BroadcastChoiceActions.close_broadcast })
            }, 1000)
        }
    }, [isSuccess, setChoice])

    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack sx={{ direction: { xs: 'column', md: 'row' } }}>
                <Stack
                    direction="column"
                    gap={2}
                    sx={{ p: 1 }}
                >
                    <TextField

                        variant='outlined'
                        fullWidth
                        required
                        error={
                            formik.touched.name && formik.errors.name ? true : false
                        }
                        id="name"
                        label="Broadcast Name"
                        helperText={
                            formik.touched.name && formik.errors.name ? formik.errors.name : ""
                        }
                        {...formik.getFieldProps('name')}
                    />
                    < TextField
                        select
                        SelectProps={{
                            native: true,
                            multiple: true
                        }}
                        focused
                        disabled={isLoadingtemplates}
                        error={
                            formik.touched.templates && formik.errors.templates ? true : false
                        }
                        id="templates"
                        label="Templates"
                        fullWidth
                        required
                        helperText={
                            formik.touched.templates && formik.errors.templates ? formik.errors.templates : ""
                        }
                        {...formik.getFieldProps('templates')}
                    >
                        <React.Fragment>
                            {
                                extemplates && extemplates.map((item, index) => {
                                    return (
                                        <option key={index} value={item._id}>
                                            {item.name}
                                        </option>
                                    )
                                })
                            }
                        </React.Fragment>
                    </TextField>
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={showLeads} onChange={() => setShowLeads(!showLeads)} />} label="Use Leads" />
                    </FormGroup>
                    {isReportsLoading && "Loading mobiles..."}
                    {!showLeads && !isReportsLoading &&
                        <TextField
                            multiline

                            minRows={4}
                            error={
                                formik.touched.mobiles && formik.errors.mobiles ? true : false
                            }
                            defaultValue={mobiles}
                            id="mobiles"
                            label="Mobiles"
                            fullWidth
                            helperText={
                                formik.touched.mobiles && formik.errors.mobiles ? "provide correct format for mobiles" : ""
                            }
                            {...formik.getFieldProps('mobiles')}
                        />}

                    {
                        isError ? (
                            <AlertBar message={error?.response.data.message} color="error" />
                        ) : null
                    }
                    {
                        isSuccess ? (
                            <AlertBar message="updated template broadcast" color="success" />
                        ) : null
                    }
                    <Button variant="contained" color="primary" type="submit"
                        disabled={Boolean(isLoading)}
                        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Update"}
                    </Button>
                </Stack>
            </Stack>
        </form>
    )
}

export default EditBroadcastForm