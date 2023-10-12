import { Alert, LinearProgress } from '@mui/material'
import { AxiosResponse } from 'axios'
import { useEffect, useMemo } from 'react'
import { useMutation } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { VerifyEmail } from '../../services/UserServices'
import { BackendError } from '../..'


export default function EmailVerifyPage() {
  const goto = useNavigate()
  const { token } = useParams()
  const { mutate, isSuccess, isLoading, isError, error } = useMutation
    <AxiosResponse<string>, BackendError, string>
    (VerifyEmail)
  const tokenmemo = useMemo(() => token, [token])
  useEffect(() => {
    if (tokenmemo)
      mutate(tokenmemo)
  }, [mutate, tokenmemo])

  useEffect(() => {
    setTimeout(() => {
      goto("/")
    }, 1500)
  }, [goto, isSuccess])
  
  return (
    <>
      {
        isError ? (
          <>
            <Alert color="error">
              {error?.response.data.message}
            </Alert>
          </>

        ) : null
      }
      {
        isSuccess ? (
          <>
            <Alert color="success">
              email verified successfully
            </Alert>
          </>
        ) : null
      }
      {isLoading ? <LinearProgress /> : null
      }
    </>
  )
}
