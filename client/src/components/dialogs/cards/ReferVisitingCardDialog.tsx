import { Dialog, DialogContent, CircularProgress, IconButton, DialogTitle } from '@mui/material'
import { useContext } from 'react'
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { Cancel } from '@mui/icons-material'
import { IVisitingCard } from '../../../types/visiting_card.types'
import { AxiosResponse } from 'axios'
import { IReferredParty } from '../../../types/crm.types'
import { useQuery } from 'react-query'
import { GetRefers } from '../../../services/LeadsServices'
import ReferVisitingCardForm from '../../forms/cards/ReferVisitingCardForm'
import { BackendError } from '../../..'

function ReferVisitingCardDialog({ card }: { card: IVisitingCard }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { data } = useQuery<AxiosResponse<IReferredParty[]>, BackendError>("refers", GetRefers)

    return (
        <Dialog fullScreen={Boolean(window.screen.width < 500)}
            open={choice === LeadChoiceActions.refer_card ? true : false}
            onClose={() => setChoice({ type: LeadChoiceActions.close_lead })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ textAlign: 'center', minWidth: '350px' }}>Refer card</DialogTitle>
            <DialogContent>
                {card && data?.data ?
                    < ReferVisitingCardForm card={card} refers={data.data} />
                    : <CircularProgress size="large" />
                }
            </DialogContent>
            
        </Dialog>
    )
}

export default ReferVisitingCardDialog