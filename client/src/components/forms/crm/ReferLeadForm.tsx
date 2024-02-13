import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup"
import {  ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { GetRefers, ReferLead } from '../../../services/LeadsServices';
import AlertBar from '../../snacks/AlertBar';
import { ILead, IReferredParty } from '../../../types/crm.types';



function ReferLeadForm({ lead }: { lead: ILead }) {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IReferredParty>, BackendError, { id: string, body: { party_id: string, remark: string } }>
        (ReferLead, {
            onSuccess: () => {
                queryClient.invalidateQueries('refers')
                queryClient.invalidateQueries('paginatedrefers')
                queryClient.invalidateQueries('leads')
                queryClient.invalidateQueries('customers')
                queryClient.invalidateQueries('uselessleads')
            }
        })
    const { data, isSuccess: isReferSuccess } = useQuery<AxiosResponse<IReferredParty[]>, BackendError>("refers", GetRefers)

    const { setChoice } = useContext(ChoiceContext)
    const [refers, setRefers] = useState<IReferredParty[]>()
    const formik = useFormik({
        initialValues: {
            remark: "",
            party_id: "",
        },
        validationSchema: Yup.object({
            remark: Yup.string()
                .required('Required field'),
            party_id: Yup.string().required("Required"),


        }),
        onSubmit: (values) => {
            mutate({
                id: lead._id,
                body: values
            })
        }
    });


    useEffect(() => {
        if (isReferSuccess) {
            setRefers(data.data)
        }
    }, [isReferSuccess, data])
    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: LeadChoiceActions.close_lead })
        }
    }, [isSuccess, setChoice])

    return (
        <form onSubmit={formik.handleSubmit}>

            <Stack
                direction="column"
                gap={2}
                pt={2}
            >
                <TextField
                    autoFocus
                    required
                    fullWidth
                    multiline
                    minRows={4}
                    error={
                        formik.touched.remark && formik.errors.remark ? true : false
                    }
                    id="remark"
                    label="Remarks"
                    helperText={
                        formik.touched.remark && formik.errors.remark ? formik.errors.remark : ""
                    }
                    {...formik.getFieldProps('remark')}
                />

                < TextField
                    select
                    required
                    SelectProps={{
                        native: true
                    }}
                    focused
                    error={
                        formik.touched.party_id && formik.errors.party_id ? true : false
                    }
                    id="party_id"
                    label="Party"
                    fullWidth
                    helperText={
                        formik.touched.party_id && formik.errors.party_id ? formik.errors.party_id : ""
                    }
                    {...formik.getFieldProps('party_id')}
                >
                    <option value="">

                    </option>
                    {
                        refers && refers.map(refer => {
                            return (<option key={refer._id} value={refer._id}>
                                {refer.name}
                            </option>)
                        })
                    }
                </TextField>

                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message="referred successfully" color="success" />
                    ) : null
                }
                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Refer"}
                </Button>
            </Stack>
        </form>
    )
}

export default ReferLeadForm
