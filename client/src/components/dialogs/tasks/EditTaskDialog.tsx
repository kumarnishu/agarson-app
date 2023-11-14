import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ChoiceContext, TaskChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { ITask } from '../../../types/task.types';
import EditTaskForm from '../../forms/tasks/EditTaskForm';
import { IUser } from '../../../types/user.types';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import { GetUsers } from '../../../services/UserServices';

function EditTaskDialog({ task }: { task: ITask }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const [users, setUsers] = useState<IUser[]>([])
    const { data, isSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", GetUsers)

    useEffect(() => {
        if (isSuccess)
            setUsers(data?.data)
    }, [users, isSuccess, data])
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === TaskChoiceActions.edit_task ? true : false}
                onClose={() => setChoice({ type: TaskChoiceActions.close_task })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TaskChoiceActions.close_task })}>
                    <Cancel fontSize='large' />
                </IconButton>

                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Update Task
                </DialogTitle>
                <DialogContent>
                    <EditTaskForm task={task} users={users} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default EditTaskDialog