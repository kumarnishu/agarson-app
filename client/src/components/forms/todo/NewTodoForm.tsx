import { Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Stack, TextField, Typography } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup"
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { CreateTodo } from '../../../services/TodoServices';
import { ITodo } from '../../../types/todo.types';
import React, { useState } from 'react';
import moment from 'moment';
import { GetUsers } from '../../../services/UserServices';
import { IUser } from '../../../types/user.types';
import SelectContactsInput from './SelectContactsInput';
import { Add } from '@mui/icons-material';


type TformData = {
    serial_no: number,
    title: string,
    subtitle: string,
    category: string,
    contacts: {
        mobile: string,
        name: string,
        is_sent: boolean,
        is_completed: false
    }[],
    run_once: boolean,
    frequency_type: string,
    frequency_value: string,
    start_date: string,
    connected_user: string
}

function NewTodoForm() {
    const [contact, setContact] = useState<{
        mobile: string,
        name: string,
        is_sent: boolean,
        is_completed: false
    }>()
    const [contacts, setContacts] = useState<{
        mobile: string,
        name: string,
        is_sent: boolean,
        is_completed: false
    }[]>([])
    const { data: usersData } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())

    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<ITodo>, BackendError, TformData>
        (CreateTodo, {
            onSuccess: () => {
                queryClient.invalidateQueries('todos')
            }
        })

    const formik = useFormik<TformData>({
        initialValues: {
            serial_no: 1,
            title: "",
            subtitle: "",
            category: "urgent",
            run_once: false,
            contacts: [],
            frequency_type: 'days',
            frequency_value: '1',
            start_date: moment(new Date()).format("YYYY-MM-DDThh:mm"),
            connected_user: ''
        },
        validationSchema: Yup.object({
            serial_no: Yup.number(),
            title: Yup.string().required('required field'),
            subtitle: Yup.string().required('required field'),
            category: Yup.string().required('required field'),
            contacts: Yup.array().required('required field'),
            run_once: Yup.boolean(),
            frequency_type: Yup.string().required('required field'),
            frequency_value: Yup.string().required('required field'),
            start_date: Yup.string().required('required field'),
            connected_user: Yup.string().required('required field')

        }),
        onSubmit: (values: TformData) => {
            mutate({
                ...values,
                contacts: contacts
            })
        }
    });

    function handleAdd() {
        if (contact) {
            let tmpcontacts = contacts
            if (!tmpcontacts.find((c) => c.mobile === contact.mobile)) {
                tmpcontacts.push(contact)
            }
            setContacts(tmpcontacts)
            setContact(undefined)
        }
    }
    console.log(contacts)
    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack sx={{ direction: { xs: 'column', md: 'row' } }}>
                <Stack
                    direction="column"
                    gap={2}
                    sx={{ p: 1 }}
                >
                    <TextField
                        type='number'
                        variant='outlined'
                        fullWidth
                        required
                        error={
                            formik.touched.serial_no && formik.errors.serial_no ? true : false
                        }
                        id="serial_no"
                        label="Serial No"
                        helperText={
                            formik.touched.serial_no && formik.errors.serial_no ? formik.errors.serial_no : ""
                        }
                        {...formik.getFieldProps('serial_no')}
                    />
                    <TextField

                        variant='outlined'
                        fullWidth
                        required
                        error={
                            formik.touched.title && formik.errors.title ? true : false
                        }
                        id="title"
                        label="Title"
                        helperText={
                            formik.touched.title && formik.errors.title ? formik.errors.title : ""
                        }
                        {...formik.getFieldProps('title')}
                    />
                    <TextField

                        variant='outlined'
                        fullWidth
                        required
                        error={
                            formik.touched.subtitle && formik.errors.subtitle ? true : false
                        }
                        id="subtitle"
                        label="SubTitle"
                        helperText={
                            formik.touched.subtitle && formik.errors.subtitle ? formik.errors.subtitle : ""
                        }
                        {...formik.getFieldProps('subtitle')}
                    />
                    <TextField
                        variant='outlined'
                        fullWidth
                        required
                        error={
                            formik.touched.category && formik.errors.category ? true : false
                        }
                        id="category"
                        label="Category"
                        helperText={
                            formik.touched.category && formik.errors.category ? formik.errors.category : ""
                        }
                        {...formik.getFieldProps('category')}
                    />

                    <TextField
                        fullWidth
                        required
                        focused
                        select
                        SelectProps={{
                            native: true,
                        }}
                        error={
                            formik.touched.connected_user && formik.errors.connected_user ? true : false
                        }
                        id="whatsapp_users"
                        label="Whatsapp User"
                        helperText={
                            formik.touched.connected_user && formik.errors.connected_user ? formik.errors.connected_user : ""
                        }
                        {...formik.getFieldProps('connected_user')}
                    >
                        {
                            usersData && usersData.data.map(user => {
                                return (
                                    <React.Fragment key={user._id}>
                                        {user.connected_number && <option value={user._id}>
                                            {`${user.username} :: ${String(user.connected_number).split(":")[0].replace("91", "").toString()}`}
                                        </option>}
                                    </React.Fragment>
                                )
                            })
                        }
                    </TextField>

                    < TextField
                        type="datetime-local"
                        error={
                            formik.touched.start_date && formik.errors.start_date ? true : false
                        }
                        id="start_date"
                        label="Start Date&Time"
                        fullWidth
                        required
                        helperText={
                            formik.touched.start_date && formik.errors.start_date ? formik.errors.start_date : "select date and time to send messasge after that"
                        }
                        {...formik.getFieldProps('start_date')}
                    />

                    <FormGroup sx={{ pl: 0.5 }} title={"If selected todo will run only once at the start time and after that stopped permanently"}>
                        <FormControlLabel control={<Checkbox
                            checked={Boolean(formik.values.run_once)}
                            {...formik.getFieldProps('run_once')}
                        />} label="Run Once" />
                        <Typography sx={{ pb: 1, color: 'grey' }} variant='caption'>If selected todo will run only once at the start time and after that stopped permanently</Typography>
                    </FormGroup>

                    <TextField
                        fullWidth
                        select
                        SelectProps={{
                            native: true
                        }}
                        required
                        error={
                            formik.touched.frequency_type && formik.errors.frequency_type ? true : false
                        }
                        disabled={formik.values.run_once}
                        id="frequency_type"
                        label="Frequency Type"
                        helperText={
                            formik.touched.frequency_type && formik.errors.frequency_type ? formik.errors.frequency_type : "month,hours and minutes will be choosen from start date and time"
                        }
                        {...formik.getFieldProps('frequency_type')}
                    >

                        <option value={undefined}>
                        </option>
                        <option value="minutes">
                            minutes
                        </option>
                        <option value="hours">
                            hours
                        </option>
                        <option value="days">
                            days
                        </option>
                        <option value="months">
                            months
                        </option>
                        <option value="weekdays">
                            weekdays
                        </option>
                        <option value="monthdays">
                            monthdays
                        </option>
                        <option value="yeardays">
                            yeardays
                        </option>
                    </TextField>

                    <TextField
                        fullWidth
                        required
                        error={
                            formik.touched.frequency_value && formik.errors.frequency_value ? true : false
                        }
                        id="frequency_value"
                        label="Frequency"
                        disabled={formik.values.run_once}
                        helperText={formik.values.frequency_type === "months" ? "type frequency in format 2-1,3,4 here 2 is month frequency and 1,3,4 dates" :
                            formik.touched.frequency_value && formik.errors.frequency_value ? formik.errors.frequency_value : "for weekday, monthdays and yeardays use comma seperator"
                        }
                        {...formik.getFieldProps('frequency_value')}
                    />

                    {
                        isError ? (
                            <AlertBar message={error?.response.data.message} color="error" />
                        ) : null
                    }
                    {
                        isSuccess ? (
                            <AlertBar message="new todo created" color="success" />
                        ) : null
                    }
                    <Button variant="contained" color="primary" type="submit"
                        disabled={Boolean(isLoading)}
                        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Create"}
                    </Button>
                    < Stack direction="row" spacing={2}>
                        <TextField
                            fullWidth
                            onChange={(e) => {
                                if (e.target.value) {
                                    setContact({
                                        name: "",
                                        mobile: e.target.value,
                                        is_completed: false,
                                        is_sent: false
                                    })
                                }
                            }}
                            placeholder='Add new contact'
                            style={{
                                fontSize: '1.1rem',
                                border: '0',
                            }}
                        />
                        <Button variant="contained" onClick={handleAdd}><Add /></Button>
                    </Stack >
                    <SelectContactsInput contact={contact} contacts={contacts} setContact={setContact} setContacts={setContacts} />
                </Stack>
            </Stack>
        </form >
    )
}

export default NewTodoForm