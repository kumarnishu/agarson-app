import { Dialog, DialogContent, CircularProgress, IconButton, DialogTitle } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { BackendError } from '../../..'
import { GetUsers } from '../../../services/UserServices'
import { Cancel } from '@mui/icons-material'
import { IUser } from '../../../types/user.types'
import { IVisitingCard } from '../../../types/visiting_card.types'
import UpdateVisitingCardForm from '../../forms/cards/UpdateVisitingCardForm'

function UpdateVisitingCardDialog({ card }: { card: IVisitingCard }) {
    const [users, setUsers] = useState<IUser[]>([])
    const { data, isSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())
    const { choice, setChoice } = useContext(ChoiceContext)

    useEffect(() => {
        if (isSuccess)
            setUsers(data?.data)
    }, [users, isSuccess, data])

    return (
        <Dialog fullScreen={Boolean(window.screen.width < 500)}
            open={choice === LeadChoiceActions.update_card ? true : false}
            onClose={() => setChoice({ type: LeadChoiceActions.close_lead })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Update Visiting Card</DialogTitle>
            <DialogContent>
                {users && card ?
                    < UpdateVisitingCardForm card={card} users={users} />
                    : <CircularProgress size="large" />
                }
            </DialogContent>

        </Dialog>
    )
}

export default UpdateVisitingCardDialog