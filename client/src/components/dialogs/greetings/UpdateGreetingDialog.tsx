import { Dialog,  DialogTitle,  IconButton } from '@mui/material';
import { useContext } from 'react';
import { GreetingChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { IGreeting } from '../../../types/greeting.types';
import EditGreetingForm from '../../forms/greeting/EditGreetingForm';
import { Cancel } from '@mui/icons-material';

function UpdateGreetingDialog({ greeting }: { greeting: IGreeting }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog open={choice === GreetingChoiceActions.update_greeting ? true : false}
                
            >   <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: GreetingChoiceActions.close_greeting })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Update Greeting</DialogTitle>
                {greeting && <EditGreetingForm greeting={greeting} />}
               
            </Dialog>
        </>
    )
}

export default UpdateGreetingDialog




