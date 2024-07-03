import { Dialog, DialogContent, DialogTitle, Typography, IconButton, Stack, Button} from '@mui/material'
import { useContext, useEffect } from 'react';
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import {  FindUnknownCrmCities } from '../../../services/LeadsServices';


function FindUknownCrmCitiesDialog() {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate,  isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError>
        (FindUnknownCrmCities, {
            onSuccess: () => {
                queryClient.invalidateQueries('crm_cities')
            }
        })
   

    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: LeadChoiceActions.close_lead });
        }
    }, [isSuccess])
    return (
        <Dialog
            fullWidth
            open={choice === LeadChoiceActions.find_unknown_cities ? true : false}
            onClose={() => {
                setChoice({ type: LeadChoiceActions.close_lead });
               
            }}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => {
                setChoice({ type: LeadChoiceActions.close_lead });
               
            }}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
               Find Unknown Cities
            </DialogTitle>
            <DialogContent>
                <Stack
                    gap={2}
                >
                    <Typography variant="body1" color="error">

                      Donot forgot to assign unknown city to the users ?
                    </Typography>
                    <Button variant='outlined' color='error' onClick={() => mutate()}>Submit</Button>
                   
                </Stack>
                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message="successfull" color="success" />
                    ) : null
                }
            </DialogContent>
        </Dialog >
    )
}

export default FindUknownCrmCitiesDialog