import { Dialog, DialogContent, DialogTitle, Button, Typography, Stack, CircularProgress, IconButton } from '@mui/material'
import { AxiosResponse } from 'axios';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { StartBroadcast } from '../../../services/LeadsServices';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { IBroadcast } from '../../../types/crm.types';
import { Cancel } from '@mui/icons-material';
import AlertBar from '../../snacks/AlertBar';


function StartBroadcastDialog({ broadcast }: { broadcast: IBroadcast }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (StartBroadcast, {
            onSuccess: () => {
                queryClient.invalidateQueries('broadcast')
            }
        })

    useEffect(() => {
        if (isSuccess)
            setChoice({ type: LeadChoiceActions.close_lead })
    }, [setChoice, isSuccess])

    return (
        <Dialog open={choice === LeadChoiceActions.start_broadcast ? true : false}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Start Broadcast
            </DialogTitle>
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message="strated broadcast" color="success" />
                ) : null
            }
            <DialogContent>
                <Typography variant="body1" color="error">
                    {`Warning ! This will start broadcast  ${broadcast.name}`}

                </Typography>
            </DialogContent>
            <Stack
                direction="column"
                gap={2}
                padding={2}
                width="100%"
            >
                <Button fullWidth variant="contained" color="success"
                    onClick={() => {
                        setChoice({ type: LeadChoiceActions.start_broadcast })
                        mutate(broadcast._id)
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress /> :
                        "Start"}
                </Button>
            </Stack >
        </Dialog >
    )
}

export default StartBroadcastDialog
