import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext, useState } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, CheckListChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { EditCheckList } from '../../../services/CheckListServices';
import { IUser } from '../../../types/user.types';
import { IChecklist } from '../../../types/checklist.types';

function EditCheckListForm({ checklist, users }: { checklist: IChecklist, users: IUser[] }) {
    const [personId, setPersonId] = useState<string>(checklist.owner._id)
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            id: string, body: {
                title: string;
                sheet_url: string;
                user_id: string;
                serial_no: number;
            }
        }>
        (EditCheckList, {
            onSuccess: () => {
                queryClient.invalidateQueries('checklists')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<{
        title: string;
        sheet_url: string;
        serial_no: number,
    }>({
        initialValues: {
            title: checklist.title,
            sheet_url: checklist.sheet_url,
            serial_no: checklist.serial_no || 0
        },
        validationSchema: Yup.object({
            title: Yup.string().required("required field")
                .min(5, 'Must be 5 characters or more')
                .max(200, 'Must be 200 characters or less'),
            sheet_url: Yup.string().required("required field"),
            serial_no: Yup.number().required("required")
        }),
        onSubmit: (values: {
            title: string;
            sheet_url: string,
            serial_no: number
        }) => {
            if (checklist && personId)
                mutate({
                    id: checklist._id,
                    body: {
                        title: values.title,
                        sheet_url: values.sheet_url,
                        user_id: personId,
                        serial_no: values.serial_no
                    }
                })
        }
    });

    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: CheckListChoiceActions.close_checklist })
        }
    }, [isSuccess, setChoice])
    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack
                gap={2}
                pt={2}
            >
                {/* titles */}
                <TextField
                    required
                    error={
                        formik.touched.serial_no && formik.errors.serial_no ? true : false
                    }
                    id="serial_no"
                    label="Serial Number"
                    fullWidth
                    helperText={
                        formik.touched.serial_no && formik.errors.serial_no ? formik.errors.serial_no : ""
                    }
                    {...formik.getFieldProps('serial_no')}
                />

                <TextField
                    multiline
                    minRows={4}
                    required
                    error={
                        formik.touched.title && formik.errors.title ? true : false
                    }
                    id="title"
                    label="Title"
                    fullWidth
                    helperText={
                        formik.touched.title && formik.errors.title ? formik.errors.title : ""
                    }
                    {...formik.getFieldProps('title')}
                />
                <TextField
                    multiline
                    minRows={2}
                    required
                    error={
                        formik.touched.sheet_url && formik.errors.sheet_url ? true : false
                    }
                    id="sheet_url"
                    label="Sheet url"
                    fullWidth
                    helperText={
                        formik.touched.sheet_url && formik.errors.sheet_url ? formik.errors.sheet_url : ""
                    }
                    {...formik.getFieldProps('sheet_url')}
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
                            if (!user.checklists_access_fields.is_hidden && user._id !== personId)
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
                    <AlertBar message="new checklist added" color="success" />
                ) : null
            }

        </form>
    )
}

export default EditCheckListForm
