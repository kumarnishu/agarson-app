import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, VisitChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { IVisitReport } from '../../../types/visit.types';
import { DownloadFile } from '../../../utils/DownloadFile';

function ViewVisitDialog({ visit }: { visit: IVisitReport }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === VisitChoiceActions.view_visit ? true : false}
                onClose={() => setChoice({ type: VisitChoiceActions.close_visit })}
            > <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: VisitChoiceActions.close_visit })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '500px' }} textAlign={"center"}>Visit Details</DialogTitle>
                <DialogContent>
                    {/* start day */}
                    <Typography variant="subtitle1" sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: 'white', p: 1 }} textAlign={'center'} fontWeight={'bold'}>Start Day</Typography>
                    <Stack
                        gap={1}
                        direction={'column'}
                        spacing={2}
                        py={1}
                        justifyContent="left"
                    >

                        {visit.visit.start_day_photo && <img
                            onDoubleClick={() => {
                                if (visit.visit.start_day_photo && visit.visit.start_day_photo?.public_url) {
                                    DownloadFile(visit.visit.start_day_photo?.public_url, visit.visit.start_day_photo?.filename)
                                }
                            }}
                            src={visit.visit.start_day_photo?.public_url} style={{ borderRadius: '5px', height: '500px', width: 'auto' }} />}
                        <Stack>
                            <Typography sx={{ textTransform: "capitalize" }}>Timestamp : {new Date(visit.visit.start_day_credientials && visit.visit.start_day_credientials.timestamp).toLocaleTimeString()}</Typography>
                            <Typography variant="subtitle1">{visit.visit.start_day_credientials && visit.visit.start_day_credientials.latitude},{visit.visit.start_day_credientials && visit.visit.start_day_credientials.longitude}</Typography>
                            <Typography variant="subtitle1"><b>{visit.visit.start_day_credientials && visit.visit.start_day_credientials.address}</b></Typography>
                        </Stack >
                    </Stack >

                    {/* visit in */}
                    <Typography variant="subtitle1" sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: 'white', p: 1 }} textAlign={'center'} fontWeight={'bold'}>Visit In</Typography>
                    <Stack gap={1}
                        direction={'column'}
                        spacing={2}
                        py={1}
                        justifyContent="left"
                    >
                        {visit.visit_in_photo && <img
                            onDoubleClick={() => {
                                if (visit.visit_in_photo && visit.visit_in_photo?.public_url) {
                                    DownloadFile(visit.visit_in_photo?.public_url, visit.visit_in_photo?.filename)
                                }
                            }}
                            src={visit.visit_in_photo?.public_url} style={{ borderRadius: '5px', height: '500px', width: 'auto' }} />}
                        <Stack>
                            <Typography sx={{ textTransform: "capitalize" }}> Timestamp : {new Date(visit.visit_in_credientials && visit.visit_in_credientials.timestamp).toLocaleTimeString()}</Typography>
                            <Typography variant="subtitle1">{visit.visit_in_credientials && visit.visit_in_credientials.latitude},{visit.visit_in_credientials && visit.visit_in_credientials.longitude}</Typography>
                            <Typography variant="subtitle1">{visit.visit_in_credientials && visit.visit_in_credientials.address}</Typography>
                        </Stack >
                    </Stack >
                    {/* samples photo */}
                    <Typography variant="subtitle1" sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: 'white', p: 1 }} textAlign={'center'} fontWeight={'bold'}>Shoes Samples</Typography>
                    <Stack gap={1}
                        direction={'column'}
                        spacing={2}
                        py={1}
                        justifyContent="left"
                    >
                        {visit.visit_samples_photo && <img
                            onDoubleClick={() => {
                                if (visit.visit_samples_photo && visit.visit_samples_photo?.public_url) {
                                    DownloadFile(visit.visit_samples_photo?.public_url, visit.visit_samples_photo?.filename)
                                }
                            }}
                            src={visit.visit_samples_photo?.public_url} style={{ borderRadius: '5px', height: '500px', width: 'auto' }} />}
                    </Stack>
                    {/* visit out */}
                    <Typography variant="subtitle1" sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: 'white', p: 1 }} textAlign={'center'} fontWeight={'bold'}>Visit Out</Typography>
                    <Stack
                        gap={1}
                        direction={'column'}
                        spacing={2}
                        py={1}
                        justifyContent="left"

                    >
                        <Stack>
                            <Typography sx={{ textTransform: "capitalize" }}>Timestamp : {new Date(visit.visit_out_credentials && visit.visit_out_credentials.timestamp).toLocaleTimeString()}</Typography>
                            <Typography variant="subtitle1">{visit.visit_out_credentials && visit.visit_out_credentials.latitude},{visit.visit_out_credentials && visit.visit_out_credentials.longitude}</Typography>
                            <Typography variant="subtitle1">{visit.visit_out_credentials && visit.visit_out_credentials.address}</Typography>
                        </Stack >
                    </Stack>

                    {/* end day */}
                    <Typography variant="subtitle1" sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: 'white', p: 1 }} textAlign={'center'} fontWeight={'bold'}>End Day</Typography>
                    <Stack gap={1}
                        direction={'column'}
                        spacing={2}
                        py={1}
                        justifyContent="left"
                    >
                        {visit.visit.end_day_photo && <img
                            onDoubleClick={() => {
                                if (visit.visit.end_day_photo && visit.visit.end_day_photo?.public_url) {
                                    DownloadFile(visit.visit.end_day_photo?.public_url, visit.visit.end_day_photo?.filename)
                                }
                            }}
                            src={visit.visit.end_day_photo?.public_url} style={{ borderRadius: '5px', height: '500px', width: 'auto' }} />}
                        <Stack>
                            <Typography sx={{ textTransform: "capitalize" }}> Timestamp : {new Date(visit.visit.end_day_credentials && visit.visit.end_day_credentials.timestamp).toLocaleTimeString()}</Typography>
                            <Typography variant="subtitle1"> {visit.visit.end_day_credentials && visit.visit.end_day_credentials.latitude},{visit.visit.end_day_credentials && visit.visit.end_day_credentials.longitude}</Typography>
                            <Typography variant="subtitle1">{visit.visit.end_day_credentials && visit.visit.end_day_credentials.address}</Typography>
                        </Stack >
                    </Stack >
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ViewVisitDialog







