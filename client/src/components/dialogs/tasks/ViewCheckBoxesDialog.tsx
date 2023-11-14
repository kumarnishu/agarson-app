import { Dialog, DialogTitle, DialogContent, IconButton, Tooltip, Radio } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, TaskChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { ITask } from '../../../types/task.types';

function ViewTaskDialog({ task }: { task: ITask }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === TaskChoiceActions.view_boxes ? true : false}
                onClose={() => setChoice({ type: TaskChoiceActions.close_task })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TaskChoiceActions.close_task })}>
                    <Cancel fontSize='large' />
                </IconButton>

                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Checked : {task.boxes.filter((box) => {
                    return box.is_completed && new Date(box.date) <= new Date()
                }).length}

                    /{task.boxes.filter((box) => {
                        return new Date(box.date).getDay() !== 0 && new Date(box.date) < new Date()
                    }).length}

                </DialogTitle>
                <DialogContent>
                    {task && task.boxes.map((box, index) => {
                        return (
                            <Tooltip key={index} title={new Date(box.date).toLocaleDateString()}>
                                {new Date(box.date).getDay() !== 0 && Boolean(!box.is_completed && new Date(box.date) < new Date()) ?
                                    <Radio size='medium' color='error' disabled={new Date(box.date).getDay() === 0} checked={Boolean(!box.is_completed)} />
                                    :
                                    <Radio size='medium' color="success" disabled={new Date(box.date).getDay() === 0} checked={Boolean(box.is_completed)} />
                                }
                            </Tooltip>
                        )
                    })}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ViewTaskDialog