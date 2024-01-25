import { Dialog, DialogContent, DialogTitle, Typography, IconButton } from '@mui/material'
import { useContext, useEffect, useState } from 'react';
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import {  IState, IUser } from '../../../types/user.types';
import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { BackendError } from '../../..';
import { GetUsers } from '../../../services/UserServices';
import BulkAssignStatesForm from '../../forms/states/BulkAssignStatesForm';


function BulkAssignStatesDialog({ states }: { states: { state: IState, users: IUser[] }[] }) {
    const [users, setUsers] = useState<IUser[]>([])
    const { data, isSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())
    const { choice, setChoice } = useContext(ChoiceContext)

    useEffect(() => {
        if (isSuccess)
            setUsers(data?.data)
    }, [users, isSuccess, data])

    return (
        <Dialog open={choice === UserChoiceActions.bulk_assign_states ? true : false}
            onClose={() => setChoice({ type: UserChoiceActions.close_user })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: UserChoiceActions.close_user })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Assign States
            </DialogTitle>

            <DialogContent>
                <Typography variant="body1" color="error">
                    {`Warning ! This will assign ${states.length} states to the selected state owners.`}

                </Typography>
                <BulkAssignStatesForm states={states} users={users} />
            </DialogContent>

        </Dialog >
    )
}

export default BulkAssignStatesDialog
