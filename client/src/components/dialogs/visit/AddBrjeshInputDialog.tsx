import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, VisitChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { IVisitReport } from '../../../types/visit.types';
import AddBrijeshInputForm from '../../forms/visit/AddBrijeshInputForm';

function AddBrijeshInputDialog({ visit }: { visit: IVisitReport }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === VisitChoiceActions.add_brijesh_input ? true : false}
            > <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: VisitChoiceActions.close_visit })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Brijesh input</DialogTitle>
                <DialogContent>
                    {visit && <AddBrijeshInputForm visit={visit} />}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddBrijeshInputDialog




