import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, TodoChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { UpdateTodoStatus } from '../../../services/TodoServices';
import { ITodo } from '../../../types/todo.types';

function UpdateTodoStatusForm({ todo }: { todo: ITodo }) {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            body: { status: string, reply: string },
            id: string
        }>
        (UpdateTodoStatus, {
            onSuccess: () => {
                queryClient.invalidateQueries('todos')
                queryClient.invalidateQueries('self_todos')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<{
        status: string, reply: string
    }>({
        initialValues: {
            status: todo.status, reply: todo.replies && todo.replies.length > 0 && todo.replies[todo.replies.length - 1].reply || ""
        },
        validationSchema: Yup.object({
            status: Yup.string().required("required field"),
            reply: Yup.string().required("required field"),

        }),
        onSubmit: (values: {
            status: string,
            reply: string
        }) => {
            if (todo)
                mutate({
                    id: todo._id,
                    body: {
                        status: values.status,
                        reply: values.reply
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
                < TextField
                    focused
                    error={
                        formik.touched.reply && formik.errors.reply ? true : false
                    }
                    id="reply"
                    label="Reply"
                    fullWidth
                    helperText={
                        formik.touched.reply && formik.errors.reply ? formik.errors.reply : ""
                    }
                    {...formik.getFieldProps('reply')}
                >

                </TextField>

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
                    <AlertBar message="updated status" color="success" />
                ) : null
            }

        </form>
    )
}

export default UpdateTodoStatusForm
