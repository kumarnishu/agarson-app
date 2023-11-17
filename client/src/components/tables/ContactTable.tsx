import { Box, Checkbox, FormControlLabel, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, ContactChoiceActions } from '../../contexts/dialogContext'
import PopUp from '../popup/PopUp'
import { Delete, Edit } from '@mui/icons-material'
import UpdateContactDialog from '../dialogs/contacts/UpdateContactDialog'
import DeleteContactDialog from '../dialogs/contacts/DeleteContactDialog'
import { IContact } from '../../types/contact.types'
import { UserContext } from '../../contexts/userContext'


type Props = {
    contact: IContact | undefined,
    setContact: React.Dispatch<React.SetStateAction<IContact | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    contacts: IContact[],
    selectedContacts: IContact[]
    setSelectedContacts: React.Dispatch<React.SetStateAction<IContact[]>>,
}
function ContactsTable({ contact, selectAll, contacts, setSelectAll, setContact, selectedContacts, setSelectedContacts }: Props) {
    const [data, setData] = useState<IContact[]>(contacts)
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    useEffect(() => {
        if (data)
            setData(contacts)
    }, [contacts, data])
    return (
        <>
            <Box sx={{
                overflow: "scroll",
                maxHeight: '67vh'
            }}>
                <Table
                    stickyHeader
                    sx={{ minWidth: "1200px" }}
                    size="small">
                    <TableHead
                    >
                        <TableRow>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <FormControlLabel sx={{ fontSize: 12 }} control={
                                        <Checkbox
                                            indeterminate={selectAll ? true : false}
                                            checked={Boolean(selectAll)}
                                            size="small" onChange={(e) => {
                                                if (e.currentTarget.checked) {
                                                    setSelectedContacts(contacts)
                                                    setSelectAll(true)
                                                }
                                                if (!e.currentTarget.checked) {
                                                    setSelectedContacts([])
                                                    setSelectAll(false)
                                                }
                                            }} />}
                                        label=""
                                    />
                                </Stack>
                            </TableCell>
                            { user?.contacts_access_fields.is_editable &&
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Actions
                                </Stack>
                            </TableCell>}
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Name
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Mobile
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Created At
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Created By
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Updated At
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Updated By
                                </Stack>
                            </TableCell>


                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {
                            contacts && contacts.map((contact, index) => {
                                return (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            '&:nth-of-type(odd)': { bgcolor: color1 },
                                            '&:nth-of-type(even)': { bgcolor: color2 },
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer' }
                                        }}>
                                        {selectAll ?
                                            <TableCell>
                                                <Stack direction="row"
                                                    spacing={2}
                                                    justifyContent="left"
                                                    alignItems="center"
                                                >

                                                    <Checkbox size="small"
                                                        checked={Boolean(selectAll)}
                                                    />

                                                </Stack>
                                            </TableCell>
                                            :
                                            null
                                        }
                                        {!selectAll ?
                                            <TableCell>
                                                <Stack direction="row"
                                                    spacing={2}
                                                    justifyContent="left"
                                                    alignItems="center"
                                                >
                                                    <Checkbox size="small"
                                                        onChange={(e) => {
                                                            setContact(contact)
                                                            if (e.target.checked) {
                                                                setSelectedContacts([...selectedContacts, contact])
                                                            }
                                                            if (!e.target.checked) {
                                                                setSelectedContacts((contacts) => contacts.filter((item) => {
                                                                    return item._id !== contact._id
                                                                }))
                                                            }
                                                        }}
                                                    />
                                                </Stack>
                                            </TableCell>
                                            :
                                            null
                                        }
                                        {/* actions */}
                                        {user?.contacts_access_fields.is_editable &&
                                            <TableCell>
                                                <PopUp
                                                    element={
                                                        <Stack direction="row">
                                                            <>
                                                                <Tooltip title="edit">
                                                                    <IconButton
                                                                        onClick={() => {
                                                                            setContact(contact)
                                                                            setChoice({ type: ContactChoiceActions.update_contact })

                                                                        }}

                                                                    >
                                                                        <Edit />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                {user?.contacts_access_fields.is_deletion_allowed &&
                                                                <Tooltip title="Delete">
                                                                    <IconButton color="primary"
                                                                        onClick={() => {
                                                                            setContact(contact)
                                                                            setChoice({ type: ContactChoiceActions.delete_contact })

                                                                        }}
                                                                    >
                                                                        <Delete />
                                                                    </IconButton>
                                                                </Tooltip>}
                                                            </>
                                                        </Stack>
                                                    }
                                                />

                                            </TableCell>}
                                        <TableCell>
                                            <Typography variant="body1">{contact.name}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{contact.mobile && contact.mobile.toString().replace("91", "").replace("@c.us", "")}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{contact.created_at && new Date(contact.created_at).toLocaleString()}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{contact.created_by.username}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{contact.updated_at && new Date(contact.updated_at).toLocaleString()}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body1">{contact.updated_by.username}</Typography>
                                        </TableCell>

                                    </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>
                {
                    contact ?
                        <>
                            <UpdateContactDialog contact={contact} />
                            <DeleteContactDialog contact={contact} />
                        </> : null
                }
            </Box>
        </>
    )
}

export default ContactsTable