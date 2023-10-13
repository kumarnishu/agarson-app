import { Dialog, DialogTitle, IconButton } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { BroadcastChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { IBroadcast } from '../../../types/broadcast.types';
import StartBroadCastForm from '../../forms/broadcast/StartBroadCastForm';
import { GetUsers } from '../../../services/UserServices';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import { useQuery } from 'react-query';
import { Cancel } from '@mui/icons-material';
import { IUser } from '../../../types/user.types';

function StartBroadcastDialog({ broadcast }: { broadcast: IBroadcast }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { data, isSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", GetUsers)
    const [users, setUsers] = useState<IUser[]>([])
    const [client, setClient] = useState<string>()

    useEffect(() => {
        if (data) {
            setUsers(data.data)
        }
    }, [isSuccess])

    useEffect(() => {
        if (broadcast && users.length > 0) {
            let user = users.find(user => user.connected_number === broadcast.connected_number)
            if (user && user.connected_number) {
                setClient(`${user.username} :: ${user.connected_number.replace("91", "").replace("@c.us", "")}`)
            }

        }
    }, [users, isSuccess])
    return (
        <>
            <Dialog open={choice === BroadcastChoiceActions.start_broadcast ? true : false}

            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: BroadcastChoiceActions.close_broadcast })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle textAlign={"center"} sx={{ minWidth: '350px' }}>Activate Broadcast</DialogTitle>
                {users &&
                    <StartBroadCastForm broadcast={broadcast} users={users} client={client} />
                }

            </Dialog>
        </>
    )
}

export default StartBroadcastDialog