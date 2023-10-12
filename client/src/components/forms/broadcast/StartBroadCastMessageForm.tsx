import {  Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Stack, Switch, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useContext, useState } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, TemplateChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { IBroadcast, IUser } from '../../../types';
import { queryClient } from '../../../main';
import { StartMessageBroadCast } from '../../../services/BroadCastServices';
import moment from 'moment'
import AlertBar from '../../snacks/AlertBar';


type TformData = {
  client_id?: string,
  time_gap: number,
  daily_limit?: number,
  start_date: string

  autoRefresh?: boolean
}

function StartBroadCastMessageForm({ broadcast, users, client }: { broadcast: IBroadcast, users: IUser[], client?: string }) {
  const [showLimit, setShowLimit] = useState(Boolean(broadcast.daily_limit))

  const { mutate, isLoading, isSuccess, isError, error } = useMutation
    <AxiosResponse<IUser>, BackendError, { id: string, body: FormData }>
    (StartMessageBroadCast, {
      onSuccess: () => {
        queryClient.invalidateQueries('broadcasts')
      }
    })

  const { setChoice } = useContext(ChoiceContext)

  const formik = useFormik<TformData>({
    initialValues: {
      client_id: client,
      time_gap: Number(broadcast.time_gap) || 30,
      autoRefresh: Boolean(broadcast.autoRefresh),
      daily_limit: Number(broadcast.daily_limit) || 0,
      start_date: moment(broadcast.start_date).format("YYYY-MM-DDThh:mm")
    },
    validationSchema: Yup.object({
      client_id: Yup.string()
        .required('Required field'),
      time_gap: Yup.number()
        .required('Required field'),
      autoRefresh: Yup.boolean(),
      start_date: Yup.string().required('Required field'),
    }),
    onSubmit: (values: TformData) => {
      let formdata = new FormData()
      if (!showLimit)
        values.daily_limit = undefined
      formdata.append("body", JSON.stringify(values))
      mutate({ id: broadcast._id, body: formdata })
    }
  });

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setChoice({ type: TemplateChoiceActions.close_template })
      }, 1000)
    }
  }, [isSuccess, setChoice])
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
            showLimit && < TextField
              type="datetime-local"

              error={
                formik.touched.start_date && formik.errors.start_date ? true : false
              }
              id="start_date"
              label="Start Date&Time"
              fullWidth
              required
              helperText={
                formik.touched.start_date && formik.errors.start_date ? formik.errors.start_date : ""
              }
              {...formik.getFieldProps('start_date')}
            />
          }
          <TextField
            fullWidth
            required
            type="number"
            error={
              formik.touched.time_gap && formik.errors.time_gap ? true : false
            }
            id="time_gap"
            label="gap in Seconds"
            helperText={
              formik.touched.time_gap && formik.errors.time_gap ? formik.errors.time_gap : ""
            }
            {...formik.getFieldProps('time_gap')}
          />
          <FormGroup>
            <FormControlLabel control={<Switch
              checked={Boolean(showLimit)}
              onChange={() => setShowLimit(!showLimit)}
            />} label="Use Daily Limit" />
          </FormGroup>

          {showLimit &&
            <TextField
              variant='standard'
              fullWidth
              required
              type="number"
              error={
                formik.touched.daily_limit && formik.errors.daily_limit ? true : false
              }
              id="daily_limit"
              label="Daily limit"
              helperText={
                formik.touched.daily_limit && formik.errors.daily_limit ? formik.errors.daily_limit : ""
              }
              {...formik.getFieldProps('daily_limit')}
            />
          }

          <FormGroup>
            <FormControlLabel control={<Checkbox
              checked={Boolean(formik.values.autoRefresh)}
              {...formik.getFieldProps('autoRefresh')}
            />} label="Auto Refresh" />
          </FormGroup>

          {
            isError ? (
              <AlertBar message={error?.response.data.message} color="error" />
            ) : null
          }
          {
            isSuccess ? (
              <AlertBar message="new custom broadcast restarted" color="success" />
            ) : null
          }
          <Button variant="contained" color="primary" type="submit"
            disabled={Boolean(isLoading)}
            fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Activate"}
          </Button>
        </Stack>
      </Stack>
    </form >
  )
}

export default StartBroadCastMessageForm
