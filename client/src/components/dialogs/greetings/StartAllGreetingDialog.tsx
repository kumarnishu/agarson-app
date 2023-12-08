import { Dialog, DialogTitle, IconButton } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { GreetingChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { GetUsers } from '../../../services/UserServices';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import { useQuery } from 'react-query';
import { Cancel } from '@mui/icons-material';
import { IUser } from '../../../types/user.types';
import StartGreetingForm from '../../forms/greeting/StartGreetingForm';

function StartAllGreetingDialog() {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { data, isSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", GetUsers)
    const [users, setUsers] = useState<IUser[]>([])

    useEffect(() => {
        if (data) {
            setUsers(data.data)
        }
    }, [isSuccess])


    return (
        <>
            <Dialog open={choice === GreetingChoiceActions.bulk_start_greeting ? true : false}

            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: GreetingChoiceActions.close_greeting })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle textAlign={"center"} sx={{ minWidth: '350px' }}>Start All Greetings</DialogTitle>
                {users &&
                    <StartGreetingForm users={users} />
                }

            </Dialog>
        </>
    )
}

export default StartAllGreetingDialog