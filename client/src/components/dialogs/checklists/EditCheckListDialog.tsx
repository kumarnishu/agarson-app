import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ChoiceContext, CheckListChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import {  IChecklist } from '../../../types/checklist.types';
import { IUser } from '../../../types/user.types';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import { GetUsers } from '../../../services/UserServices';
import EditCheckListForm from '../../forms/checklists/EditCheckListForm';

function EditCheckListDialog({ checklist }: { checklist: IChecklist }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const [users, setUsers] = useState<IUser[]>([])
    const { data, isSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())

    useEffect(() => {
        if (isSuccess)
            setUsers(data?.data)
    }, [users, isSuccess, data])
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === CheckListChoiceActions.edit_checklist ? true : false}
                onClose={() => setChoice({ type: CheckListChoiceActions.close_checklist })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: CheckListChoiceActions.close_checklist })}>
                    <Cancel fontSize='large' />
                </IconButton>

                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Update CheckList
                </DialogTitle>
                <DialogContent>
                    <EditCheckListForm checklist={checklist} users={users} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default EditCheckListDialog