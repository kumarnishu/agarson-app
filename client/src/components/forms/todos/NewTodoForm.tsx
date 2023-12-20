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
import { CreateTodo } from '../../../services/TodoServices';

function NewtodoCreateTodoForm({ users }: { users: IUser[] }) {
    const [personId, setPersonId] = useState<string>()
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            id: string, body: {
                work_title: string, work_description: string, category: string
            }
        }>
        (CreateTodo, {
            onSuccess: () => {
                queryClient.invalidateQueries('todos')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<{
        work_title: string, work_description: string, category: string
    }>({
        initialValues: {
            work_title: "",
            work_description: "",
            category: ""
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
            work_title: string; work_description: string; category: string
        }) => {
            if (personId)
                mutate({
                    id: personId,
                    body: {
                        work_title: values.work_title, work_description: values.work_description, category: values.category
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
                    <option key={'00'} >
                    </option>
                    {
                        users.map(user => {
                            return (<option key={user._id} value={user._id}>
                                {user.username}
                            </option>)
                        })
                    }
                </TextField>

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
                    <AlertBar message="new todo added" color="success" />
                ) : null
            }

        </form>
    )
}

export default NewtodoCreateTodoForm
