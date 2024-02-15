import { Dialog, DialogContent, DialogTitle, Button, Typography, CircularProgress, IconButton, TextField } from '@mui/material'
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
                Togle Card status
            </DialogTitle>
            <br />

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
            <Typography variant="body1" textAlign={'center'} color="error">
                {`Warning ! This will update selected card status. ${card.name}`}
            </Typography>
            <DialogContent>
                <TextField
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

                <Button fullWidth variant="outlined" color="error" sx={{ mt: 2 }}
                    disabled={isLoading || !Boolean(comment)}
                    onClick={() => {
                        if (comment) {
                            mutate({ id: card._id, body: { comment: comment } })
                            setChoice({ type: LeadChoiceActions.close_lead })
                        }
                    }}
                >
                    {isLoading ? <CircularProgress /> :
                        "Toogle Status"}
                </Button>
            </DialogContent>

        </Dialog >
    )
}

export default ToogleStatusCardDialog
