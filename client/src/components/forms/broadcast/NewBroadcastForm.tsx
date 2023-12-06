
import { Button, CircularProgress, FormControlLabel, FormGroup, Stack, Switch, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useContext, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, TemplateChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { GetCategories, GetTemplates } from '../../../services/TemplateServices';
import { CreateBroadCast } from '../../../services/BroadCastServices';
import AlertBar from '../../snacks/AlertBar';
import { IUser } from '../../../types/user.types';
import { IMessageTemplate, ITemplateCategoryField } from '../../../types/template.types';


type TformData = {
    name: string,
    templates: string[],
    mobiles?: string[]
}

function NewBroadcastForm() {
    const [showLeads, setShowLeads] = useState(false)
    const [category, setCategory] = useState<string>()
    const { data, isLoading: isLoadingtemplates } = useQuery<AxiosResponse<IMessageTemplate[]>, BackendError>(["templates", category], async () => GetTemplates({ category: category }))
    const { data: categoryData } = useQuery<AxiosResponse<ITemplateCategoryField>, BackendError>("catgeories", GetCategories, {
        staleTime: 10000
    })

    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IUser>, BackendError, FormData>
        (CreateBroadCast, {
            onSuccess: () => {
                queryClient.invalidateQueries('broadcasts')
            }
        })

    const [extemplates, setExtemplates] = useState<IMessageTemplate[]>()
    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<TformData>({
        initialValues: {
            name: "",
            templates: [],
            mobiles: undefined
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
            mutate(formdata)
        }
    });


    useEffect(() => {
        if (data) {
            setExtemplates(data.data)
        }
    }, [data])

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setChoice({ type: TemplateChoiceActions.close_template })
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
                        size='small'
                        select
                        SelectProps={{
                            native: true,
                        }}
                        fullWidth
                        onChange={(e) => setCategory(e.currentTarget.value)}
                        focused
                        id="category"
                        label="category"

                    >

                        {
                            categoryData && categoryData.data && categoryData.data.categories.map((category, index) => {
                                return (<option key={index} value={category}>
                                    {category}
                                </option>)
                            })
                        }
                    </TextField>
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

                    {!showLeads &&
                        <TextField
                            multiline
                            minRows={4}

                            error={
                                formik.touched.mobiles && formik.errors.mobiles ? true : false
                            }
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
                            <AlertBar message="new template broadcast created" color="success" />
                        ) : null
                    }
                    <Button variant="contained" color="primary" type="submit"
                        disabled={Boolean(isLoading)}
                        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Create"}
                    </Button>
                </Stack>
            </Stack>
        </form>
    )
}

export default NewBroadcastForm