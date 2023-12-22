import { Dialog, DialogContent, DialogTitle, IconButton, Stack } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, VisitChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { Asset } from '../../../types/asset.types';

function ViewVisitPhotoDialog({ photo }: { photo: Asset }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === VisitChoiceActions.view_visit_photo ? true : false}
            > <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: VisitChoiceActions.close_visit })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Visit Details</DialogTitle>
                <DialogContent>
                    <Stack justifyContent={'center'}>
                        <img width={500} height={700} src={photo?.public_url} alt="visit photo" />
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ViewVisitPhotoDialog







