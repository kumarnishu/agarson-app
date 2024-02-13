import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useContext, useEffect } from 'react';
import { ChoiceContext, VisitChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { IVisitReport } from '../../../types/visit.types';
import { ValidateVisit } from '../../../services/VisitServices';
import { AxiosResponse } from 'axios';
import { queryClient } from '../../../main';
import { BackendError } from '../../..';
import { IUser } from '../../../types/user.types';
import { useMutation } from 'react-query';
import AlertBar from '../../snacks/AlertBar';

function ValidateVisitDialog({ visit }: { visit: IVisitReport }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IUser>, BackendError, string>
        (ValidateVisit, {
            onSuccess: () => {
                queryClient.invalidateQueries('visits')
            }
        })
    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: VisitChoiceActions.close_visit })
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
                    <AlertBar message="validated successfull" color="success" />
                ) : null
            }

            <Dialog open={choice === VisitChoiceActions.validate_visit ? true : false}
            > <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: VisitChoiceActions.close_visit })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Validate Visit</DialogTitle>
                <DialogContent>
                    <Button variant="contained" color="error" onClick={() => mutate(visit._id)}
                        disabled={Boolean(isLoading)}
                        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Submit"}
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ValidateVisitDialog




