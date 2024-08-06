import { Dialog, DialogContent, DialogTitle, Stack, IconButton } from '@mui/material'
import { useContext } from 'react';
import { ChoiceContext, ProductionChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { IShoeWeight } from '../../../types/production.types';
import UpdateShoeWeightForm from '../../forms/production/UpdateShoeWeightForm';
import UpdateShoeWeightForm2 from '../../forms/production/UpdateShoeWeightForm2';
import UpdateShoeWeightForm3 from '../../forms/production/UpdateShoeWeightForm3';


function UpdateShoeWeightDialog({ shoe_weight }: { shoe_weight: IShoeWeight }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === ProductionChoiceActions.update_shoe_weight1 || choice === ProductionChoiceActions.update_shoe_weight2 || choice === ProductionChoiceActions.update_shoe_weight3 ? true : false}
            onClose={() => setChoice({ type: ProductionChoiceActions.close_production })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: ProductionChoiceActions.close_production })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">

                {choice === ProductionChoiceActions.update_shoe_weight1  && ' Update Shoe Weight 1'}
                {choice === ProductionChoiceActions.update_shoe_weight2 && ' Update Shoe Weight 2'}
                {choice === ProductionChoiceActions.update_shoe_weight3 && ' Update Shoe Weight 3'}
            </DialogTitle>

            <DialogContent>
                {choice === ProductionChoiceActions.update_shoe_weight1 && <UpdateShoeWeightForm shoe_weight={shoe_weight} />}
                {choice === ProductionChoiceActions.update_shoe_weight2  && <UpdateShoeWeightForm2 shoe_weight={shoe_weight} />}
                {choice === ProductionChoiceActions.update_shoe_weight3 && <UpdateShoeWeightForm3 shoe_weight={shoe_weight} />}


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

export default UpdateShoeWeightDialog
