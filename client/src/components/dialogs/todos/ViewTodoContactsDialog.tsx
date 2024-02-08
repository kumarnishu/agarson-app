import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useContext } from 'react';
import { TodoChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { ITodo } from '../../../types/todo.types';
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../styled/STyledTable';

function ViewTodoContactsDialog({ todo }: { todo: ITodo }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === TodoChoiceActions.view_contacts ? true : false}
                scroll="paper"
                onClose={() => setChoice({ type: TodoChoiceActions.close_todo })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TodoChoiceActions.close_todo })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '300px' }} textAlign="center">Todo Contacts</DialogTitle>
                <DialogContent>
                    <STable>
                        <STableHead>
                            <STableHeadCell style={{ padding: '10px' }}>
                                Name
                            </STableHeadCell>
                            <STableHeadCell>
                                Mobile
                            </STableHeadCell>
                            <STableHeadCell>
                                Whatsapp Satus
                            </STableHeadCell>
                           
                            <STableHeadCell>
                                Timestamp
                            </STableHeadCell>
                        </STableHead>
                        <STableBody>
                            {todo.contacts.map((contact, index) => {
                                return (
                                    <STableRow key={index}>
                                        <STableCell style={{ padding: '10px' }}>
                                            {contact.name}
                                        </STableCell>
                                        <STableCell>
                                            {contact.mobile}
                                        </STableCell>
                                        <STableCell>
                                            {contact.is_sent ? "Sent" : "pending"}
                                        </STableCell>

                                        <STableCell>
                                            {contact.timestamp ? new Date(contact.timestamp).toLocaleString() : ""}
                                        </STableCell>
                                    </STableRow>
                                )
                            })}
                        </STableBody>
                    </STable>
                </DialogContent>
            </Dialog >
        </>
    )
}

export default ViewTodoContactsDialog