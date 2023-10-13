import { useContext, useEffect } from 'react'
import { AxiosResponse } from 'axios'
import { BackendError } from '../../..'
import { useMutation } from 'react-query'
import { ChoiceContext, AlpsChoiceActions } from '../../../contexts/dialogContext'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { queryClient } from '../../../main'
import { Cancel } from '@mui/icons-material'
import AlertBar from '../../snacks/AlertBar'
import { DeleteAlps } from '../../../services/AlpsServices'
import { IAlps } from '../../../types/alps.types'

function DeleteAlpsDialog({ alp }: { alp: IAlps }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isSuccess, isLoading, isError, error } = useMutation
        <AxiosResponse<IAlps>,
            BackendError,
            string
        >(DeleteAlps, { onSuccess: () => queryClient.invalidateQueries('alps') })

    useEffect(() => {
        if (isSuccess)
            setChoice({ type: AlpsChoiceActions.close_alps })
    }, [isSuccess])
    return (
        <Dialog open={choice === AlpsChoiceActions.delete_alps ? true : false}
            onClose={() => setChoice({ type: AlpsChoiceActions.close_alps })}
            sx={{ padding: 2 }}
        >

            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message="successfully deleted " color="success" />
                ) : null
            }
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: AlpsChoiceActions.close_alps })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ textAlign: 'center' }}>
                Delete Record
            </DialogTitle>


            <DialogContent>
                {`This will permanently delete this record ${alp.name}`}

            </DialogContent>
            <DialogActions>
                <Button fullWidth variant="outlined" color="error" onClick={() => {
                    if (alp && alp._id) mutate(alp._id)
                }
                }
                    disabled={isLoading}>Delete</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteAlpsDialog