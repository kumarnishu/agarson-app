import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, VisitChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { IVisitReport } from '../../../types/visit.types';

function ViewCommentsDialog({ visit }: { visit: IVisitReport }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === VisitChoiceActions.view_comments ? true : false}
                onClose={() => setChoice({ type: VisitChoiceActions.close_visit })}
            > <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: VisitChoiceActions.close_visit })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Comments</DialogTitle>
                <DialogContent>

                    {/* salesmen */}
                    {
                        visit.summary && <>
                            <Typography variant="subtitle1" sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: 'white', p: 1 }} textAlign={'center'} fontWeight={'bold'}>SalesPerson</Typography>
                            <Stack
                                gap={1}
                                py={1}
                                justifyContent="left"
                            >
                                <Typography sx={{ textTransform: "capitalize",wordBreak:'break-all' }}> <pre>
                                    {visit.summary}
                                </pre></Typography>
                            </Stack >
                        </>}
                    {/* ankit */}
                    {
                        visit.ankit_input && visit.ankit_input.input && <>
                            <Typography variant="subtitle1" sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: 'white', p: 1 }} textAlign={'center'} fontWeight={'bold'}>Ankit Comment</Typography>
                            <Stack
                                gap={1}
                                py={1}
                                justifyContent="left"
                            >
                                <Typography sx={{ textTransform: "capitalize" }}> <pre>
                                    {visit.ankit_input && visit.ankit_input.input}
                                </pre></Typography>
                            </Stack >
                        </>}

                    {/* brijesh */}
                    {
                        visit.brijesh_input && visit.brijesh_input.input && <>
                            <Typography variant="subtitle1" sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: 'white', p: 1 }} textAlign={'center'} fontWeight={'bold'}>Brijesh Comment</Typography>
                            <Stack
                                gap={1}
                                py={1}
                                justifyContent="left"
                            >
                                <Typography sx={{ textTransform: "capitalize" }}> <pre>
                                    {visit.brijesh_input && visit.brijesh_input.input}
                                </pre></Typography>
                            </Stack >
                        </>
                    }

                </DialogContent>
            </Dialog>
        </>
    )
}

export default ViewCommentsDialog







