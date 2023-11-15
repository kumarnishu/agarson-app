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
import { EditTask } from '../../../services/TaskServices';
import { IUser } from '../../../types/user.types';
import { ITask } from '../../../types/task.types';

function EditTaskForm({ task, users }: { task: ITask, users: IUser[] }) {
    const [personId, setPersonId] = useState<string>(task.person._id)
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            id: string, body: {
                task_description: string;
                user_id: string
            }
        }>
        (EditTask, {
            onSuccess: () => {
                queryClient.invalidateQueries('tasks')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<{
        task_description: string;
        user_id: string
    }>({
        initialValues: {
            task_description: task.task_description,
            user_id: task.person._id
        },
        validationSchema: Yup.object({
            task_description: Yup.string().required("required field")
                .min(5, 'Must be 5 characters or more')
                .max(200, 'Must be 200 characters or less')
        }),
        onSubmit: (values: {
            task_description: string;
            user_id: string
        }) => {
            if (task && personId)
                mutate({
                    id: task._id,
                    body: {
                        task_description: values.task_description,
                        user_id: personId
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
                    {
                        users.map(user => {
                            if (user._id === personId)
                                return (<option key={user._id} value={user._id}>
                                    {user.username}
                                </option>)
                        })
                    }
                    {
                        users.map(user => {
                            if (user._id !== personId)
                                return (<option key={user._id} value={user._id}>
                                    {user.username}
                                </option>)
                        })
                    }
                </TextField>


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
                    <AlertBar message="new task added" color="success" />
                ) : null
            }

        </form>
    )
}

export default EditTaskForm
