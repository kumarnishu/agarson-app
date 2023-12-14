import { Dialog, DialogContent, DialogActions, Typography, CircularProgress, IconButton, DialogTitle } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { BackendError } from '../../..'
import { GetUsers } from '../../../services/UserServices'
import { Cancel } from '@mui/icons-material'
import { IReferredParty } from '../../../types/crm.types'
import { IUser } from '../../../types/user.types'
import AssignReferForm from '../../forms/crm/AssignReferForm'

function AssignReferDialog({ refer }: { refer: IReferredParty }) {
    const [users, setUsers] = useState<IUser[]>([])
    const { data, isSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())
    const { choice, setChoice } = useContext(ChoiceContext)
    useEffect(() => {
        if (isSuccess)
            setUsers(data?.data)
    }, [users, isSuccess, data])
    return (
        <Dialog 
            open={choice === LeadChoiceActions.assign_refer ? true : false}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Assign Refer</DialogTitle>
            <DialogContent>
                {refer ?
                    < AssignReferForm refer={refer} users={users} />
                    : <CircularProgress size="large" />
                }
            </DialogContent>
            <DialogActions>
                <Typography
                    variant="button"
                    component="p"
                    sx={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                </Typography >
            </DialogActions>
        </Dialog>
    )
}

export default AssignReferDialog