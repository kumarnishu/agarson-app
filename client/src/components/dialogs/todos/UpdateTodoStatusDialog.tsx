import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { useContext } from 'react';
import { ChoiceContext, TodoChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { ITodo } from '../../../types/todo.types';
import UpdateTodoStatusForm from '../../forms/todos/UpdateTodoStatusForm';

function UpdateTodoStatusDialog({ todo }: { todo: ITodo }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === TodoChoiceActions.update_todo_status ? true : false}
                onClose={() => setChoice({ type: TodoChoiceActions.close_todo })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TodoChoiceActions.close_todo })}>
                    <Cancel fontSize='large' />
                </IconButton>

                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Add More Boxes
                </DialogTitle>
                <DialogContent>
                    <UpdateTodoStatusForm todo={todo} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default UpdateTodoStatusDialog