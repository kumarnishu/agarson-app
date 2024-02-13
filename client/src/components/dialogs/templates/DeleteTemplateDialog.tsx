import { Dialog, DialogContent, DialogTitle, Button, DialogActions, Stack, Typography,  CircularProgress, IconButton } from '@mui/material';
import { useContext, useEffect } from 'react';
import { ChoiceContext, TemplateChoiceActions } from '../../../contexts/dialogContext';
import { queryClient } from '../../../main';
import { DeleteTemplate } from '../../../services/TemplateServices';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import { useMutation } from 'react-query';
import { Cancel } from '@mui/icons-material';
import AlertBar from '../../snacks/AlertBar';
import { IMessageTemplate } from '../../../types/template.types';

function DeleteTemplateDialog({ template }: { template: IMessageTemplate }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (DeleteTemplate, {
            onSuccess: () => {
                queryClient.invalidateQueries('templates')
            }
        })

    useEffect(() => {
        if (isSuccess)
            setChoice({ type: TemplateChoiceActions.close_template })
    }, [setChoice, isSuccess])
    return (
        <>
            <Dialog open={choice === TemplateChoiceActions.delete_template ? true : false}
                onClose={() => setChoice({ type: TemplateChoiceActions.close_template })}
            >
                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message=" template deleted" color="success" />
                    ) : null
                }

                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TemplateChoiceActions.close_template })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Template</DialogTitle>
                <DialogContent>
                    <Stack sx={{ maxWidth: '300px', bgcolor: 'whitesmoke', m: 1, p: 2, wordBreak: 'break-all' }}>
                        <Typography>{template.message}</Typography>
                        {template.media && <img src={template.media?.public_url} alt="media" />}
                        <Typography>{template.caption}</Typography>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button fullWidth variant="outlined" color="error"
                        onClick={() => {
                            setChoice({ type: TemplateChoiceActions.delete_template })
                            mutate(template._id)
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

export default DeleteTemplateDialog