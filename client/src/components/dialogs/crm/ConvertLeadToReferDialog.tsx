import { Dialog, DialogContent, DialogTitle, Typography, IconButton, Button, CircularProgress } from '@mui/material'
import { useContext, useEffect } from 'react';
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import { ConvertLeadToRefer } from '../../../services/LeadsServices';
import { queryClient } from '../../../main';
import { useMutation } from 'react-query';
import AlertBar from '../../snacks/AlertBar';
import { GetLeadDto, GetReferDto } from '../../../dtos/crm/crm.dto';


function ConvertLeadToReferDialog({ lead }: { lead: GetLeadDto }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<GetReferDto>, BackendError, { id: string }>
        (ConvertLeadToRefer, {
            onSuccess: () => {
                queryClient.invalidateQueries('leads')
            }
        })

    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: LeadChoiceActions.close_lead })
        }
    }, [isSuccess, setChoice])
    return (
        <Dialog open={choice === LeadChoiceActions.convert_lead_to_refer ? true : false}
            onClose={() => setChoice({ type: LeadChoiceActions.close_lead })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Convert  To Customer
            </DialogTitle>

            <DialogContent>
                <Typography variant="body1" color="error">
                    {`This will make a new Customer with the selected lead data.`}
                </Typography>
                {lead &&
                    <>
                        {
                            isError ? (
                                <AlertBar message={error?.response.data.message} color="error" />
                            ) : null
                        }
                        {
                            isSuccess ? (
                                <AlertBar message="lead converted successfully" color="success" />
                            ) : null
                        }
                        <Button variant="contained" color="primary" onClick={() => {
                            mutate({
                                id: lead._id
                            })
                        }}
                            disabled={Boolean(isLoading)}
                            fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Convert"}
                        </Button>
                    </>}
            </DialogContent>
        </Dialog >
    )
}

export default ConvertLeadToReferDialog