import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ChoiceContext, VisitChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { IVisitReport } from '../../../types/visit.types';
import { MakeVisitOut } from '../../../services/VisitServices';
import { AxiosResponse } from 'axios';
import { queryClient } from '../../../main';
import { BackendError } from '../../..';
import { IUser } from '../../../types/user.types';
import { useMutation } from 'react-query';
import AlertBar from '../../snacks/AlertBar';

function MakeVisitOutDialog({ visit }: { visit: IVisitReport }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const [location, setLocation] = useState<{ latitude: string, longitude: string, timestamp: Date }>()
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IUser>, BackendError, {
            id: string;
            body: FormData;
        }>
        (MakeVisitOut, {
            onSuccess: () => {
                queryClient.invalidateQueries('visit')
            }
        })

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((data) => {
            setLocation({ latitude: String(data.coords.latitude), longitude: String(data.coords.longitude), timestamp: new Date(data.timestamp) })
        })
    }, [])

    function handleOut() {
        if (location) {
            let formdata = new FormData()
            formdata.append("body", JSON.stringify({ visit_out_credentials: location }))
            mutate({ id: visit._id, body: formdata })
            setLocation(undefined)
        }
        else {
            alert("enable gps of current device")
        }
        setChoice({
            type: VisitChoiceActions.close_visit
        })
    }
    return (
        <>
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message="Visit out this party successfull" color="success" />
                ) : null
            }

            <Dialog open={choice === VisitChoiceActions.visit_out ? true : false}
                onClose={() => { setChoice({ type: VisitChoiceActions.close_visit }) }}
            > <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => { setChoice({ type: VisitChoiceActions.close_visit }) }}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Visit Out</DialogTitle>
                <DialogContent>
                    <Typography variant='caption'>Please Enable GPS before submit</Typography>
                    {location && <Button variant="contained" color="error" onClick={handleOut}
                        disabled={Boolean(isLoading)}
                        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Submit"}
                    </Button>}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default MakeVisitOutDialog




