import { Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Stack, TextField, Typography } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup"
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { UpdateTodo } from '../../../services/TodoServices';
import { ITodo } from '../../../types/todo.types';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { GetUsers } from '../../../services/UserServices';
import { IUser } from '../../../types/user.types';
import SelectContactsInput from './SelectContactsInput';

type TformData = {
  serial_no: number,
  title: string,
  subtitle: string,
  category: string,
  category2: string,
  contacts: {
    mobile: string,
    name: string,
    is_sent: boolean,
    status: string
  }[],
  run_once: boolean,
  frequency_type: string,
  frequency_value: string,
  start_date: string,
  connected_user: string
}

function UpdateTodoForm({ todo }: { todo: ITodo }) {
  const [users, setUsers] = useState<IUser[]>([])
  const [contacts, setContacts] = useState<{
    mobile: string,
    name: string,
    is_sent: boolean,
    status: string
  }[]>([])
  const [selectedContacts, setSelectedContacts] = useState<{
    mobile: string,
    name: string,
    is_sent: boolean,
    status: string
  }[]>(todo.contacts)

  const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())
  // const [filter, setFilter] = useState<string>()
  const { mutate, isLoading, isSuccess, isError, error } = useMutation
    <AxiosResponse<ITodo>, BackendError, { id: string, body: TformData }>
    (UpdateTodo, {
      onSuccess: () => {
        queryClient.invalidateQueries('todos')
      }
    })

  const formik = useFormik<TformData>({
    initialValues: {
      serial_no: todo.serial_no,
      title: todo.title,
      subtitle: todo.subtitle,
      category: todo.category,
      category2: todo.category2,
      run_once: todo.run_once,
      contacts: selectedContacts,
      frequency_type: todo.frequency_type,
      frequency_value: todo.frequency_value
      ,
      start_date: moment(todo.start_date).format("YYYY-MM-DDThh:mm"),
      connected_user: todo.connected_user && todo.connected_user._id
    },
    validationSchema: Yup.object({
      serial_no: Yup.number(),
      title: Yup.string().required('required field'),
      subtitle: Yup.string(),
      category: Yup.string(),
      contacts: Yup.array(),
      run_once: Yup.boolean(),
      frequency_type: Yup.string().required('required field'),
      frequency_value: Yup.string().required('required field').test('value', "invalid frequency value", value => {
        let ftype = formik.values.frequency_type
        let validated = true
        if (ftype === "minutes") {
          if (Number.isNaN(Number(value)) || Number(value) > 59 || Number(value) < 1)
            validated = false
        }
        if (ftype === "hours") {
          if (Number.isNaN(Number(value)) || Number(value) > 23 || Number(value) < 1)
            validated = false
        }
        if (ftype === "days") {
          if (Number.isNaN(Number(value)) || Number(value) > 31 || Number(value) < 1)
            validated = false
        }

        if (ftype === "months" && value && value.length > 0) {
          let frequency = value.split("-")[0]
          let monthdays = value.split("-")[1]
          if (frequency && monthdays) {
            if (Number.isNaN(Number(frequency)) || Number(frequency) > 12 || Number(frequency) < 1)
              validated = false
            monthdays.split(",").map((v) => {
              if (Number.isNaN(Number(v)) || Number(v) < 1 || Number(v) > 31)
                validated = false
            })
          }
          else validated = false
        }

        if (ftype === "weekdays" && value && value.length > 0) {
          value.split(",").map((v) => {
            if (Number.isNaN(Number(v)) || Number(v) < 1 || Number(v) > 7)
              validated = false
          })
        }

        if (ftype === "monthdays" && value && value.length > 0) {
          value.split(",").map((v) => {
            if (Number.isNaN(Number(v)) || Number(v) < 1 || Number(v) > 31)
              validated = false
          })
        }
        if (ftype === "yeardays" && value && value.length > 0) {
          value.split(",").map((v) => {
            if (Number.isNaN(Number(v)) || Number(v) < 1 || Number(v) > 31)
              validated = false
          })
        }
        return validated
      }),
      start_date: Yup.string().required('required field'),
      connected_user: Yup.string()

    }),
    onSubmit: (values: TformData) => {
      mutate({
        id: todo._id,
        body: {
          ...values,
          contacts: selectedContacts
        }
      })
    }
  });

  useEffect(() => {
    if (isUsersSuccess) {
      setUsers(usersData?.data)
    }

  }, [isUsersSuccess, usersData])

  useEffect(() => {
    let tmps = contacts
    users.map((user) => {
      if (!contacts.find((c) => c.mobile === user.mobile))
        tmps.push({
          mobile: user.mobile,
          name: user.username,
          is_sent: false,
          status: "pending"
        })
    })

  }, [users])
  return (
    <form onSubmit={formik.handleSubmit}>
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
      <Stack sx={{ direction: { xs: 'column', md: 'row' }, pt: 1 }} gap={2}>
        <TextField
          type='number'
          variant='outlined'
          fullWidth
          
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
          
          error={
            formik.touched.subtitle && formik.errors.subtitle ? true : false
          }
          multiline
          rows={4}
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
          variant='outlined'
          fullWidth
          
          error={
            formik.touched.category2 && formik.errors.category2 ? true : false
          }
          id="category2"
          label="Category 2"
          helperText={
            formik.touched.category2 && formik.errors.category2 ? formik.errors.category2 : ""
          }
          {...formik.getFieldProps('category2')}
        />

        <TextField
          fullWidth
          
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
          <option value={undefined}>

          </option>
          {
            users && users.map(user => {
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


        <Button variant="contained" color="primary" type="submit"
          disabled={Boolean(isLoading)}
          fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Update"}
        </Button>
        <SelectContactsInput contacts={contacts} setSelectedContacts={setSelectedContacts} selectedContacts={selectedContacts} setContacts={setContacts} />
      </Stack>
    </form >
  )
}

export default UpdateTodoForm