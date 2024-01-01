import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext, useState } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, TaskChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import moment from 'moment'
import { CreateTask } from '../../../services/TaskServices';
import { IUser } from '../../../types/user.types';

function NewTaskForm({ users }: { users: IUser[] }) {
    const [personId, setPersonId] = useState<string>()
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            id: string, body: {
                task_description: string;
                frequency_type: string;
                frequency_value?: number;
                upto_date: string;
                start_date: string;
            }
        }>
        (CreateTask, {
            onSuccess: () => {
                queryClient.invalidateQueries('tasks')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<{
        task_description: string;
        frequency_type: string;
        frequency_value?: number;
        upto_date: string;
        start_date: string;
    }>({
        initialValues: {
            task_description: "",
            upto_date: moment(new Date().setDate(30)).format("YYYY-MM-DD"),
            start_date: moment(new Date()).format("YYYY-MM-DD"),
            frequency_type: "daily",
        },
        validationSchema: Yup.object({
            task_description: Yup.string().required("required field")
                .min(5, 'Must be 5 characters or more')
                .max(200, 'Must be 200 characters or less')
                .required('Required field'),
            frequency_type: Yup.string().required("required field"),
            frequency_value: Yup.string().test("frequency_value", "must provide a value", () => {
                if (formik.values.frequency_value && formik.values.frequency_value <= 0 && formik.values.frequency_type === "custom")
                    return false
                else
                    return true
            }),
            upto_date: Yup.string().required("required field").test("upto_date", "provide valid last date", () => {
                if (new Date(formik.values.upto_date) <= new Date())
                    return false
                else
                    return true
            }),
            start_date: Yup.string().required("required field").test("start_date", "provide valid start date", () => {
                if (new Date(formik.values.start_date) >= new Date(formik.values.upto_date))
                    return false
                else
                    return true
            })
        }),
        onSubmit: (values: {
            task_description: string;
            frequency_type: string;
            frequency_value?: number;
            upto_date: string;
            start_date: string;
        }) => {
            if (personId)
                mutate({
                    id: personId,
                    body: {
                        task_description: values.task_description,
                        upto_date: values.upto_date,
                        start_date: values.start_date,
                        frequency_type: values.frequency_type,
                        frequency_value: values?.frequency_value
                    }
                })
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
                {/* task_descriptions */}
                <TextField
                    multiline
                    minRows={4}
                    required
                    error={
                        formik.touched.task_description && formik.errors.task_description ? true : false
                    }
                    id="task_description"
                    label="Task Description"
                    fullWidth
                    helperText={
                        formik.touched.task_description && formik.errors.task_description ? formik.errors.task_description : ""
                    }
                    {...formik.getFieldProps('task_description')}
                />
                < TextField
                    select
                    SelectProps={{
                        native: true
                    }}
                    focused
                    error={
                        formik.touched.frequency_type && formik.errors.frequency_type ? true : false
                    }
                    id="frequency_type"
                    label="Frequency"
                    fullWidth
                    required
                    helperText={
                        formik.touched.frequency_type && formik.errors.frequency_type ? formik.errors.frequency_type : ""
                    }
                    {...formik.getFieldProps('frequency_type')}
                >
                    <option value="daily" >
                        daily
                    </option>
                    <option value="weekly" >
                        weekly
                    </option>
                    <option value="monthly" >
                        monthly
                    </option>
                    <option value="custom" >
                        custom days
                    </option>
                </TextField>


                {formik.values.frequency_type === "custom" && <TextField
                    type="number"
                    required
                    error={
                        formik.touched.frequency_value && formik.errors.frequency_value ? true : false
                    }
                    id="frequency_value"
                    label="Enter Days"
                    fullWidth
                    helperText={
                        formik.touched.frequency_value && formik.errors.frequency_value ? formik.errors.frequency_value : ""
                    }
                    {...formik.getFieldProps('frequency_value')}
                />}
                < TextField
                    select
                    SelectProps={{
                        native: true
                    }}
                    error={
                        !personId ? true : false
                    }
                    onChange={(e) => setPersonId(e.currentTarget.value)}
                    id="person"
                    label="Person"
                    fullWidth
                    required
                    helperText={
                        !personId ? "person is required" : "Choose a person"
                    }
                >
                    <option key={'00'} value={undefined}>

                    </option>
                    {
                        users.map((user, index) => {
                            if (!user.tasks_access_fields.is_hidden)
                                return (<option key={index} value={user._id}>
                                    {user.username}
                                </option>)
                            else
                                return null
                        })
                    }
                </TextField>
                < TextField
                    type="date"
                    error={
                        formik.touched.start_date && formik.errors.start_date ? true : false
                    }
                    id="start_date"
                    label="Start Date"
                    fullWidth
                    helperText={
                        formik.touched.start_date && formik.errors.start_date ? formik.errors.start_date : ""
                    }
                    {...formik.getFieldProps('start_date')}
                />
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
                    <AlertBar message="new task added" color="success" />
                ) : null
            }

        </form>
    )
}

export default NewTaskForm
