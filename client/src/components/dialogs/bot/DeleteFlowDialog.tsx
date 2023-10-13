import { useContext } from 'react'
import { DestroyFlow } from '../../../services/BotServices'
import { AxiosResponse } from 'axios'
import { BackendError } from '../../..'
import { useMutation } from 'react-query'
import { BotChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { IFlow } from "../../../types/bot.types";
import { queryClient } from '../../../main'
import { Cancel } from '@mui/icons-material'
import AlertBar from '../../snacks/AlertBar'

function DeleteFlowDialog({ flow }: { flow: IFlow }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isSuccess, isLoading, isError, error } = useMutation
        <AxiosResponse<IFlow>,
            BackendError,
            string
        >(DestroyFlow, { onSuccess: () => queryClient.invalidateQueries('flows') })

    return (
        <Dialog open={choice === BotChoiceActions.delete_flow ? true : false}
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
                    <AlertBar message="successfully deleted flow" color="success" />
                ) : null
            }
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: BotChoiceActions.close_bot })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ textAlign: 'center' }}>
                Delete flow
            </DialogTitle>


            <DialogContent>
                {`This will permanently delete this ${flow.flow_name}`}

            </DialogContent>
            <DialogActions>
                <Button fullWidth variant="outlined" color="error" onClick={() => {
                    if (flow && flow._id) mutate(flow._id)
                    setChoice({ type: BotChoiceActions.close_bot })
                }
                }
                    disabled={isLoading}>Delete</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteFlowDialog