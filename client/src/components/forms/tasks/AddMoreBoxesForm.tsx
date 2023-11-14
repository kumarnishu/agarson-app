import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, TaskChoiceActions } from '../../../contexts/dialogContext';
import { AddMoreBoxes } from '../../../services/TaskServices';
import { BackendError } from '../../..';
import { ITask } from '../../../types/task.types';
import { queryClient } from '../../../main';
import moment from 'moment';
import AlertBar from '../../snacks/AlertBar';

function AddMoreBoxesForm({ task }: { task: ITask }) {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            id: string,
            body: {
                upto_date: string
            }
        }>
        (AddMoreBoxes, {
            onSuccess: () => {
                queryClient.invalidateQueries('tasks')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<{
        upto_date: string
    }>({
        initialValues: {
            upto_date: moment(new Date(task.boxes[task.boxes.length - 1].date)).format("YYYY-MM-DD")
        },
        validationSchema: Yup.object({
            upto_date: Yup.string().required("required field").test("upto_date", "provide valid last date", () => {
                if (new Date(formik.values.upto_date) <= new Date())
                    return false
                else
                    return true
            })
        }),
        onSubmit: (values: {
            upto_date: string
        }) => {
            if (task) {
                mutate({
                    id: task._id,
                    body: { upto_date: values.upto_date }
                })
            }
        }
    });

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setChoice({ type: TaskChoiceActions.close_task })
            }, 1000)
        }
    }, [isSuccess, setChoice])

    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack
                gap={2}
                pt={2}
            >
                < TextField
                    type="date"
                    error={
                        formik.touched.upto_date && formik.errors.upto_date ? true : false
                    }
                    id="upto_date"
                    label="Last Date"
                    fullWidth
                    helperText={
                        formik.touched.upto_date && formik.errors.upto_date ? formik.errors.upto_date : ""
                    }
                    {...formik.getFieldProps('upto_date')}
                />


                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Submit"}
                </Button>
            </Stack>
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message="success" color="success" />
                ) : null
            }

        </form>
    )
}

export default AddMoreBoxesForm
