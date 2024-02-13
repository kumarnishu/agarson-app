import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Stack } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ChoiceContext, VisitChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { IVisitReport } from '../../../types/visit.types';
import { AxiosResponse } from 'axios';
import { queryClient } from '../../../main';
import { BackendError } from '../../..';
import { IUser } from '../../../types/user.types';
import { useMutation } from 'react-query';
import AlertBar from '../../snacks/AlertBar';
import { UploadVisitSamplesPhoto } from '../../../services/VisitServices';
import UploadFileButton from '../../buttons/UploadFileButton';

function UploadVisitSamplesDialog({ visit }: { visit: IVisitReport }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const [file, setFile] = useState<File>()
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IUser>, BackendError, {
            id: string;
            body: FormData;
        }>
        (UploadVisitSamplesPhoto, {
            onSuccess: () => {
                queryClient.invalidateQueries('visit')
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
                    <AlertBar message="samples uploaded successfull" color="success" />
                ) : null
            }

            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === VisitChoiceActions.upload_samples ? true : false}
                onClose={() => { setChoice({ type: VisitChoiceActions.close_visit }) }}
            > <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => { setChoice({ type: VisitChoiceActions.close_visit }) }}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Upload Shoes Samples</DialogTitle>
                <DialogContent  >
                   <Stack gap={2}>
                        <UploadFileButton name="media" required={true} camera={true} isLoading={isLoading} label="Upload Samples" file={file} setFile={setFile} disabled={isLoading} />
                        <Button variant="contained" color="error" onClick={() => {
                            if (file) {
                                let formdata = new FormData()
                                formdata.append("media", file)
                                mutate({ id: visit._id, body: formdata })
                                setFile(undefined)
                            }
                        }}
                            disabled={Boolean(isLoading)}
                            fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Submit"}
                        </Button>
                   </Stack>
                </DialogContent>

            </Dialog >
        </>
    )
}

export default UploadVisitSamplesDialog




