import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ChoiceContext, TaskChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import NewTaskForm from '../../forms/tasks/NewTaskForm';
import { IUser } from '../../../types/user.types';
import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { BackendError } from '../../..';
import { GetUsers } from '../../../services/UserServices';

function NewTaskDialog() {
    const { choice, setChoice } = useContext(ChoiceContext)
    const [users, setUsers] = useState<IUser[]>([])
    const { data, isSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", GetUsers)

    useEffect(() => {
        if (isSuccess)
            setUsers(data?.data)
    }, [users, isSuccess, data])
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === TaskChoiceActions.create_task ? true : false}
                onClose={() => setChoice({ type: TaskChoiceActions.close_task })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TaskChoiceActions.close_task })}>
                    <Cancel fontSize='large' />
                </IconButton>

                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>
                    New task
                </DialogTitle>
                <DialogContent>
                    <NewTaskForm users={users} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default NewTaskDialog