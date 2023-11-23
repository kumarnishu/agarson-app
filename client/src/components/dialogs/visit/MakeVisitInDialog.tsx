import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, VisitChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { IVisit } from '../../../types/visit.types';
import VisitInForm from '../../forms/visit/VisitInForm';

function MakeVisitInDialog({ visit }: { visit: IVisit }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)}  open={choice === VisitChoiceActions.visit_in ? true : false}
            > <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: VisitChoiceActions.close_visit })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>New Visit</DialogTitle>
                <DialogContent>
                    <Typography variant='caption'>Please Enable GPS before submit</Typography>
                    {visit && <VisitInForm visit={visit} />}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default MakeVisitInDialog




