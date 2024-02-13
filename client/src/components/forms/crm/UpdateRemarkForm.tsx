import { Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext, useState } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { UpdateRemark } from '../../../services/LeadsServices';
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { IRemark } from '../../../types/crm.types';
import moment from 'moment'

function UpdateRemarkForm({ remark, show, setShow }: { remark: IRemark, show: boolean, setShow: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [display, setDisplay] = useState(Boolean(remark.remind_date))
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            id: string, body: {
                remark: string,
                remind_date?: string
            }
        }>
        (UpdateRemark, {
            onSuccess: () => {
                queryClient.invalidateQueries('reminderremarks')
                queryClient.invalidateQueries('remarks')
                queryClient.invalidateQueries('leads')
                queryClient.invalidateQueries('customers')
                queryClient.invalidateQueries('uselessremarks')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<{
        remark: string,
        remind_date?: string
    }>({
        initialValues: {
            remark: remark.remark,
            remind_date: moment(remark.remind_date).format("YYYY-MM-DDThh:mm")
        },
        validationSchema: Yup.object({
            remark: Yup.string().required("required field")
                .min(5, 'Must be 5 characters or more')
                .max(200, 'Must be 200 characters or less')
                .required('Required field'),
            remind_date: Yup.string().test(() => {
                if (display && !formik.values.remind_date)
                    return false
                else
                    return true
            })
        }),
        onSubmit: (values: {
            remark: string,
            lead_owners?: string[],
            remind_date?: string
        }) => {
            mutate({
                id: remark._id,
                body: {
                    remark: values.remark,
                    remind_date: values.remind_date
                }
            })
        }
    });

    useEffect(() => {
        if (isSuccess) {
            if (show)
                setShow(false)
            else
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
                <FormGroup>
                    <FormControlLabel control={<Checkbox
                        checked={Boolean(display)}
                        onChange={() => setDisplay(!display)}
                    />} label="Make Reminder" />
                </FormGroup>
                {display && < TextField
                    type="datetime-local"
                    error={
                        formik.touched.remind_date && formik.errors.remind_date ? true : false
                    }
                    id="remind_date"
                    label="Remind Date"
                    fullWidth
                    helperText={
                        formik.touched.remind_date && formik.errors.remind_date ? formik.errors.remind_date : ""
                    }
                    {...formik.getFieldProps('remind_date')}
                />}

                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Update"}
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

export default UpdateRemarkForm
