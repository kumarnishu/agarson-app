import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { StartAllGreetings } from '../../../services/GreetingServices';
import AlertBar from '../../snacks/AlertBar';
import { IUser } from '../../../types/user.types';
import React, { useContext, useEffect } from 'react';
import { ChoiceContext, GreetingChoiceActions } from '../../../contexts/dialogContext';


function StartGreetingForm({ users }: { users: IUser[] }) {
  const { setChoice } = useContext(ChoiceContext)
  const { mutate, isLoading, isSuccess, isError, error } = useMutation
    <AxiosResponse<IUser>, BackendError, {
      body: {
        client_id: string;
      }
    }>
    (StartAllGreetings, {
      onSuccess: () => {
        queryClient.invalidateQueries('greetings')
      }
    })


  const formik = useFormik({
    initialValues: {
      client_id: "",
    },
    validationSchema: Yup.object({
      client_id: Yup.string()
        .required('Required field'),
    }),
    onSubmit: (values) => {
      mutate({ body: { client_id: values.client_id } })
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
            select
            SelectProps={{
              native: true
            }}
            error={
              formik.touched.client_id && formik.errors.client_id ? true : false
            }
            id="whatsapp_users"
            label="Whatsapp Users"
            helperText={
              formik.touched.client_id && formik.errors.client_id ? formik.errors.client_id : ""
            }
            {...formik.getFieldProps('client_id')}
          >
            <option value={undefined}>
            </option>
            {
              users && users.map(user => {
                return (
                  <React.Fragment key={user._id}>
                    {user.connected_number && <option value={user.client_id}>
                      {`${user.username} :: ${user.connected_number.replace("91", "").replace("@c.us", "")}`}
                    </option>}
                  </React.Fragment>
                )
              })
            }
          </TextField>
          {
            isError ? (
              <AlertBar message={error?.response.data.message} color="error" />
            ) : null
          }
          {
            isSuccess ? (
              <AlertBar message="started" color="success" />
            ) : null
          }
          <Button variant="contained" color="primary" type="submit"
            disabled={Boolean(isLoading)}
            fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Start"}
          </Button>
        </Stack>
      </Stack>
    </form >
  )
}

export default StartGreetingForm
