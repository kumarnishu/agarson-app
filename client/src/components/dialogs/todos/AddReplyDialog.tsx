import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, TodoChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { ITodo } from '../../../types/todo.types';
import UpdateTodoStatusForm from '../../forms/todo/AddTodoReplyForm';

function AddReplyDialog({ todo }: { todo: ITodo }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === TodoChoiceActions.add_reply ? true : false}
                onClose={() => setChoice({ type: TodoChoiceActions.close_todo })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TodoChoiceActions.close_todo })}>
                    <Cancel fontSize='large' />
                </IconButton>

                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>New Reply
                </DialogTitle>
                <DialogContent>
                    <UpdateTodoStatusForm todo={todo} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddReplyDialog