import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { IReferredParty } from '../../../types/crm.types';
import { IVisitingCard } from '../../../types/visiting_card.types';
import { AddCommentsToVisitingCard } from '../../../services/LeadsServices';


function AddCommentTocardForm({ card }: { card: IVisitingCard}) {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IReferredParty>, BackendError, { id: string, body: {  comment: string } }>
        (AddCommentsToVisitingCard, {
            onSuccess: () => {
                queryClient.invalidateQueries('cards')
            }
        })


    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik({
        initialValues: {
            comment: "",
        },
        validationSchema: Yup.object({
           
            comment: Yup.string().required("Required"),


        }),
        onSubmit: (values) => {
            mutate({
                id: card._id,
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
                        formik.touched.comment && formik.errors.comment ? true : false
                    }
                    id="comment"
                    label="Comments"
                    helperText={
                        formik.touched.comment && formik.errors.comment ? formik.errors.comment : ""
                    }
                    {...formik.getFieldProps('comment')}
                />

              
                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message="comment added" color="success" />
                    ) : null
                }
                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Add Comment"}
                </Button>
            </Stack>
        </form>
    )
}

export default AddCommentTocardForm
