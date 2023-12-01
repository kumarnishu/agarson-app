import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ChoiceContext, TodoChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { ITodo } from '../../../types/todo.types';
import EditTodoForm from '../../forms/todos/EditTodoForm';
import { IUser } from '../../../types/user.types';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import { GetUsers } from '../../../services/UserServices';

function EditTodoDialog({ todo }: { todo: ITodo }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const [users, setUsers] = useState<IUser[]>([])
    const { data, isSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", GetUsers)

    useEffect(() => {
        if (isSuccess)
            setUsers(data?.data)
    }, [users, isSuccess, data])
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === TodoChoiceActions.update_todo ? true : false}
                onClose={() => setChoice({ type: TodoChoiceActions.close_todo })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TodoChoiceActions.close_todo })}>
                    <Cancel fontSize='large' />
                </IconButton>

                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Update Todo
                </DialogTitle>
                <DialogContent>
                    <EditTodoForm todo={todo} users={users} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default EditTodoDialog