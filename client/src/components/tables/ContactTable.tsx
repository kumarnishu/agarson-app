import { Box, Checkbox, FormControlLabel, IconButton, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, ContactChoiceActions } from '../../contexts/dialogContext'
import PopUp from '../popup/PopUp'
import { Delete, Edit } from '@mui/icons-material'
import UpdateContactDialog from '../dialogs/contacts/UpdateContactDialog'
import DeleteContactDialog from '../dialogs/contacts/DeleteContactDialog'
import { IContact } from '../../types/contact.types'
import { UserContext } from '../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'


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
                <STable
                   >
                    <STableHead
                    >
                        <STableRow>
                            <STableHeadCell
                                                     >
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
                            </STableHeadCell>
                            { user?.contacts_access_fields.is_editable &&
                            <STableHeadCell
                                                     >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Actions
                                </Stack>
                            </STableHeadCell>}
                            <STableHeadCell
                                                     >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Name
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                                                     >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Mobile
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                                                     >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Created At
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                                                     >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Created By
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                                                     >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Updated At
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                                                     >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Updated By
                                </Stack>
                            </STableHeadCell>


                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {
                            contacts && contacts.map((contact, index) => {
                                return (
                                    <STableRow
                                        key={index}
                                        >
                                        {selectAll ?
                                            <STableCell>
                                                <Stack direction="row"
                                                    spacing={2}
                                                    justifyContent="left"
                                                    alignItems="center"
                                                >

                                                    <Checkbox size="small"
                                                        checked={Boolean(selectAll)}
                                                    />

                                                </Stack>
                                            </STableCell>
                                            :
                                            null
                                        }
                                        {!selectAll ?
                                            <STableCell>
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
                                            </STableCell>
                                            :
                                            null
                                        }
                                        {/* actions */}
                                        {user?.contacts_access_fields.is_editable &&
                                            <STableCell>
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

                                            </STableCell>}
                                        <STableCell>
                                            <Typography variant="body1">{contact.name}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography variant="body1">{contact.mobile && contact.mobile.toString().replace("91", "").replace("@c.us", "")}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography variant="body1">{contact.created_at && new Date(contact.created_at).toLocaleString()}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography variant="body1">{contact.created_by.username}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography variant="body1">{contact.updated_at && new Date(contact.updated_at).toLocaleString()}</Typography>
                                        </STableCell>

                                        <STableCell>
                                            <Typography variant="body1">{contact.updated_by.username}</Typography>
                                        </STableCell>

                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>
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