import {  Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { UpdateUser } from '../../../services/UserServices';
import { IUser } from '../../../types/user.types';
import { BackendError, Target } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';


type TformData = {
  username: string,
  email: string,
  mobile: string,
  dp: string | Blob | File
}
type Props = {
  user: IUser
}
function UpdateUserForm({ user }: Props) {
  const { mutate, isLoading, isSuccess, isError, error } = useMutation
    <AxiosResponse<IUser>, BackendError, { id: string, body: FormData }>
    (UpdateUser, {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
      }
    })
  const { setChoice } = useContext(ChoiceContext)
  const formik = useFormik<TformData>({
    initialValues: {
      username: user.username || "",
      email: user?.email || "",
      mobile: String(user.mobile) || "",
      dp: user.dp?.public_url || ""
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required('Required field')
        .min(4, 'Must be 4 characters or more')
        .max(30, 'Must be 30 characters or less'),
      mobile: Yup.string()
        .required('Required field')
        .min(10, 'Must be 10 digits')
        .max(10, 'Must be 10 digits'),
      email: Yup.string()
        .email('provide a valid email id')
        .required('Required field'),

      dp: Yup.mixed<File>()
        .test("size", "size is allowed only less than 10mb",
          file => {
            if (file)
              if (!file.size) //file not provided
                return true
              else
                return Boolean(file.size <= 10 * 1024 * 1024)
            return true
          }
        )
        .test("type", " allowed only .jpg, .jpeg, .png, .gif images",
          file => {
            const Allowed = ["image/png", "image/jpg", "image/jpeg", "image/png", "image/gif"]
            if (file)
              if (!file.size) //file not provided
                return true
              else
                return Boolean(Allowed.includes(file.type))
            return true
          }
        )
    }),
    onSubmit: (values: TformData) => {
      let formdata = new FormData()
      formdata.append("username", values.username)
      formdata.append("email", values.email)
      formdata.append("mobile", values.mobile)
      formdata.append("dp", values.dp)
      if (user._id)
        mutate({ id: user._id, body: formdata })
    }
  });

  useEffect(() => {
    if (isSuccess) {
      setChoice({ type: UserChoiceActions.close_user })
    }
  }, [isSuccess, setChoice])

  return (
    <>
      <form onSubmit={formik.handleSubmit}>

        <Stack
          direction="column"
          gap={2}
          pt={2}
        >
          <TextField


            fullWidth
            required
            error={
              formik.touched.username && formik.errors.username ? true : false
            }
            id="username"
            label="Username"
            helperText={
              formik.touched.username && formik.errors.username ? formik.errors.username : ""
            }
            {...formik.getFieldProps('username')}
          />
          <TextField

            type="number"
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


            required
            fullWidth
            error={
              formik.touched.email && formik.errors.email ? true : false
            }
            id="email"
            label="Email"
            helperText={
              formik.touched.email && formik.errors.email ? formik.errors.email : ""
            }
            {...formik.getFieldProps('email')}
          />

          <TextField
            fullWidth
            error={
              formik.touched.dp && formik.errors.dp ? true : false
            }
            helperText={
              formik.touched.dp && formik.errors.dp ? String(formik.errors.dp) : ""
            }
            label="Display Picture"
            focused

            type="file"
            name="dp"
            onBlur={formik.handleBlur}
            onChange={(e) => {
              e.preventDefault()
              const target: Target = e.currentTarget
              let files = target.files
              if (files) {
                let file = files[0]
                formik.setFieldValue("dp", file)
              }
            }}
          />
          {
            isError ? (
              <AlertBar message={error?.response.data.message} color="error" />
            ) : null
          }
          {
            isSuccess ? (
              <AlertBar message="updated user" color="success" />
            ) : null
          }
          <Button variant="contained" color="primary" type="submit"
            disabled={Boolean(isLoading)}
            fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Update"}</Button>
        </Stack>
      </form>
    </>
  )
}

export default UpdateUserForm