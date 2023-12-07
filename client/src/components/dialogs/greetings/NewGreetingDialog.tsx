import { Dialog, DialogTitle, IconButton } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, GreetingChoiceActions } from '../../../contexts/dialogContext';
import NewGreetingForm from '../../forms/greeting/NewGreetingForm';
import { Cancel } from '@mui/icons-material';

function NewGreetingDialog() {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog open={choice === GreetingChoiceActions.create_greeting ? true : false}
               
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: GreetingChoiceActions.close_greeting })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>New Greeting</DialogTitle>
                <NewGreetingForm />

            </Dialog>
        </>
    )
}

export default NewGreetingDialog