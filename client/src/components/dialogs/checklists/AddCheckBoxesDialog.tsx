import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, CheckListChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { IChecklist } from '../../../types/checklist.types';
import AddMoreCheckBoxesForm from '../../forms/checklists/AddMoreCheckBoxesForm';

function AddCheckBoxesDialog({ checklist }: { checklist: IChecklist }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === CheckListChoiceActions.add_more_check_boxes ? true : false}
                onClose={() => setChoice({ type: CheckListChoiceActions.close_checklist })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: CheckListChoiceActions.close_checklist })}>
                    <Cancel fontSize='large' />
                </IconButton>

                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Add More Boxes
                </DialogTitle>
                <DialogContent>
                    <AddMoreCheckBoxesForm checklist={checklist} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddCheckBoxesDialog