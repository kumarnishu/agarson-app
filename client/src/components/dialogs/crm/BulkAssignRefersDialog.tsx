import { Dialog, DialogContent, DialogTitle, Typography, IconButton } from '@mui/material'
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { ILead, IReferredParty } from '../../../types/crm.types';
import BulkAssignReferForm from '../../forms/crm/BulkAssignReferForm';
import { useContext, useEffect, useState } from 'react';
import { IUser } from '../../../types/user.types';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { GetUsers } from '../../../services/UserServices';
import { BackendError } from '../../..';


function BulkAssignRefersDialog({ refers }: {
    refers: {
        party: IReferredParty,
        leads: ILead[]
    }[]
}) {
    const [users, setUsers] = useState<IUser[]>([])
    const { data, isSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())
    const { choice, setChoice } = useContext(ChoiceContext)

    useEffect(() => {
        if (isSuccess)
            setUsers(data?.data)
    }, [users, isSuccess, data])
    return (
        <Dialog  open={choice === LeadChoiceActions.bulk_assign_refers ? true : false}
            onClose={() => setChoice({ type: LeadChoiceActions.close_lead })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Assign Refers
            </DialogTitle>

            <DialogContent>
                <Typography variant="body1" color="error">
                    {`Warning ! This will assign ${refers.length} refers to the selected lead owners.`}

                </Typography>
                <BulkAssignReferForm refers={refers} users={users} />
            </DialogContent>

        </Dialog >
    )
}

export default BulkAssignRefersDialog
