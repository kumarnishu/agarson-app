import { Dialog, DialogContent, DialogTitle, IconButton, Paper } from '@mui/material'
import NewTodoForm from '../../forms/todo/NewTodoForm'
import { useContext } from 'react'
import { ChoiceContext, TodoChoiceActions } from '../../../contexts/dialogContext'
import { Cancel } from '@mui/icons-material'

function CreateTodoDialog({ count }: { count: number }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Dialog component={Paper} fullScreen={Boolean(window.screen.width < 500)} open={choice === TodoChoiceActions.create_todo ? true : false}
            fullWidth
            onClose={() => setChoice({ type: TodoChoiceActions.close_todo })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TodoChoiceActions.close_todo })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>New Todo</DialogTitle>
            <DialogContent>
                <NewTodoForm count={count} />
            </DialogContent>
        </Dialog >
    )
}

export default CreateTodoDialog
