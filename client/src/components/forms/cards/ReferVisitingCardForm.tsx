import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { ReferVisitingCard } from '../../../services/LeadsServices';
import AlertBar from '../../snacks/AlertBar';
import { IReferredParty } from '../../../types/crm.types';
import { IVisitingCard } from '../../../types/visiting_card.types';


function ReferVisitingCardForm({ card, refers }: { card: IVisitingCard, refers: IReferredParty[] }) {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IReferredParty>, BackendError, { id: string, body: { refer: string, comment: string } }>
        (ReferVisitingCard, {
            onSuccess: () => {
                queryClient.invalidateQueries('cards')
            }
        })


    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik({
        initialValues: {
            refer: "",
            comment: "",
        },
        validationSchema: Yup.object({
            refer: Yup.string()
                .required('Required field'),
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

                < TextField
                    select
                    required
                    SelectProps={{
                        native: true
                    }}
                    focused
                    error={
                        formik.touched.refer && formik.errors.refer ? true : false
                    }
                    id="refer"
                    label="Party"
                    fullWidth
                    helperText={
                        formik.touched.refer && formik.errors.refer ? formik.errors.refer : ""
                    }
                    {...formik.getFieldProps('refer')}
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

export default ReferVisitingCardForm
