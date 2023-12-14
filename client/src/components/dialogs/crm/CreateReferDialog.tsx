import { Dialog, DialogContent, DialogTitle, Stack, IconButton } from '@mui/material'
import { useContext, useEffect, useState } from 'react';
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import CreateReferForm from '../../forms/crm/CreateReferForm';
import { Cancel } from '@mui/icons-material';
import { IUser } from '../../../types/user.types';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import { GetUsers } from '../../../services/UserServices';
import { useQuery } from 'react-query';


function CreateReferDialog() {
    const [users, setUsers] = useState<IUser[]>([])
    const { choice, setChoice } = useContext(ChoiceContext)
    const { data, isSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())

    useEffect(() => {
        if (isSuccess)
            setUsers(data?.data)
    }, [users, isSuccess, data])

    return (
        <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === LeadChoiceActions.create_refer ? true : false}
            onClose={() => setChoice({ type: LeadChoiceActions.close_lead })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Create A Refer Party
            </DialogTitle>

            <DialogContent>
                <CreateReferForm users={users} />
            </DialogContent>
            <Stack
                direction="column"
                gap={2}
                padding={2}
                width="100%"
            >
            </Stack >
        </Dialog >
    )
}

export default CreateReferDialog
