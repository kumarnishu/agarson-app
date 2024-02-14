import { Dialog, DialogContent, DialogTitle, Button, Typography, Stack, CircularProgress, IconButton, TextField } from '@mui/material'
import { AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { ToogleStatusVisitingCard } from '../../../services/LeadsServices';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { Cancel } from '@mui/icons-material';
import AlertBar from '../../snacks/AlertBar';
import { IVisitingCard } from '../../../types/visiting_card.types';


function ToogleStatusCardDialog({ card }: { card: IVisitingCard }) {
    const [comment, setComment] = useState<string>()
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, { id: string, body: { comment: string } }>
        (ToogleStatusVisitingCard, {
            onSuccess: () => {
                queryClient.invalidateQueries('cards')
            }
        })

    useEffect(() => {
        if (isSuccess)
            setChoice({ type: LeadChoiceActions.close_lead })
    }, [setChoice, isSuccess])

    return (
        <Dialog open={choice === LeadChoiceActions.toogle_card ? true : false}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Togle status
            </DialogTitle>
            <TextField
                autoFocus
                required
                fullWidth
                multiline
                minRows={4}
                onChange={(e) => setComment(e.currentTarget.value)}
                error={
                    !comment ? true : false
                }
                id="comment"
                label="Comments"
            />
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message="updated status" color="success" />
                ) : null
            }
            <DialogContent>
                <Typography variant="body1" color="error">
                    {`Warning ! This will update selected card status. ${card.name}`}
                </Typography>
            </DialogContent>
            <Stack
                direction="column"
                gap={2}
                padding={2}
                width="100%"
            >
                <Button fullWidth variant="outlined" color="error"
                    onClick={() => {
                        if (comment) {
                            mutate({ id: card._id, body: { comment: comment } })
                            setChoice({ type: LeadChoiceActions.close_lead })
                        }
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress /> :
                        "Toogle Status"}
                </Button>
            </Stack >
        </Dialog >
    )
}

export default ToogleStatusCardDialog
