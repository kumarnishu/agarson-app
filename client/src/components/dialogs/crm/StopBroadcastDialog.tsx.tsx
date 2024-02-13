import { Dialog, DialogContent, DialogTitle, Button, Typography, Stack, CircularProgress, IconButton } from '@mui/material'
import { AxiosResponse } from 'axios';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { StopBroadcast } from '../../../services/LeadsServices';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { IBroadcast } from '../../../types/crm.types';
import { Cancel } from '@mui/icons-material';
import AlertBar from '../../snacks/AlertBar';


function StopBroadcastDialog({ broadcast }: { broadcast: IBroadcast }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (StopBroadcast, {
            onSuccess: () => {
                queryClient.invalidateQueries('broadcast')
            }
        })

    useEffect(() => {
        if (isSuccess)
            setChoice({ type: LeadChoiceActions.close_lead })
    }, [setChoice, isSuccess])

    return (
        <Dialog open={choice === LeadChoiceActions.stop_broadcast ? true : false}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Stop broadcast  {broadcast.name}
            </DialogTitle>
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message="stopped broadcast" color="success" />
                ) : null
            }
            <DialogContent>
                <Typography variant="body1" color="error">
                    {`Warning ! This will stop broadcast${broadcast.name}`}

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
                        setChoice({ type: LeadChoiceActions.stop_broadcast })
                        mutate(broadcast._id)
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress /> :
                        "Stop"}
                </Button>
            </Stack >
        </Dialog >
    )
}

export default StopBroadcastDialog
