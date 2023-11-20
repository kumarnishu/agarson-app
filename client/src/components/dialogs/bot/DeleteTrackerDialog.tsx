import { useContext } from 'react'
import { DeleteTracker } from '../../../services/BotServices'
import { AxiosResponse } from 'axios'
import { BackendError } from '../../..'
import { useMutation } from 'react-query'
import { BotChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { IMenuTracker } from "../../../types/bot.types";
import { queryClient } from '../../../main'
import { Cancel } from '@mui/icons-material'
import AlertBar from '../../snacks/AlertBar'

function DeleteTrackerDialog({ tracker }: { tracker: IMenuTracker }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isSuccess, isLoading, isError, error } = useMutation
        <AxiosResponse<IMenuTracker>,
            BackendError,
            { body: { phone_number: string, bot_number: string } }
        >(DeleteTracker, { onSuccess: () => queryClient.invalidateQueries('trackers') })

    return (
        <Dialog open={choice === BotChoiceActions.delete_tracker ? true : false}
            onClose={() => setChoice({ type: BotChoiceActions.close_bot })}
            sx={{ padding: 2 }}
        >

            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message={isSuccess ? "deleted tracker" : ""} color="success" />
                ) : null
            }

            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: BotChoiceActions.close_bot })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px', textAlign: 'center' }}>
                Delete Tracker
            </DialogTitle>
            <DialogContent>
                {`This will delete tracker for  ${tracker.customer_name}`}
            </DialogContent>
            <DialogActions>
                <Button fullWidth variant="outlined" color="error" onClick={() => {
                    if (tracker && tracker._id) mutate({
                        body: { phone_number: tracker.phone_number, bot_number: tracker.bot_number }
                    })
                    setChoice({ type: BotChoiceActions.close_bot })
                }
                }
                    disabled={isLoading}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteTrackerDialog