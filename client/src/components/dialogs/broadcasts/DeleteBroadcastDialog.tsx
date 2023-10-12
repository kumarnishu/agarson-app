import { Dialog, DialogContent, DialogTitle, Button, DialogActions,   CircularProgress, IconButton } from '@mui/material';
import { useContext, useEffect } from 'react';
import { BroadcastChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { IBroadcast } from '../../../types';
import { queryClient } from '../../../main';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import { useMutation } from 'react-query';
import { DeleteBroadCast } from '../../../services/BroadCastServices';
import { Cancel } from '@mui/icons-material';
import AlertBar from '../../snacks/AlertBar';

function DeleteBroadcastDialog({ broadcast }: { broadcast: IBroadcast }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (DeleteBroadCast, {
            onSuccess: () => {
                queryClient.invalidateQueries('broadcasts')
            }
        })

    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: BroadcastChoiceActions.close_broadcast })
            }, 1000)
    }, [setChoice, isSuccess])
    return (
        <>
            <Dialog open={choice === BroadcastChoiceActions.delete_broadcast ? true : false}
                onClose={() => setChoice({ type: BroadcastChoiceActions.close_broadcast })}
            >
                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message="deleted broadcast" color="success" />
                    ) : null
                }
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: BroadcastChoiceActions.close_broadcast })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Delete Broadcast</DialogTitle>
                <DialogContent>
                    This Will delete broadcast {broadcast.name}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button fullWidth variant="outlined" color="error"
                        onClick={() => {
                            setChoice({ type: BroadcastChoiceActions.delete_broadcast })
                            mutate(broadcast._id)
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress /> :
                            "Delete"}
                    </Button>
                  
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DeleteBroadcastDialog