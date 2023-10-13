import { Dialog, DialogContent, DialogTitle, Button, DialogActions, CircularProgress, IconButton } from '@mui/material';
import { useContext, useEffect } from 'react';
import { ContactChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { IContact } from '../../../types/contact.types';
import { queryClient } from '../../../main';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import { useMutation } from 'react-query';
import { DeleteContact } from '../../../services/ContactServices';
import { Cancel } from '@mui/icons-material';
import AlertBar from '../../snacks/AlertBar';

function DeleteContactDialog({ contact }: { contact: IContact }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (DeleteContact, {
            onSuccess: () => {
                queryClient.invalidateQueries('contacts')
            }
        })

    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: ContactChoiceActions.close_contact })
            }, 1000)
    }, [setChoice, isSuccess])
    return (
        <>
            <Dialog open={choice === ContactChoiceActions.delete_contact ? true : false}
                onClose={() => setChoice({ type: ContactChoiceActions.close_contact })}
            >
                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message="deleted contact" color="success" />
                    ) : null
                }
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: ContactChoiceActions.close_contact })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Delete Contact</DialogTitle>
                <DialogContent>
                    This Will delete contact {contact.name} : {contact.mobile.replace("91", "").replace("@c.us", "")}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button fullWidth variant="outlined" color="error"
                        onClick={() => {
                            setChoice({ type: ContactChoiceActions.delete_contact })
                            mutate(contact._id)
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

export default DeleteContactDialog