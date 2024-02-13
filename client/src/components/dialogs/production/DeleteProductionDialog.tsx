import { Dialog, DialogContent, DialogTitle, Button, DialogActions, CircularProgress, IconButton } from '@mui/material';
import { useContext, useEffect } from 'react';
import { ChoiceContext, ProductionChoiceActions } from '../../../contexts/dialogContext';
import { queryClient } from '../../../main';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import { useMutation } from 'react-query';
import { Cancel } from '@mui/icons-material';
import AlertBar from '../../snacks/AlertBar';
import { DeleteProduction } from '../../../services/ProductionServices';
import { IProduction } from '../../../types/production.types';

function DeleteProductionDialog({ production }: { production: IProduction }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (DeleteProduction, {
            onSuccess: () => {
                queryClient.invalidateQueries('productions')
            }
        })

    useEffect(() => {
        if (isSuccess)
            setChoice({ type: ProductionChoiceActions.close_production })
    }, [setChoice, isSuccess])
    return (
        <>
            <Dialog open={choice === ProductionChoiceActions.delete_production ? true : false}
                onClose={() => setChoice({ type: ProductionChoiceActions.close_production })}
            >
                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message="deleted production" color="success" />
                    ) : null
                }
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: ProductionChoiceActions.close_production })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Delete Production</DialogTitle>
                <DialogContent>
                    This Will delete production of the {production.machine.display_name}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button fullWidth variant="outlined" color="error"
                        onClick={() => {
                            setChoice({ type: ProductionChoiceActions.delete_production })
                            mutate(production._id)
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

export default DeleteProductionDialog