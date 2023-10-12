import { Dialog, DialogContent, DialogTitle,   IconButton } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, TemplateChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import NewtemplateForm from '../../forms/templates/NewTemplateForm';

function NewTemplateDialog() {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog open={choice === TemplateChoiceActions.create_template ? true : false}
              
            > <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TemplateChoiceActions.close_template })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>New Template</DialogTitle>
                <DialogContent>
                    <NewtemplateForm />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default NewTemplateDialog