import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import {  ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { ConvertCustomer } from '../../../services/LeadsServices';
import AlertBar from '../../snacks/AlertBar';
import { ILead, IReferredParty } from '../../../types/crm.types';



function ConvertLeadToCustomerForm({ lead }: { lead: ILead }) {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IReferredParty>, BackendError, { id: string, body: {  remark: string } }>
        (ConvertCustomer, {
            onSuccess: () => {
                queryClient.invalidateQueries('leads')
            }
        })
    const { setChoice } = useContext(ChoiceContext)
    const formik = useFormik({
        initialValues: {
            remark: ""
            
        },
        validationSchema: Yup.object({
            remark: Yup.string()
                .required('Required field')


        }),
        onSubmit: (values) => {
            mutate({
                id: lead._id,
                body: values
            })
        }
    });


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

                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message="customer converted successfully" color="success" />
                    ) : null
                }
                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Submit"}
                </Button>
            </Stack>
        </form>
    )
}

export default ConvertLeadToCustomerForm
