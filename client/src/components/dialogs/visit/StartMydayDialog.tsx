import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, VisitChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import StartMydayForm from '../../forms/visit/StartMyDayForm';

function StartMydayDialog() {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)}  open={choice === VisitChoiceActions.start_day ? true : false}
            > <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: VisitChoiceActions.close_visit })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Start My day</DialogTitle>
                <DialogContent>
                    <Typography variant="caption">Please Enable Gps First</Typography>
                    <StartMydayForm />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default StartMydayDialog




