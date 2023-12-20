import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ChoiceContext, PasswordChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { IPassword } from '../../../types/password.types';
import EditPasswordForm from '../../forms/passwords/EditPasswordForm';
import { IUser } from '../../../types/user.types';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import { GetUsers } from '../../../services/UserServices';

function EditPasswordDialog({ password }: { password: IPassword }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const [users, setUsers] = useState<IUser[]>([])
    const { data, isSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())

    useEffect(() => {
        if (isSuccess)
            setUsers(data?.data)
    }, [users, isSuccess, data])
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === PasswordChoiceActions.update_erp_password ? true : false}
                onClose={() => setChoice({ type: PasswordChoiceActions.close_password })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: PasswordChoiceActions.close_password })}>
                    <Cancel fontSize='large' />
                </IconButton>

                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Update Password
                </DialogTitle>
                <DialogContent>
                    <EditPasswordForm password={password} users={users} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default EditPasswordDialog