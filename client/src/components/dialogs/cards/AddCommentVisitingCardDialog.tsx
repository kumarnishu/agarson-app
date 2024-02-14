import { Dialog, DialogContent, IconButton, DialogTitle, CircularProgress } from '@mui/material'
import { useContext } from 'react'
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { Cancel } from '@mui/icons-material'
import { IVisitingCard } from '../../../types/visiting_card.types'
import AddCommentTocardForm from '../../forms/cards/AddCommentTocardForm'

function AddCommentVisitingCardDialog({ card }: { card: IVisitingCard }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Dialog fullScreen={Boolean(window.screen.width < 500)}
            open={choice === LeadChoiceActions.add_card_comment ? true : false}
            onClose={() => setChoice({ type: LeadChoiceActions.close_lead })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ textAlign: 'center', minWidth: '350px' }}>Add Comment</DialogTitle>
            <DialogContent>
                {card ?
                    < AddCommentTocardForm card={card} />
                    : <CircularProgress size="large" />
                }
            </DialogContent>

        </Dialog>
    )
}

export default AddCommentVisitingCardDialog