import { Dialog, DialogContent, DialogTitle, DialogActions, Typography, CircularProgress, IconButton } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import UpdateLeadForm from '../../forms/crm/UpdateLeadForm'
import { useQuery } from 'react-query'
import { AxiosResponse } from 'axios'
import { GetUsers } from '../../../services/UserServices'
import { ILead } from '../../../types/crm.types'
import { IUser } from '../../../types/user.types'
import { BackendError } from '../../..'
import { Cancel } from '@mui/icons-material'

function UpdateLeadDialog({ lead }: { lead: ILead }) {
    const [users, setUsers] = useState<IUser[]>([])
    const { data, isSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())
    const { choice, setChoice } = useContext(ChoiceContext)
    useEffect(() => {
        if (isSuccess)
            setUsers(data?.data)
    }, [users, isSuccess, data])
    return (
        <Dialog fullScreen={Boolean(window.screen.width < 500)}
            open={choice === LeadChoiceActions.update_lead ? true : false}
            onClose={() => setChoice({ type: LeadChoiceActions.close_lead })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>


            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">Update Lead Form</DialogTitle>

            <DialogContent>
                {lead ?
                    < UpdateLeadForm users={users} lead={lead} />
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

export default UpdateLeadDialog