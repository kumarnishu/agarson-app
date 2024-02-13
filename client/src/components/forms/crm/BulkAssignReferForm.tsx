import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { BulkAssignRefers } from '../../../services/LeadsServices';
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { IUser } from '../../../types/user.types';
import { ILead, IReferredParty } from '../../../types/crm.types';


function BulkAssignReferForm({ refers, users }: {
    refers: {
        party: IReferredParty,
        leads: ILead[]
    }[], users: IUser[]
}) {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            body: {
                refers: string[],
                lead_owners: string[]
            }
        }>
        (BulkAssignRefers, {
            onSuccess: () => {
                queryClient.invalidateQueries('refers')
                queryClient.invalidateQueries('paginatedrefers')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<{
        lead_owners?: string[],
        refers?: string[],
    }>({
        initialValues: {
            lead_owners: [''],
            refers: refers.map((refer) => {
                return refer.party._id
            }),
        },
        validationSchema: Yup.object({
            refers: Yup.array()
                .required('Required field'),
            lead_owners: Yup.array()
                .required('Required field')
        }),
        onSubmit: (values: {
            lead_owners?: string[]
            refers?: string[]
        }) => {
            mutate({
                body: {
                    lead_owners: values.lead_owners || [],
                    refers: values.refers || []
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
                        users.map((user, index) => {
                            if (!user.crm_access_fields.is_hidden)
                                return (<option key={index} value={user._id}>
                                    {user.username}
                                </option>)
                            else
                                return null
                        })
                    }
                </TextField>
                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Assign"}
                </Button>
            </Stack>
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message="assigned successfully" color="success" />
                ) : null
            }

        </form>
    )
}

export default BulkAssignReferForm
