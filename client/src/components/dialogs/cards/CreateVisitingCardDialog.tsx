import { Dialog, DialogContent, CircularProgress, IconButton, DialogTitle } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { BackendError } from '../../..'
import { GetUsers } from '../../../services/UserServices'
import { Cancel } from '@mui/icons-material'
import { IUser } from '../../../types/user.types'
import CreateVisitingCardForm from '../../forms/cards/CreateVisitingCardForm'

function CreateVisitingCardDialog() {
    const [users, setUsers] = useState<IUser[]>([])
    const { data, isSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())
    const { choice, setChoice } = useContext(ChoiceContext)

    useEffect(() => {
        if (isSuccess)
            setUsers(data?.data)
    }, [users, isSuccess, data])

    return (
        <Dialog fullScreen={Boolean(window.screen.width < 500)}
            open={choice === LeadChoiceActions.create_card ? true : false}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>New Visiting Card</DialogTitle>
            <DialogContent>
                {users ?
                    < CreateVisitingCardForm users={users} />
                    : <CircularProgress size="large" />
                }
            </DialogContent>
           
        </Dialog>
    )
}

export default CreateVisitingCardDialog