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
        <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === ProductionChoiceActions.update_shoe_weight ? true : false}
            onClose={() => setChoice({ type: ProductionChoiceActions.close_production })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: ProductionChoiceActions.close_production })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">

                {!shoe_weight.shoe_weight1 && !shoe_weight.shoe_weight2 && !shoe_weight.shoe_weight3 && ' Update Shoe Weight 1'}
                {shoe_weight.shoe_weight1 && !shoe_weight.shoe_weight2 && !shoe_weight.shoe_weight3 && ' Update Shoe Weight 2'}
                {shoe_weight.shoe_weight1 && shoe_weight.shoe_weight2 && !shoe_weight.shoe_weight3 && ' Update Shoe Weight 3'}
            </DialogTitle>

            <DialogContent>
                {!shoe_weight.shoe_weight1 && !shoe_weight.shoe_weight2 && !shoe_weight.shoe_weight3 && <UpdateShoeWeightForm shoe_weight={shoe_weight} />}
                {shoe_weight.shoe_weight1 && !shoe_weight.shoe_weight2 && !shoe_weight.shoe_weight3 && <UpdateShoeWeightForm2 shoe_weight={shoe_weight} />}
                {shoe_weight.shoe_weight1 && shoe_weight.shoe_weight2 && !shoe_weight.shoe_weight3 && <UpdateShoeWeightForm3 shoe_weight={shoe_weight} />}


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
