import { Dialog, DialogContent, DialogTitle,  IconButton } from '@mui/material'
import { useContext } from 'react';
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import UpdateUserPasswordForm from '../../forms/user/UpdateUserPasswordForm';
import { IUser } from "../../../types/user.types"
import { Cancel } from '@mui/icons-material';


function UpdateUsePasswordDialog({ user }: { user: IUser }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog open={choice === UserChoiceActions.update_user_password ? true : false}
                onClose={() => setChoice({ type: UserChoiceActions.close_user })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: UserChoiceActions.close_user })}>
                    <Cancel fontSize='large'/>
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">Update Password</DialogTitle>
                <DialogContent>
                    <UpdateUserPasswordForm user={user} />
                </DialogContent>
            </Dialog >
        </>
    )
}

export default UpdateUsePasswordDialog
