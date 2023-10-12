import { Dialog, DialogContent, DialogTitle, Button, DialogActions, CircularProgress, IconButton, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { BroadcastChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { IBroadcast } from '../../../types';
import { queryClient } from '../../../main';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import { useMutation } from 'react-query';
import { SetBroadcastDailyCount } from '../../../services/BroadCastServices';
import { Cancel } from '@mui/icons-material';
import AlertBar from '../../snacks/AlertBar';

function SetDailyCountBroadcastDialog({ broadcast }: { broadcast: IBroadcast }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const [count, setCount] = useState(broadcast.daily_count)
    const [Error, setError] = useState<string>()

    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, { id: string, body: { count: number } }>
        (SetBroadcastDailyCount, {
            onSuccess: () => {
                queryClient.invalidateQueries('broadcasts')
            }
        })


    function HandleCount(value: number) {
        setCount(value)
        if (broadcast.daily_limit) {
            if (value < 0)
                setError("daily count must be positive")
            else {
                setError(undefined)
            }
        }
    }
    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: BroadcastChoiceActions.close_broadcast })
            }, 1000)
    }, [setChoice, isSuccess])
    return (
        <>
            <Dialog open={choice === BroadcastChoiceActions.set_daily_count ? true : false}
                onClose={() => setChoice({ type: BroadcastChoiceActions.close_broadcast })}
            >
                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message="successful" color="success" />
                    ) : null
                }
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: BroadcastChoiceActions.close_broadcast })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Delete Broadcast</DialogTitle>
                <DialogContent sx={{ p: 2 }}>
                    <TextField
                        sx={{ mt: 2 }}
                        disabled
                        variant='outlined'
                        fullWidth
                        required
                        type="number"
                        value={broadcast.daily_limit}
                        id="dailylimit"
                        label="Daily Limit"

                    />
                    <TextField
                        sx={{ mt: 2 }}
                        onChange={(e) => {
                            HandleCount(Number(e.currentTarget.value))
                        }}
                        variant='outlined'
                        fullWidth
                        required
                        type="number"
                        value={count}
                        error={
                            Error ? true : false
                        }
                        id="count"
                        label="Daily Count"
                        helperText={
                            Error ? Error : "this will change broadcast daily limit to this number for current day only"
                        }
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button fullWidth variant="outlined" color="error"
                        onClick={() => {
                            mutate({ id: broadcast._id, body: { count: count } })

                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress /> :
                            "Set"}
                    </Button>

                </DialogActions>
            </Dialog>
        </>
    )
}

export default SetDailyCountBroadcastDialog