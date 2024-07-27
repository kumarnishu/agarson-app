import { Dialog, DialogContent, IconButton, DialogTitle } from '@mui/material'
import { useContext } from 'react'
import { ChoiceContext, UserChoiceActions,  } from '../../../contexts/dialogContext'
import { Cancel } from '@mui/icons-material'
import CreateOrEditRoleForm from '../../forms/user/CreateOrEditRoleForm'
import { IRole } from '../../../types/user.types'

function CreateOrEditRoleDialog({ role }: { role?: IRole}) {
    const { choice, setChoice } = useContext(ChoiceContext)
    
    return (
        <Dialog open={choice === UserChoiceActions.create_or_edit_role  ? true : false}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => {
                setChoice({ type: UserChoiceActions.close_user })
            }
            }>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>{!role ?"New Role":"Edit Role"}</DialogTitle>
            <DialogContent>
                <CreateOrEditRoleForm role={role} />
            </DialogContent>
        </Dialog>
    )
}

export default CreateOrEditRoleDialog