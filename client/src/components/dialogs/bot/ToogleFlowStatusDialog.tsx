import { useContext } from 'react'
import { ToogleFlowStatus } from '../../../services/BotServices'
import { AxiosResponse } from 'axios'
import { BackendError } from '../../..'
import { useMutation } from 'react-query'
import { BotChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { IFlow } from "../../../types/bot.types";
import { queryClient } from '../../../main'
import { Cancel } from '@mui/icons-material'
import AlertBar from '../../snacks/AlertBar'

function ToogleFlowStatusDialog({ flow }: { flow: IFlow }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isSuccess, isLoading, isError, error } = useMutation
        <AxiosResponse<IFlow>,
            BackendError,
            string
        >(ToogleFlowStatus, { onSuccess: () => queryClient.invalidateQueries('flows') })

    return (
        <Dialog open={choice === BotChoiceActions.toogle_flow_status ? true : false}
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
                    <AlertBar message={flow.is_active ? "deactivated" : "activated"} color="success" />
                ) : null
            }
           
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: BotChoiceActions.close_bot })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px', textAlign: 'center' }}>
                Toogle flow status
            </DialogTitle>
            <DialogContent>
                {`This will change status of  ${flow.flow_name}`}
            </DialogContent>
            <DialogActions>
                <Button fullWidth variant="outlined" color="error" onClick={() => {
                    if (flow && flow._id) mutate(flow._id)
                    setChoice({ type: BotChoiceActions.close_bot })
                }
                }
                    disabled={isLoading}>
                    {flow.is_active ? "Disable" : "Activate"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ToogleFlowStatusDialog