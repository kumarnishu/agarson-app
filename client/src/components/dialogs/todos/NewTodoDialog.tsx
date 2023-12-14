import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ChoiceContext, TodoChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import NewTodoForm from '../../forms/todos/NewTodoForm';
import { IUser } from '../../../types/user.types';
import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { BackendError } from '../../..';
import { GetUsers } from '../../../services/UserServices';

function NewTodoDialog() {
    const { choice, setChoice } = useContext(ChoiceContext)
    const [users, setUsers] = useState<IUser[]>([])
    const { data, isSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())

    useEffect(() => {
        if (isSuccess)
            setUsers(data?.data)
    }, [users, isSuccess, data])
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === TodoChoiceActions.create_todo ? true : false}
                onClose={() => setChoice({ type: TodoChoiceActions.close_todo })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TodoChoiceActions.close_todo })}>
                    <Cancel fontSize='large' />
                </IconButton>

                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>
                    New Todo
                </DialogTitle>
                <DialogContent>
                    <NewTodoForm users={users} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default NewTodoDialog