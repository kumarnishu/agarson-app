import { Dialog, DialogContent, DialogTitle, CircularProgress, IconButton } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { IReferredParty } from '../../../types/crm.types'
import UpdateReferForm from '../../forms/crm/UpdateReferForm'
import { Cancel } from '@mui/icons-material'
import { IUser } from '../../../types/user.types';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import { GetUsers } from '../../../services/UserServices';
import { useQuery } from 'react-query';

function UpdateReferDialog({ refer }: { refer: IReferredParty }) {
    const [users, setUsers] = useState<IUser[]>([])
    const { choice, setChoice } = useContext(ChoiceContext)
    const { data, isSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())

    useEffect(() => {
        if (isSuccess)
            setUsers(data?.data)
    }, [users, isSuccess, data])
    return (
        <Dialog fullScreen={Boolean(window.screen.width < 500)}
            open={choice === LeadChoiceActions.update_refer ? true : false}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">Update Refer Party</DialogTitle>
            <DialogContent>
                {refer ?
                    < UpdateReferForm refer={refer} users={users} />
                    : <CircularProgress size="large" />
                }
            </DialogContent>
        </Dialog>
    )
}

export default UpdateReferDialog