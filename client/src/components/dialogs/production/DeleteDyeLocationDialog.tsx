import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useContext, useEffect } from 'react';
import { Cancel } from '@mui/icons-material';
import { AxiosResponse } from 'axios';
import { queryClient } from '../../../main';
import { BackendError } from '../../..';
import { IUser } from '../../../types/user.types';
import { useMutation } from 'react-query';
import AlertBar from '../../snacks/AlertBar';
import { IDyeLocation } from '../../../types/production.types';
import { ChoiceContext, ProductionChoiceActions } from '../../../contexts/dialogContext';
import { DeleteDyeLocation } from '../../../services/ProductionServices';

function DeleteDyeLocationDialog({ location }: { location: IDyeLocation }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IUser>, BackendError, string>
        (DeleteDyeLocation, {
            onSuccess: () => {
                queryClient.invalidateQueries('dye_locations')
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

            <Dialog open={choice === ProductionChoiceActions.delete_dye_location ? true : false}
            > <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: ProductionChoiceActions.close_production })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Delete Location</DialogTitle>
                <DialogContent>
                    <Button variant="contained" color="error" onClick={() => mutate(location._id)}
                        disabled={Boolean(isLoading)}
                        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Delete"}
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DeleteDyeLocationDialog




