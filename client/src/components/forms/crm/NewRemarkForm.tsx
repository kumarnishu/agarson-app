import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { NewRemark } from '../../../services/LeadsServices';
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { IUser } from '../../../types/user.types';
import { ILead } from '../../../types/crm.types';
import { UserContext } from '../../../contexts/userContext';
import moment from 'moment'


function NewRemarkForm({ lead, users }: { lead: ILead, users: IUser[] }) {
    const { user } = useContext(UserContext)
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            id: string, body: {
                remark: string,
                lead_owners: string[],
                remind_date:string
            }
        }>
        (NewRemark, {
            onSuccess: () => {
                queryClient.invalidateQueries('leads')
                queryClient.invalidateQueries('customers')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<{
        remark: string,
        lead_owners?: string[],
        remind_date: string
    }>({
        initialValues: {
            remark: "",
            lead_owners: lead.lead_owners.map((owner) => {
                return owner._id
            }),
            remind_date: moment(new Date()).format("YYYY-MM-DDThh:mm")
        },
        validationSchema: Yup.object({
            remark: Yup.string().required("required field")
                .min(5, 'Must be 5 characters or more')
                .max(200, 'Must be 200 characters or less')
                .required('Required field'),
            lead_owners: Yup.array()
                .required('Required field'),
            remind_date: Yup.string().required('Required field'),
        }),
        onSubmit: (values: {
            remark: string,
            lead_owners?: string[],
            remind_date: string
        }) => {
            mutate({
                id: lead._id,
                body: {
                    remark: values.remark,
                    lead_owners: values.lead_owners || [],
                    remind_date: values.remind_date
                }
            })
        }
    });

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setChoice({ type: LeadChoiceActions.close_lead })
            }, 1000)
        }
    }, [isSuccess, setChoice])
    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack
                gap={2}
                pt={2}
            >
                {/* remarks */}
                <TextField

                    multiline
                    minRows={4}
                    required
                    error={
                        formik.touched.remark && formik.errors.remark ? true : false
                    }
                    id="remark"
                    label="Remark"
                    fullWidth
                    helperText={
                        formik.touched.remark && formik.errors.remark ? formik.errors.remark : ""
                    }
                    {...formik.getFieldProps('remark')}
                />
                < TextField
                    type="datetime-local"
                    error={
                        formik.touched.remind_date && formik.errors.remind_date ? true : false
                    }
                    id="remind_date"
                    label="Remind Date"
                    fullWidth
                    required
                    helperText={
                        formik.touched.remind_date && formik.errors.remind_date ? formik.errors.remind_date : ""
                    }
                    {...formik.getFieldProps('remind_date')}
                />
                {user?.is_admin &&
                    < TextField

                        select
                        SelectProps={{
                            native: true,
                            multiple: true
                        }}
                        focused
                        required
                        error={
                            formik.touched.lead_owners && formik.errors.lead_owners ? true : false
                        }
                        id="lead_owners"
                        label="Lead Owners"
                        fullWidth
                        helperText={
                            formik.touched.lead_owners && formik.errors.lead_owners ? formik.errors.lead_owners : ""
                        }
                        {...formik.getFieldProps('lead_owners')}
                    >
                        {
                            lead.lead_owners.map(owner => {
                                return (<option key={owner._id} value={owner._id}>
                                    {owner.username}
                                </option>)
                            })
                        }
                        {
                            users.map((user, index) => {
                                let leadowners = lead.lead_owners.map(owner => {
                                    return owner.username
                                })
                                if (!leadowners.includes(user.username)) {
                                    return (<option key={index} value={user._id}>
                                        {user.username}
                                    </option>)
                                }
                                else return null
                            })
                        }
                    </TextField>}
                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Add Remark"}
                </Button>
            </Stack>
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message="new remark added" color="success" />
                ) : null
            }

        </form>
    )
}

export default NewRemarkForm
