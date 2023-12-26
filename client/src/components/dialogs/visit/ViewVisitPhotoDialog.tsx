import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, VisitChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { DownloadFile } from '../../../utils/DownloadFile';
import { IVisitReport } from '../../../types/visit.types';

function ViewVisitPhotoDialog({ visit }: { visit: IVisitReport }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === VisitChoiceActions.view_visit_photo ? true : false}
                onClose={() => setChoice({ type: VisitChoiceActions.close_visit })}
            > <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: VisitChoiceActions.close_visit })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>{visit.party_name}</DialogTitle>
                <Typography sx={{ minWidth: '350px' }} textAlign={"center"}>{visit.mobile}</Typography>
                <DialogContent>
                    <Stack justifyContent={'center'}
                        onDoubleClick={() => {
                            if (visit && visit.visit_in_photo && visit.visit_in_photo?.public_url) {
                                DownloadFile(visit.visit_in_photo?.public_url, visit.visit_in_photo?.filename)
                            }
                        }}>
                        <img width={350} src={visit.visit_in_photo?.public_url} alt="visit photo" />
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ViewVisitPhotoDialog







