import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext,  ProductionChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { DownloadFile } from '../../../utils/DownloadFile';
import { IShoeWeight } from '../../../types/production.types';

function ViewShoeWeightPhotoDialog({ weight }: { weight: IShoeWeight }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === ProductionChoiceActions.view_shoe_photo ? true : false}
                onClose={() => setChoice({ type: ProductionChoiceActions.close_production })}
            > <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: ProductionChoiceActions.close_production })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>{weight.machine.name}</DialogTitle>
                <Typography sx={{ minWidth: '350px' }} textAlign={"center"}>{weight.dye.dye_number}</Typography>
                <DialogContent>
                    <Stack justifyContent={'center'}
                        onDoubleClick={() => {
                            if (weight && weight.shoe_photo&& weight.shoe_photo?.public_url) {
                                DownloadFile(weight.shoe_photo?.public_url, weight.shoe_photo?.filename)
                            }
                        }}>
                        <img width={350} src={weight.shoe_photo?.public_url} alt="shoe photo" />
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ViewShoeWeightPhotoDialog







