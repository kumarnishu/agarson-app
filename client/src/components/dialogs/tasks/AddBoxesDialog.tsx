import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, TaskChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { ITask } from '../../../types/task.types';
import AddMoreBoxesForm from '../../forms/tasks/AddMoreBoxesForm';

function AddBoxesDialog({ task }: { task: ITask }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === TaskChoiceActions.add_more_boxes ? true : false}
                onClose={() => setChoice({ type: TaskChoiceActions.close_task })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TaskChoiceActions.close_task })}>
                    <Cancel fontSize='large' />
                </IconButton>

                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Add More Boxes
                </DialogTitle>
                <DialogContent>
                    <AddMoreBoxesForm task={task} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddBoxesDialog