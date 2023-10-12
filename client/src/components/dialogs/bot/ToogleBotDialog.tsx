import { useContext } from 'react'
import { ToogleBotStatus } from '../../../services/BotServices'
import { AxiosResponse } from 'axios'
import { BackendError } from '../../..'
import { useMutation } from 'react-query'
import { BotChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { queryClient } from '../../../main'
import { IMenuTracker } from '../../../types'
import { Cancel } from '@mui/icons-material'
import AlertBar from '../../snacks/AlertBar'

function ToogleBotDialog({ tracker }: { tracker: IMenuTracker }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isSuccess, isLoading, isError, error } = useMutation
        <AxiosResponse<IMenuTracker>,
            BackendError,
            { body: { phone_number: string, bot_number: string } }
        >(ToogleBotStatus, {
            onSuccess: () => queryClient.invalidateQueries('trackers')
        })

    return (

        <Dialog open={choice === BotChoiceActions.toogle_bot_status ? true : false}
            onClose={() => setChoice({ type: BotChoiceActions.close_bot })}
        >
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message={tracker.is_active ? "stopped bot for this number" : "started bot for this number"} color="success" />
                ) : null
            }

            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: BotChoiceActions.close_bot })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px', textAlign: 'center' }}>
                Toogle Bot Status
            </DialogTitle>
            <DialogContent>
                {`This will change bot status for this ${tracker.phone_number.replace("91", "").replace("@c.us", "")}`}

            </DialogContent>
            <DialogActions>
                <Button fullWidth variant="outlined" color="error" onClick={() => {
                    if (tracker && tracker._id) mutate({
                        body: { phone_number: tracker.phone_number, bot_number: tracker.bot_number }
                    })
                    setChoice({ type: BotChoiceActions.close_bot })
                }
                }
                    disabled={isLoading}>{tracker.is_active ? "stop" : "start"}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ToogleBotDialog