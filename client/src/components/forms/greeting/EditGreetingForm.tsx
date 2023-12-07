import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { IUser } from '../../../types/user.types';
import { UpdateGreeting } from '../../../services/GreetingServices';
import { IGreeting } from '../../../types/greeting.types';
import moment from 'moment'
import { ChoiceContext, GreetingChoiceActions } from '../../../contexts/dialogContext';
import { useContext, useEffect } from 'react';

type TformData = {
    name: string;
    party: string;
    category: string;
    mobile: string;
    dob_time: string;
    anniversary_time: string;
}

function EditGreetingForm({ greeting }: { greeting: IGreeting }) {
    const { setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IUser>, BackendError, { id: string, body: TformData }>
        (UpdateGreeting, {
            onSuccess: () => {
                queryClient.invalidateQueries('greetings')
            }
        })

    const formik = useFormik<TformData>({
        initialValues: {
            name: greeting.name,
            party: greeting.party,
            category: greeting.category,
            mobile: greeting.mobile,
            dob_time: moment(greeting.dob_time).format("YYYY-MM-DD"),
            anniversary_time: moment(greeting.anniversary_time).format("YYYY-MM-DD")
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Required field'),
            party: Yup.string()
                .required('Required field'),
            category: Yup.string()
                .required('Required field'),
            mobile: Yup.string()
                .required('Required field'),
            dob_time: Yup.string()
                .required('Required field'),
            anniversary_time: Yup.string()
                .required('Required field'),
        }),
        onSubmit: (values: TformData) => {
            mutate({ id: greeting._id, body: values })
        }
    });
    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: GreetingChoiceActions.close_greeting })
            }, 1000)
    }, [setChoice, isSuccess])

    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack sx={{ direction: { xs: 'column', md: 'row' } }}>
                <Stack
                    direction="column"
                    gap={2}
                    sx={{ p: 1 }}
                >
                    <TextField
                        fullWidth
                        required
                        error={
                            formik.touched.name && formik.errors.name ? true : false
                        }
                        id="name"
                        label="Name"
                        helperText={
                            formik.touched.name && formik.errors.name ? formik.errors.name : ""
                        }
                        {...formik.getFieldProps('name')}
                    />
                    <TextField
                        fullWidth
                        required
                        error={
                            formik.touched.party && formik.errors.party ? true : false
                        }
                        id="party"
                        label="Party"
                        helperText={
                            formik.touched.party && formik.errors.party ? formik.errors.party : ""
                        }
                        {...formik.getFieldProps('party')}
                    />
                    <TextField
                        fullWidth
                        required
                        error={
                            formik.touched.mobile && formik.errors.mobile ? true : false
                        }
                        id="mobile"
                        label="Mobile"
                        helperText={
                            formik.touched.mobile && formik.errors.mobile ? formik.errors.mobile : ""
                        }
                        {...formik.getFieldProps('mobile')}
                    />
                    <TextField
                        fullWidth
                        required
                        select
                        SelectProps={{
                            native: true
                        }}
                        focused
                        error={
                            formik.touched.category && formik.errors.category ? true : false
                        }
                        id="category"
                        label="Category"
                        helperText={
                            formik.touched.category && formik.errors.category ? formik.errors.category : ""
                        }
                        {...formik.getFieldProps('category')}
                    >
                        <option value="party">party</option>
                        <option value="staff">staff</option>
                        <option value="others">others</option>
                    </TextField>
                    <TextField
                        fullWidth
                        type="date"
                        required
                        error={
                            formik.touched.dob_time && formik.errors.dob_time ? true : false
                        }
                        id="dob_time"
                        label="Name"
                        helperText={
                            formik.touched.dob_time && formik.errors.dob_time ? formik.errors.dob_time : ""
                        }
                        {...formik.getFieldProps('dob_time')}
                    />
                    <TextField
                        fullWidth
                        type="date"
                        required
                        error={
                            formik.touched.anniversary_time && formik.errors.anniversary_time ? true : false
                        }
                        id="anniversary_time"
                        label="Name"
                        helperText={
                            formik.touched.anniversary_time && formik.errors.anniversary_time ? formik.errors.anniversary_time : ""
                        }
                        {...formik.getFieldProps('anniversary_time')}
                    />
                    {
                        isError ? (
                            <AlertBar message={error?.response.data.message} color="error" />
                        ) : null
                    }
                    {
                        isSuccess ? (
                            <AlertBar message="updated" color="success" />
                        ) : null
                    }
                    <Button variant="contained" color="primary" type="submit"
                        disabled={Boolean(isLoading)}
                        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Create"}
                    </Button>
                </Stack>
            </Stack>
        </form >
    )
}

export default EditGreetingForm