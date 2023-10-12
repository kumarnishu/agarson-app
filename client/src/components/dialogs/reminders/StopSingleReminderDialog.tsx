import { Dialog, DialogContent, DialogTitle, Button, DialogActions, CircularProgress, IconButton } from '@mui/material';
import { useEffect } from 'react';
import { IContactReport } from '../../../types';
import { queryClient } from '../../../main';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import { useMutation } from 'react-query';
import { StopSingleReportReminder } from '../../../services/ReminderServices';
import { Cancel } from '@mui/icons-material';
import AlertBar from '../../snacks/AlertBar';

function StopSingleReminderDialog({ report, setReport }: { report: IContactReport | undefined, setReport: React.Dispatch<React.SetStateAction<IContactReport | undefined>> }) {
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (StopSingleReportReminder, {
            onSuccess: () => {
                queryClient.invalidateQueries('paginated_reports')
            }
        })

    useEffect(() => {
        if (isSuccess)
            setReport(undefined)
    }, [isSuccess])

    return (
        <>
            <Dialog open={report ? true : false}
                onClose={() => setReport(undefined)}
            >
                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message={"stopped upcoming reminder for this number"} color="success" />
                    ) : null
                }
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setReport(undefined)}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Stop Reminder</DialogTitle>
                <DialogContent>
                    This Will Stop reminder for {report?.contact.mobile.replace("91", "").replace("@c.us", "")}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button fullWidth variant="outlined" color="error"
                        onClick={() => {
                            if (report)
                                mutate(report._id)
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress /> :
                            "Stop"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default StopSingleReminderDialog