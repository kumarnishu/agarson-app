import { Dialog, DialogTitle, IconButton } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ReminderChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { GetUsers } from '../../../services/UserServices';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import { useQuery } from 'react-query';
import { Cancel } from '@mui/icons-material';
import StartReminderForm from '../../forms/reminders/StartReminderForm';
import { IUser } from '../../../types/user.types';
import { IReminder } from '../../../types/reminder.types';

function StartReminderMessageDialog({ reminder }: { reminder: IReminder }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { data, isSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())
    const [users, setUsers] = useState<IUser[]>([])
    const [client, setClient] = useState<string>()

    useEffect(() => {
        if (data) {
            setUsers(data.data)
        }
    }, [isSuccess])

    useEffect(() => {
        if (reminder && users.length > 0) {
            let user = users.find(user => user.connected_number === reminder.connected_number)
            if (user && user.connected_number) {
                setClient(`${user.username} :: ${user.connected_number.replace("91", "").replace("@c.us", "")}`)
            }

        }
    }, [users, isSuccess])
    return (
        <>
            <Dialog open={choice === ReminderChoiceActions.start_reminder ? true : false}

            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: ReminderChoiceActions.close_reminder })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Activate Template Reminder</DialogTitle>
                {users &&
                    <StartReminderForm reminder={reminder} users={users} client={client} />
                }

            </Dialog>
        </>
    )
}

export default StartReminderMessageDialog