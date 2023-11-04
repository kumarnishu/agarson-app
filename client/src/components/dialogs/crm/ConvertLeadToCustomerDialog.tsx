import { Dialog, DialogContent, DialogTitle, Button, Typography, Stack, CircularProgress,  IconButton } from '@mui/material'
import { AxiosResponse } from 'axios';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { ConvertCustomer } from '../../../services/LeadsServices';
import { ILead } from '../../../types/crm.types';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { Cancel } from '@mui/icons-material';
import AlertBar from '../../snacks/AlertBar';


function ConvertLeadToCustomerDialog({ lead }: { lead: ILead }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, { id: string }>
        (ConvertCustomer, {
            onSuccess: () => {
                queryClient.invalidateQueries('leads')
                queryClient.invalidateQueries('customers')
                queryClient.invalidateQueries('uselessleads')
            }
        })

    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: LeadChoiceActions.close_lead })
            }, 1000)
    }, [setChoice, isSuccess])

    return (
        <Dialog  open={choice === LeadChoiceActions.convert_customer ? true : false}
            onClose={() => setChoice({ type: LeadChoiceActions.close_lead })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Convert  To Customer
            </DialogTitle>
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message={"converted into customer"} color="success" />
                ) : null
            }
            <DialogContent>
                <Typography variant="body1" color="error">
                    {`This will make a new customer with ${lead.mobile}`}
                </Typography>
            </DialogContent>
            <Stack
                direction="column"
                gap={2}
                padding={2}
                width="100%"
            >
                <Button fullWidth variant="outlined" color="error"
                    onClick={() => {
                        setChoice({ type: LeadChoiceActions.convert_customer })
                        mutate({ id: lead._id })
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress /> :
                        "Make Customer"}
                </Button>

            </Stack >
        </Dialog >
    )
}

export default ConvertLeadToCustomerDialog
