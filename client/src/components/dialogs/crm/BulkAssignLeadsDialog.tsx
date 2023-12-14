import { Dialog, DialogContent, DialogTitle,  Typography,  IconButton } from '@mui/material'
import { useContext, useEffect, useState } from 'react';
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { ILead } from '../../../types/crm.types';
import BulkAssignLeadsForm from '../../forms/crm/BulkAssignLeadsForm';
import { IUser } from '../../../types/user.types';
import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { BackendError } from '../../..';
import { GetUsers } from '../../../services/UserServices';


function BulkAssignLeadsDialog({ leads }: { leads: ILead[] }) {
    const [users, setUsers] = useState<IUser[]>([])
    const { data, isSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())
    const { choice, setChoice } = useContext(ChoiceContext)

    useEffect(() => {
        if (isSuccess)
            setUsers(data?.data)
    }, [users, isSuccess, data])

    return (
        <Dialog   open={choice === LeadChoiceActions.bulk_assign_leads ? true : false}
            onClose={() => setChoice({ type: LeadChoiceActions.close_lead })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Assign Leads
            </DialogTitle>

            <DialogContent>
                <Typography variant="body1" color="error">
                    {`Warning ! This will assign ${leads.length} leads to the selected lead owners.`}

                </Typography>
                <BulkAssignLeadsForm leads={leads} users={users} />
            </DialogContent>

        </Dialog >
    )
}

export default BulkAssignLeadsDialog
