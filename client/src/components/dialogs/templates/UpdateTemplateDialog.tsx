import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, TemplateChoiceActions } from '../../../contexts/dialogContext';
import UpdateTemplateForm from '../../forms/templates/UpdateTemplateForm';
import { Cancel } from '@mui/icons-material';
import { IMessageTemplate } from '../../../types/template.types';

function UpdateTemplateDialog({ template }: { template: IMessageTemplate }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog open={choice === TemplateChoiceActions.update_template ? true : false}

            > <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TemplateChoiceActions.close_template })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Update Template</DialogTitle>
                <DialogContent>
                    {template && <UpdateTemplateForm template={template} />}
                </DialogContent>

            </Dialog>
        </>
    )
}

export default UpdateTemplateDialog




