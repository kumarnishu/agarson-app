import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import NewLeadForm from '../../forms/crm/NewLeadForm';
import { GetUsers } from '../../../services/UserServices';
import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { IUser } from '../../../types/user.types';
import { BackendError } from '../../..';
import { Cancel } from '@mui/icons-material';

function NewLeadDialog() {
  const [users, setUsers] = useState<IUser[]>([])
  const { data, isSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())
  const { choice, setChoice } = useContext(ChoiceContext)

  useEffect(() => {
    if (isSuccess)
      setUsers(data?.data)
  }, [users, isSuccess, data])

  return (
    <>
      <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === LeadChoiceActions.create_lead ? true : false}
      >
        <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
          <Cancel fontSize='large' />
        </IconButton>
        <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>New Lead</DialogTitle>
        <DialogContent>
          <NewLeadForm users={users} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default NewLeadDialog