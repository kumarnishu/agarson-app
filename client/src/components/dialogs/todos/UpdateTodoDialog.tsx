import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { useContext } from 'react'
import { ChoiceContext, TodoChoiceActions } from '../../../contexts/dialogContext'
import { Cancel } from '@mui/icons-material'
import UpdateTodoForm from '../../forms/todo/UpdateTodoForm'
import { ITodo } from '../../../types/todo.types'

function UpdateTodoDialog({ todo }: { todo: ITodo }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === TodoChoiceActions.update_todo ? true : false}
            fullWidth
            onClose={() => setChoice({ type: TodoChoiceActions.close_todo })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TodoChoiceActions.close_todo })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Edit Todo</DialogTitle>
            <DialogContent>
                {todo && <UpdateTodoForm todo={todo} />}
            </DialogContent>
        </Dialog >
    )
}

export default UpdateTodoDialog
