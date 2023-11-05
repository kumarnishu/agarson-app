import { Dialog, DialogContent, DialogTitle, Button, Typography, Stack, CircularProgress, IconButton } from '@mui/material'
import { AxiosResponse } from 'axios';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { DeleteRemark } from '../../../services/LeadsServices';
import { IRemark } from '../../../types/crm.types';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { Cancel } from '@mui/icons-material';
import AlertBar from '../../snacks/AlertBar';


function DeleteRemarkDialog({ remark, display, setDisplay }: { remark: IRemark, display: boolean, setDisplay: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { choice, setChoice } = useContext(ChoiceContext)
  const { mutate, isLoading, isSuccess, error, isError } = useMutation
    <AxiosResponse<any>, BackendError, string>
    (DeleteRemark, {
      onSuccess: () => {
        queryClient.invalidateQueries('reminderremarks')
        queryClient.invalidateQueries('remarks')
        queryClient.invalidateQueries('leads')
        queryClient.invalidateQueries('customers')
        queryClient.invalidateQueries('uselessremarks')
      }
    })

  useEffect(() => {
    if (isSuccess)
      setTimeout(() => {
        if (display)
          setDisplay(false)
        else
          setChoice({ type: LeadChoiceActions.close_lead })
      }, 1000)
  }, [isSuccess])

  return (
    <Dialog open={choice === LeadChoiceActions.delete_remark || display ? true : false}
    >
      <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => {
        if (!display)
          setChoice({ type: LeadChoiceActions.close_lead })
        else
          setDisplay(false)
      }}>
        <Cancel fontSize='large' />
      </IconButton>
      <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
        Delete Remark
      </DialogTitle>
      {
        isError ? (
          <AlertBar message={error?.response.data.message} color="error" />
        ) : null
      }
      {
        isSuccess ? (
          <AlertBar message="deleted" color="success" />
        ) : null
      }
      <DialogContent>
        <Typography variant="body1" color="error">
          {`Warning ! This will delete selected remark permanently ${remark.remark}`}

        </Typography>
      </DialogContent>
      <Stack
        direction="column"
        gap={2}
        padding={2}
        width="100%"
      >
        <Button fullWidth variant="outlined" color="error"
          onClick={() => {
            mutate(remark._id)
          }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress /> :
            "Delete"}
        </Button>
      </Stack >
    </Dialog >
  )
}

export default DeleteRemarkDialog
