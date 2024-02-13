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
import { AddTodoReply } from '../../../services/TodoServices';
import { ITodo } from '../../../types/todo.types';

function AddTodoReplyForm({ todo }: { todo: ITodo }) {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            body: { reply: string },
            id: string
        }>
        (AddTodoReply, {
            onSuccess: () => {
                queryClient.invalidateQueries('todos')
                queryClient.invalidateQueries('my_todos')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<{
        reply: string
    }>({
        initialValues: {
            reply: ""
        },
        validationSchema: Yup.object({
            reply: Yup.string().required("required field"),

        }),
        onSubmit: (values: {
            reply: string
        }) => {
            if (todo)
                mutate({
                    id: todo._id,
                    body: {
                        reply: values.reply
                    }
                })
        }
    });

    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: TodoChoiceActions.close_todo })
        }
    }, [isSuccess, setChoice])
    
    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack
                gap={2}
                pt={2}
            >
                < TextField
                    multiline
                    rows={4}
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
                    <AlertBar message="added reply" color="success" />
                ) : null
            }

        </form>
    )
}

export default AddTodoReplyForm
