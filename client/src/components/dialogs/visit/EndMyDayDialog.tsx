import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, VisitChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { IVisit } from '../../../types/visit.types';
import EndMydayForm from '../../forms/visit/EndMyDayForm';

function EndMydayDialog({ visit }: { visit: IVisit }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === VisitChoiceActions.end_day ? true : false}
            > <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: VisitChoiceActions.close_visit })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>End My day</DialogTitle>
                <DialogContent>
                    <Typography variant='caption'>Please Enable GPS before submit</Typography>
                    <EndMydayForm visit={visit} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default EndMydayDialog




