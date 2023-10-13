import { Dialog, DialogContent, DialogTitle, Button, DialogActions,  CircularProgress, IconButton } from '@mui/material';
import { useEffect } from 'react';
import { IBroadcastReport } from '../../../types/broadcast.types';
import { queryClient } from '../../../main';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import { useMutation } from 'react-query';
import { StopSingleReportBroadCast } from '../../../services/BroadCastServices';
import { Cancel } from '@mui/icons-material';
import AlertBar from '../../snacks/AlertBar';

function StopSingleBroadcastDialog({ report, setReport }: { report: IBroadcastReport | undefined, setReport: React.Dispatch<React.SetStateAction<IBroadcastReport | undefined>> }) {
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (StopSingleReportBroadCast, {
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
                        <AlertBar message={"stopped upcoming broadcast for this number"} color="success" />
                    ) : null
                }
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setReport(undefined)}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Stop Broadcast</DialogTitle>
                <DialogContent>
                    This Will Stop broadcast for {report?.mobile}
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

export default StopSingleBroadcastDialog