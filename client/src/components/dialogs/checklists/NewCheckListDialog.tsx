import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ChoiceContext, CheckListChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { IUser } from '../../../types/user.types';
import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { BackendError } from '../../..';
import { GetUsers } from '../../../services/UserServices';
import NewCheckListForm from '../../forms/checklists/NewCheckListForm';

function NewCheckListDialog() {
    const { choice, setChoice } = useContext(ChoiceContext)
    const [users, setUsers] = useState<IUser[]>([])
    const { data, isSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())

    useEffect(() => {
        if (isSuccess)
            setUsers(data?.data)
    }, [users, isSuccess, data])
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === CheckListChoiceActions.create_checklist ? true : false}
                onClose={() => setChoice({ type: CheckListChoiceActions.close_checklist })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: CheckListChoiceActions.close_checklist })}>
                    <Cancel fontSize='large' />
                </IconButton>

                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>
                    New checklist
                </DialogTitle>
                <DialogContent>
                    <NewCheckListForm users={users} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default NewCheckListDialog