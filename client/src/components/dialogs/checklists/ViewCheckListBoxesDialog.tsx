import { Dialog, DialogTitle, DialogContent, IconButton, Button, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { ChoiceContext, CheckListChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { IChecklist } from '../../../types/checklist.types';

function ViewCheckListBoxesDialog({ checklist, dates }: {
    checklist: IChecklist, dates: {
        start_date?: string | undefined;
        end_date?: string | undefined;
    } | undefined
}) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === CheckListChoiceActions.view_checklist_boxes ? true : false}
                onClose={() => setChoice({ type: CheckListChoiceActions.close_checklist })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: CheckListChoiceActions.close_checklist })}>
                    <Cancel fontSize='large' />
                </IconButton>

                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Checked :  Checked : {checklist.boxes.filter((box) => {
                    return box.desired_date && box.actual_date && new Date(box.desired_date) <= new Date()
                }).length} / {checklist.boxes.filter((box) => {
                    return box.desired_date && new Date(box.desired_date) <= new Date()
                }).length}
                </DialogTitle>
                <Typography variant='caption' textAlign={"center"}>
                    {dates?.start_date && new Date(dates?.start_date).toLocaleDateString()} to {dates?.end_date && new Date(dates?.end_date).toLocaleDateString()}
                </Typography>
                <DialogContent>
                    {checklist && checklist.boxes.map((box, index) => {
                        return (
                            <React.Fragment key={index}>
                                {
                                    box.desired_date && !box.actual_date ?
                                        <Button variant="contained" size="small" sx={{ m: 1 }} color='inherit' disabled={new Date(box.desired_date) > new Date()}>{new Date(box.desired_date).getDate()}</Button>
                                        :
                                        <Button variant="contained" size="small" sx={{ m: 1 }} color={Boolean(box.desired_date && !box.actual_date) ? "success" : 'error'} >{new Date(box.desired_date).getDate()}</Button>
                                }
                            </React.Fragment >
                        )
                    })}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ViewCheckListBoxesDialog