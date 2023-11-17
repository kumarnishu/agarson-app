import { Dialog, DialogTitle, DialogContent, IconButton, Button, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { ChoiceContext, TaskChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { ITask } from '../../../types/task.types';

function ViewTaskBoxesDialog({ task, dates }: {
    task: ITask, dates: {
        start_date?: string | undefined;
        end_date?: string | undefined;
    } | undefined
}) {
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
                <Typography variant='caption' textAlign={"center"}>
                    {dates?.start_date && new Date(dates?.start_date).toLocaleDateString()} to {dates?.end_date && new Date(dates?.end_date).toLocaleDateString()}
                </Typography>
                <DialogContent>
                    {task && task.boxes.map((box, index) => {
                        return (
                            <React.Fragment key={index}>
                                {
                                    new Date(box.date).getDay() !== 0 && Boolean(!box.is_completed && new Date(box.date) < new Date()) ?
                                        <Button variant="contained" size="small" sx={{ m: 1 }} color='error' disabled={new Date(box.date).getDay() === 0}>{new Date(box.date).getDate()}</Button>
                                        :
                                        <Button variant="contained" size="small" sx={{ m: 1 }} color={Boolean(box.is_completed) ? "success" : 'inherit'} disabled={new Date(box.date).getDay() === 0}>{new Date(box.date).getDate()}</Button>
                                }
                            </React.Fragment >
                        )
                    })}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ViewTaskBoxesDialog