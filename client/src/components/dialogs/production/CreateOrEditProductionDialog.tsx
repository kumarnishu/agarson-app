import { Dialog, DialogContent, DialogTitle, Stack, IconButton } from '@mui/material'
import { useContext } from 'react';
import { ChoiceContext, ProductionChoiceActions } from '../../../contexts/dialogContext.tsx';
import { Cancel } from '@mui/icons-material';
import { GetProductionDto } from '../../../dtos/production/production.dto.ts';
import CreateOrEditProductionForm from '../../forms/production/CreateOrEditProductionForm.tsx';


function CreateOrEditProductionDialog({ production }: { production?: GetProductionDto }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === ProductionChoiceActions.create_or_edit_production ? true : false}
            onClose={() => setChoice({ type: ProductionChoiceActions.close_production })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: ProductionChoiceActions.close_production })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                {production ? "Update Production" : "New Production"}
            </DialogTitle>

            <DialogContent>
                <CreateOrEditProductionForm production={production} />
            </DialogContent>
            <Stack
                direction="column"
                gap={2}
                padding={2}
                width="100%"
            >
            </Stack >
        </Dialog >
    )
}

export default CreateOrEditProductionDialog
