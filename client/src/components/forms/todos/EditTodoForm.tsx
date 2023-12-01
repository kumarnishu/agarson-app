import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext, useState } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, TodoChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { IUser } from '../../../types/user.types';
import { UpdateTodo } from '../../../services/TodoServices';
import { ITodo } from '../../../types/todo.types';

function EditTodoForm({ todo, users }: { todo: ITodo, users: IUser[] }) {
    const [personId, setPersonId] = useState<string>(todo.person._id)
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            body: { work_title: string, category: string, work_description: string, user_id: string, status: string },
            id: string
        }>
        (UpdateTodo, {
            onSuccess: () => {
                queryClient.invalidateQueries('todos')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<{
        work_title: string, category: string, work_description: string, user_id: string, status: string
    }>({
        initialValues: {
            work_title: todo.work_title, category: todo.category, work_description: todo.work_description, user_id: personId, status: todo.status
        },
        validationSchema: Yup.object({
            work_title: Yup.string().required("required field")
                .min(5, 'Must be 5 characters or more')
                .max(200, 'Must be 200 characters or less'),
            work_description: Yup.string().required("required field")
                .min(5, 'Must be 5 characters or more')
                .max(200, 'Must be 200 characters or less'),
            category: Yup.string(),
        }),
        onSubmit: (values: {
            work_title: string, category: string, work_description: string, user_id: string, status: string
        }) => {
            if (todo && personId)
                mutate({
                    id: todo._id,
                    body: {
                        work_title: values.work_title, category: values.category, work_description: values.work_description, user_id: personId, status: values.status
                    }
                })
        }
    });

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setChoice({ type: TodoChoiceActions.close_todo })
            }, 1000)
        }
    }, [isSuccess, setChoice])
    console.log(formik.values)
    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack
                gap={2}
                pt={2}
            >
                {/* todo_descriptions */}
                <TextField
                    required
                    error={
                        formik.touched.work_title && formik.errors.work_title ? true : false
                    }
                    id="work_title"
                    label="Work Title"
                    fullWidth
                    helperText={
                        formik.touched.work_title && formik.errors.work_title ? formik.errors.work_title : ""
                    }
                    {...formik.getFieldProps('work_title')}
                />
                <TextField
                    multiline
                    minRows={2}
                    required
                    error={
                        formik.touched.work_description && formik.errors.work_description ? true : false
                    }
                    id="work_description"
                    label="Work Description"
                    fullWidth
                    helperText={
                        formik.touched.work_description && formik.errors.work_description ? formik.errors.work_description : ""
                    }
                    {...formik.getFieldProps('work_description')}
                />
                <TextField
                    error={
                        formik.touched.category && formik.errors.category ? true : false
                    }
                    id="category"
                    label="Category"
                    fullWidth
                    helperText={
                        formik.touched.category && formik.errors.category ? formik.errors.category : ""
                    }
                    {...formik.getFieldProps('category')}
                />
                < TextField

                    select


                    SelectProps={{
                        native: true
                    }}
                    focused
                    error={
                        formik.touched.status && formik.errors.status ? true : false
                    }
                    id="status"
                    label="Status"
                    fullWidth
                    helperText={
                        formik.touched.status && formik.errors.status ? formik.errors.status : ""
                    }
                    {...formik.getFieldProps('status')}
                >
                    <option value={todo.status}>
                        {todo.status}
                    </option>
                    {
                        ["pending", "hold", "done"].map((status, index) => {
                            let statuses = [todo.status]
                            if (!statuses.includes(status)) {
                                return (<option key={index} value={status}>
                                    {status}
                                </option>)
                            }
                            else return null
                        })
                    }
                </TextField>

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
                    <AlertBar message="new todo added" color="success" />
                ) : null
            }

        </form>
    )
}

export default EditTodoForm
