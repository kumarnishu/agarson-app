import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useContext, useEffect } from 'react';
import { Cancel } from '@mui/icons-material';
import { AxiosResponse } from 'axios';
import { queryClient } from '../../../main';
import { BackendError } from '../../..';
import { IUser } from '../../../types/user.types';
import { useMutation } from 'react-query';
import AlertBar from '../../snacks/AlertBar';
import { IShoeWeight } from '../../../types/production.types';
import { ChoiceContext, ProductionChoiceActions } from '../../../contexts/dialogContext';
import { DeleteShoeWeight } from '../../../services/ProductionServices';

function DeleteShoeWeightDialog({ weight }: { weight: IShoeWeight }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IUser>, BackendError, string>
        (DeleteShoeWeight, {
            onSuccess: () => {
                queryClient.invalidateQueries('shoe_weights')
            }
        })
    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setChoice({ type: ProductionChoiceActions.close_production })
            }, 1000)
        }
    }, [isSuccess, setChoice])
    return (
        <>
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message="deleted successfull" color="success" />
                ) : null
            }

            <Dialog open={choice === ProductionChoiceActions.delete_weight ? true : false}
            > <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: ProductionChoiceActions.close_production })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Delete Shoe Weight</DialogTitle>
                <DialogContent>
                    <Button variant="contained" color="error" onClick={() => mutate(weight._id)}
                        disabled={Boolean(isLoading)}
                        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Delete"}
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DeleteShoeWeightDialog




