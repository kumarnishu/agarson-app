import { Dialog, DialogTitle, Stack, Typography, DialogContent, IconButton } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, TemplateChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { Asset } from '../../../types/asset.types';

function ViewTemplateDialog({ template }: {
    template: {
        message?: string | undefined;
        caption?: string | undefined;
        media?: Asset;
    }
}) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === TemplateChoiceActions.view_template ? true : false}
                onClose={() => setChoice({ type: TemplateChoiceActions.close_template })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TemplateChoiceActions.close_template })}>
                    <Cancel fontSize='large' />
                </IconButton>


                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Template</DialogTitle>
                <DialogContent>
                    {template.message || template.media ? <Stack sx={{ bgcolor: 'black', maxWidth: '350px', p: 2 }}>
                        {template.message && <Typography sx={{ p: 1, m: 1, bgcolor: 'lightgreen', whiteSpace: 'pre-wrap', border: 1, borderColor: 'darkgreen', borderRadius: 1 }}>{template.message.replaceAll("\\n", "\n").replaceAll("\\t", "\t")}</Typography>}
                        {template.media && <Stack sx={{ bgcolor: 'lightgreen', m: 1, p: 1, wordBreak: 'break-all', border: 5, borderColor: 'darkgreen', borderRadius: 2 }}>
                            {/* @ts-ignore */}
                            {template.media && <img src={template.media.public_url} alt="image" />}
                            {template.media && <Typography sx={{ py: 1, whiteSpace: 'pre-wrap' }}>{template.caption?.replaceAll("\\n", "\n").replaceAll("\\t", "\t")}</Typography>}
                        </Stack>}
                    </Stack> : null}
                </DialogContent>

            </Dialog>
        </>
    )
}

export default ViewTemplateDialog