import { Button,  CircularProgress,  Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import { CreateOrEditSource } from '../../../services/LeadsServices';
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import {  ILeadSource } from '../../../types/crm.types';
import * as yup from 'yup';

function CreateOrEditLeadSourceForm({ source }: { source?: ILeadSource}) {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            body: {
                source: string
            },
            id?: string
        }>
        (CreateOrEditSource, {
            onSuccess: () => {
                queryClient.invalidateQueries('crm_sources')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<{
        source: string
    }>({
        initialValues: {
            source: source ? source.source : ""
        },
        validationSchema:yup.object({
            source:yup.string().required()
        }),
        onSubmit: (values: {
            source: string,
        }) => {
            mutate({
                id:source?._id,
                body: {
                    source: values.source
                }
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
                gap={2}
                pt={2}
            >
                {/* remarks */}
                <TextField
                    required
                    error={
                        formik.touched.source && formik.errors.source ? true : false
                    }
                    autoFocus
                    id="source"
                    label="Lead Source"
                    fullWidth
                    helperText={
                        formik.touched.source && formik.errors.source ? formik.errors.source : ""
                    }
                    {...formik.getFieldProps('source')}
                />
              
               

                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : !source ? "Add Lead Source" : "Update Lead Source"}
                </Button>
            </Stack>

            {
                isError ? (
                    <>
                        {<AlertBar message={error?.response.data.message} color="error" />}
                    </>
                ) : null
            }
            {
                isSuccess ? (
                    <>
                        {!source ? <AlertBar message="new source created" color="success" /> : <AlertBar message="source updated" color="success" />}
                    </>
                ) : null
            }

        </form>
    )
}

export default CreateOrEditLeadSourceForm
