import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, CheckListChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { CreateOrEditCheckList, GetAllCheckCategories } from '../../../services/CheckListServices';
import { GetUserDto } from '../../../dtos/users/user.dto';
import { GetUsers } from '../../../services/UserServices';
import { CreateOrEditChecklistDto, GetChecklistDto } from '../../../dtos/checklist/checklist.dto';
import { DropDownDto } from '../../../dtos/common/dropdown.dto';
import moment from 'moment';

function CreateorEditCheckListForm({ checklist }: { checklist?: GetChecklistDto }) {
    const [categories, setCategories] = useState<DropDownDto[]>([])
    const [users, setUsers] = useState<GetUserDto[]>([])
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, { body: CreateOrEditChecklistDto, id?: string }>
        (CreateOrEditCheckList, {
            onSuccess: () => {
                queryClient.invalidateQueries('checklists')
            }
        })


    const { data: userData, isSuccess: userSuccess } = useQuery<AxiosResponse<GetUserDto[]>, BackendError>("users", async () => GetUsers({ hidden: 'false', show_assigned_only: true }))
    const { data: categoriesData, isSuccess: categorySuccess } = useQuery<AxiosResponse<DropDownDto[]>, BackendError>("check_categories", GetAllCheckCategories)
    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<CreateOrEditChecklistDto>({
        initialValues: {
            category: checklist ? checklist.category.id : "",
            work_title: checklist ? checklist.work_title : "",
            details1: checklist ? checklist.details1 : "",
            end_date: checklist ? moment(checklist.end_date).format("YYYY-MM-DD")  : "",
            details2: checklist ? checklist.details2 : "",
            user_id: checklist ? checklist.user.id : "",
            frequency: checklist ? checklist.frequency : "daily",
        },
        validationSchema: Yup.object({
            work_title: Yup.string().required("required field")
                .min(5, 'Must be 5 characters or more')
                .max(200, 'Must be 200 characters or less'),
            category: Yup.string().required("required field"),
            frequency: Yup.string().required("required"),
            user_id: Yup.string().required("required"),
            end_date: Yup.date().required("required")
        }),
        onSubmit: (values: CreateOrEditChecklistDto) => {
            if (checklist)
                mutate({
                    id: checklist._id,
                    body: values
                })
            else {
                mutate({
                    id: undefined,
                    body: values
                })
            }
        }
    });

    useEffect(() => {
        if (userSuccess && userData) {
            setUsers(userData.data)
        }
    }, [userData])

    useEffect(() => {
        if (categorySuccess && categoriesData) {
            setCategories(categoriesData.data)
        }
    }, [categoriesData])

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
                    required
                    multiline
                    minRows={2}
                    error={
                        formik.touched.details1 && formik.errors.details1 ? true : false
                    }
                    id="details1"
                    label="Detail1"
                    fullWidth
                    helperText={
                        formik.touched.details1 && formik.errors.details1 ? formik.errors.details1 : ""
                    }
                    {...formik.getFieldProps('details1')}
                />
                <TextField
                    required
                    multiline
                    minRows={2}
                    error={
                        formik.touched.details2 && formik.errors.details2 ? true : false
                    }
                    id="details2"
                    label="Details 2"
                    fullWidth
                    helperText={
                        formik.touched.details2 && formik.errors.details2 ? formik.errors.details2 : ""
                    }
                    {...formik.getFieldProps('details2')}
                />

                < TextField
                    select
                    SelectProps={{
                        native: true
                    }}
                    focused
                    error={
                        formik.touched.frequency && formik.errors.frequency ? true : false
                    }
                    id="frequency"
                    disabled={checklist ? true : false}
                    label="Frequency"
                    fullWidth
                    helperText={
                        formik.touched.frequency && formik.errors.frequency ? formik.errors.frequency : ""
                    }
                    {...formik.getFieldProps('frequency')}
                >
                    <option key={1} value="daily">
                        Daily
                    </option>

                    <option key={2} value='weekly'>
                        Weekly
                    </option>

                </TextField>
                < TextField
                    select
                    SelectProps={{
                        native: true
                    }}
                    focused
                    error={
                        formik.touched.category && formik.errors.category ? true : false
                    }
                    id="category"
                    disabled={checklist ? true : false}
                    label="Category"
                    fullWidth
                    helperText={
                        formik.touched.category && formik.errors.category ? formik.errors.category : ""
                    }
                    {...formik.getFieldProps('category')}
                >
                    <option key={0} value={undefined}>
                        Select Category
                    </option>
                    {
                        categories.map(cat => {

                            return (<option key={cat.id} value={cat.id}>
                                {cat.label}
                            </option>)
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
                        formik.touched.user_id && formik.errors.user_id ? true : false
                    }
                    id="user_id"
                    label="Person"
                    fullWidth
                    helperText={
                        formik.touched.user_id && formik.errors.user_id ? formik.errors.user_id : ""
                    }
                    {...formik.getFieldProps('user_id')}
                >
                    <option key={0} value={undefined}>
                        Select Person
                    </option>
                    {
                        users.map(user => {

                            return (<option key={user._id} value={user._id}>
                                {user.username}
                            </option>)
                        })
                    }
                </TextField>
                < TextField
                    type="date"
                    error={
                        formik.touched.end_date && formik.errors.end_date ? true : false
                    }
                    focused
                    disabled={checklist ? true : false}
                    id="end_date"
                    label="End Date"
                    fullWidth
                    helperText={
                        formik.touched.end_date && formik.errors.end_date ? formik.errors.end_date : ""
                    }
                    {...formik.getFieldProps('end_date')}
                />


                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : checklist ? 'Update' : 'Create'}
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

export default CreateorEditCheckListForm
