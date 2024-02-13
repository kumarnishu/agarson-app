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
import moment from 'moment'
import { CreateCheckList } from '../../../services/CheckListServices';
import { IUser } from '../../../types/user.types';

function NewCheckListForm({ users }: { users: IUser[] }) {
    const [personId, setPersonId] = useState<string>()
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            id: string, body: {
                title: string;
                sheet_url: string;
                upto_date: string;
                start_date: string;
            }
        }>
        (CreateCheckList, {
            onSuccess: () => {
                queryClient.invalidateQueries('checklists')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<{
        title: string;
        sheet_url: string;
        upto_date: string;
        start_date: string;
    }>({
        initialValues: {
            title: "",
            sheet_url: "",
            start_date: moment(new Date()).format("YYYY-MM-DD"),
            upto_date: moment(new Date().setDate(30)).format("YYYY-MM-DD"),
        },
        validationSchema: Yup.object({
            title: Yup.string().required("required field")
                .min(5, 'Must be 5 characters or more')
                .max(200, 'Must be 200 characters or less')
                .required('Required field'),
            sheet_url: Yup.string().required("required field"),
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
            title: string;
            sheet_url: string;
            upto_date: string;
            start_date: string;
        }) => {
            if (personId)
                mutate({
                    id: personId,
                    body: {
                        title: values.title,
                        upto_date: values.upto_date,
                        start_date: values.start_date,
                        sheet_url: values.sheet_url,
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
                    multiline
                    minRows={4}
                    required
                    error={
                        formik.touched.title && formik.errors.title ? true : false
                    }
                    id="title"
                    label="Checklist Title"
                    fullWidth
                    helperText={
                        formik.touched.title && formik.errors.title ? formik.errors.title : ""
                    }
                    {...formik.getFieldProps('title')}
                />
                < TextField
                    focused
                    error={
                        formik.touched.sheet_url && formik.errors.sheet_url ? true : false
                    }
                    id="sheet_url"
                    label="Sheet url"
                    fullWidth
                    required
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
                            if (!user.checklists_access_fields.is_hidden)
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
                    <AlertBar message="new checklist added" color="success" />
                ) : null
            }

        </form>
    )
}

export default NewCheckListForm
