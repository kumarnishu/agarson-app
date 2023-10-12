import { Dialog, DialogTitle, Stack, Typography, DialogContent, IconButton } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, TemplateChoiceActions } from '../../../contexts/dialogContext';
import { IMessageTemplate } from '../../../types';
import { Cancel } from '@mui/icons-material';

function ViewTemplateDialog({ template }: { template: IMessageTemplate }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog open={choice === TemplateChoiceActions.view_template ? true : false}
                onClose={() => setChoice({ type: TemplateChoiceActions.close_template })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TemplateChoiceActions.close_template })}>
                    <Cancel fontSize='large' />
                </IconButton>


                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Template</DialogTitle>
                <DialogContent>
                    {template.message || template.media ? <Stack sx={{ bgcolor: 'black', maxWidth: '350px', p: 2 }}>
                        {template.message && <Typography sx={{ p: 1, m: 1, bgcolor: 'lightgreen', border: 1, borderColor: 'darkgreen', borderRadius: 1 }}>{template.message}</Typography>}
                        {template.media && <Stack sx={{ bgcolor: 'lightgreen', m: 1, p: 1, wordBreak: 'break-all', border: 5, borderColor: 'darkgreen', borderRadius: 2 }}>
                            {/* @ts-ignore */}
                            {template.media && <img src={template.media.public_url} alt="image" />}
                            {template.media && <Typography sx={{ py: 1 }}>{template.caption}</Typography>}
                        </Stack>}
                    </Stack> : null}
                </DialogContent>

            </Dialog>
        </>
    )
}

export default ViewTemplateDialog