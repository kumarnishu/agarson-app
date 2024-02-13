import { Button, CircularProgress, Stack } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useEffect, useContext, useState } from 'react';
import { useMutation } from 'react-query';
import { ChoiceContext, VisitChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { IUser } from '../../../types/user.types';
import { StartMyDay } from '../../../services/VisitServices';
import UploadFileButton from '../../buttons/UploadFileButton';

function StartMydayForm() {
    const [location, setLocation] = useState<{ latitude: string, longitude: string, timestamp: Date }>()
    const [file, setFile] = useState<File>()
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IUser>, BackendError, FormData>
        (StartMyDay, {
            onSuccess: () => {
                queryClient.invalidateQueries('visit')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    function handleSubmit() {
        if (location && file) {
            let formdata = new FormData()
            formdata.append("body", JSON.stringify({ start_day_credientials: location }))
            formdata.append("media", file)
            mutate(formdata)
            setLocation(undefined)
        }
        else
            alert("please Enable GPS of device")
    }

    useEffect(() => {
        if (file)
            setFile(file)
    }, [file])

    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: VisitChoiceActions.close_visit })
        }
    }, [isSuccess, setChoice])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((data) => {
            setLocation({ latitude: String(data.coords.latitude), longitude: String(data.coords.longitude), timestamp: new Date(data.timestamp) })
        })
    }, [])
    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
            <Stack sx={{ direction: { xs: 'column', md: 'row' } }}>
                <Stack
                    direction="column"
                    gap={2}
                    sx={{ pt: 2 }}
                >

                    <UploadFileButton name="media" required={true} camera={true} isLoading={isLoading} label="Upload Selfie" file={file} setFile={setFile} disabled={isLoading} />
                    {
                        isError ? (
                            <AlertBar message={error?.response.data.message} color="error" />
                        ) : null
                    }
                    {
                        isSuccess ? (
                            <AlertBar message="Your day Started SuccessFully" color="success" />
                        ) : null
                    }
                    {location && file && 
                    <Button size="large" variant="contained" color="primary" type="submit"
                        disabled={Boolean(isLoading)}
                        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Submit"}
                    </Button>}
                </Stack>
            </Stack>

        </form >
    )
}

export default StartMydayForm
