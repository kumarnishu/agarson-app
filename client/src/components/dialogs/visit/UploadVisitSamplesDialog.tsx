import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ChoiceContext, VisitChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { IVisitReport } from '../../../types/visit.types';
import { AxiosResponse } from 'axios';
import { queryClient } from '../../../main';
import { BackendError, Target } from '../../..';
import { IUser } from '../../../types/user.types';
import { useMutation } from 'react-query';
import AlertBar from '../../snacks/AlertBar';
import { UploadVisitSamplesPhoto } from '../../../services/VisitServices';

function UploadVisitSamplesDialog({ visit }: { visit: IVisitReport }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const [file, setFile] = useState<File>()
    const [formdata, setFormData] = useState<FormData>()
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
            setTimeout(() => {
                setChoice({ type: VisitChoiceActions.close_visit })
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
                    <AlertBar message="samples uploaded successfull" color="success" />
                ) : null
            }

            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === VisitChoiceActions.upload_samples ? true : false}
                onClose={() => { setChoice({ type: VisitChoiceActions.close_visit }) }}
            > <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => { setChoice({ type: VisitChoiceActions.close_visit }) }}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Upload Shoes Samples</DialogTitle>
                <DialogContent >
                    <TextField
                        sx={{ mt: 2 }}
                        fullWidth
                        error={
                            !formdata ? true : false
                        }
                        helperText={
                            !formdata ? "Please Upload Shoes Samples having with you" : ""
                        }
                        label="Upload Samples"
                        focused
                        required
                        type="file"
                        name="media"
                        onChange={(e) => {
                            e.preventDefault()
                            const target: Target = e.currentTarget
                            let files = target.files
                            if (files) {
                                let file = files[0]
                                let formdata1 = new FormData()
                                formdata1.append("media", file)
                                setFile(file)
                                setFormData(formdata1)
                            }
                        }}
                    />
                    <Button variant="contained" color="error" onClick={() => {
                        if (formdata)
                            mutate({ id: visit._id, body: formdata })
                    }}
                        disabled={Boolean(isLoading)}
                        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Submit"}
                    </Button>
                    {file && <Stack sx={{ bgcolor: 'lightblue', m: 1, p: 1, border: 5, borderColor: 'darkgreen', borderRadius: 2 }}>
                        {/* @ts-ignore */}
                        {file && <img src={file && URL.createObjectURL(file)} alt="image" />}
                    </Stack>}
                </DialogContent>

            </Dialog >
        </>
    )
}

export default UploadVisitSamplesDialog




