import { Dialog, DialogContent, DialogTitle, Button, Typography, Stack, CircularProgress,  IconButton } from '@mui/material'
import { AxiosResponse } from 'axios';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import {  RemoveLeadReferrals } from '../../../services/LeadsServices';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { ILead } from '../../../types';
import { Cancel } from '@mui/icons-material';
import AlertBar from '../../snacks/AlertBar';


function RemoveLeadReferralDialog({ lead }: { lead: ILead }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (RemoveLeadReferrals, {
            onSuccess: () => {
                queryClient.invalidateQueries('refers')
            }
        })

    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: LeadChoiceActions.close_lead })
            }, 1000)
    }, [setChoice, isSuccess])

    return (
        <Dialog open={choice === LeadChoiceActions.remove_referral ? true : false}
            onClose={() => setChoice({ type: LeadChoiceActions.close_lead })}
           
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Delete Refer
            </DialogTitle>
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message=" Referrals for this lead deleted" color="success" />
                ) : null
            }
           
            <DialogContent>
                <Typography variant="body1" color="error">
                    {`Warning ! This will delete  ${lead.name}`}

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
                        setChoice({ type: LeadChoiceActions.remove_referral })
                        mutate(lead._id)
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress /> :
                        "Remove Referral"}
                </Button>
            </Stack >
        </Dialog >
    )
}

export default RemoveLeadReferralDialog
