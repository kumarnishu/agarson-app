import { Dialog, DialogContent, DialogTitle, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useContext } from 'react';
import { TodoChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { ITodo } from '../../../types/todo.types';

function ViewTodoRepliesDialog({ todo }: { todo: ITodo }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === TodoChoiceActions.view_replies ? true : false}
                scroll="paper"
                onClose={() => setChoice({ type: TodoChoiceActions.close_todo })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TodoChoiceActions.close_todo })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '300px' }} textAlign="center">{todo.title.slice(0, 10)}...</DialogTitle>
                <DialogContent>
                    {todo.replies.map((reply, index) => {
                        return (
                            <Stack key={index}>
                                <Paper elevation={8} sx={{ p: 2, mt: 1, boxShadow: 2, backgroundColor: 'whitesmoke' }}>
                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        <b>{reply.created_by.username}</b> : {reply.reply}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        Timestamp : {new Date(reply.timestamp).toLocaleString()}
                                    </Typography>
                                </Paper>
                            </Stack>
                        )
                    })}
                </DialogContent>
            </Dialog >
        </>
    )
}

export default ViewTodoRepliesDialog