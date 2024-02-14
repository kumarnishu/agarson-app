import { Dialog, DialogContent, DialogTitle, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { IVisitingCard } from '../../../types/visiting_card.types';

function ViewCardCommentsDialog({ card }: { card: IVisitingCard }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === LeadChoiceActions.view_card_comments ? true : false}
                scroll="paper"
                onClose={() => setChoice({ type: LeadChoiceActions.close_lead })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '300px' }} textAlign="center">Comments</DialogTitle>
                <DialogContent>
                    {card.comments.slice(0).reverse().map((comment, index) => {
                        return (
                            <Stack key={index}>
                                <Paper elevation={8} sx={{ p: 2, mt: 1, boxShadow: 2, backgroundColor: 'whitesmoke' }}>
                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        Comment : <b>{comment.comment}</b>
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        By:<i>{comment.created_by.username}</i>
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        Timestamp : {new Date(comment.timestamp).toLocaleString()}
                                    </Typography>
                                </Paper>
                            </Stack>
                        )
                    })}
                </DialogContent>
            </Dialog >
        </>
    )
}

export default ViewCardCommentsDialog