import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
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
                maxHeight: '80vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>
                            <STableHeadCell
                            >


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
                                    }} />

                            </STableHeadCell>
                            {user?.contacts_access_fields.is_editable &&
                                <STableHeadCell
                                >

                                    Actions

                                </STableHeadCell>}
                            <STableHeadCell
                            >

                                Name

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Designation

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Mobile

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Created At

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Created By

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Updated At

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Updated By

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


                                                <Checkbox size="small"
                                                    checked={Boolean(selectAll)}
                                                />


                                            </STableCell>
                                            :
                                            null
                                        }
                                        {!selectAll ?
                                            <STableCell>

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

                                                        </Stack>}
                                                />

                                            </STableCell>}
                                        <STableCell>
                                            {contact.name}
                                        </STableCell>
                                        <STableCell>
                                            {contact.designation}
                                        </STableCell>
                                        <STableCell>
                                            {contact.mobile && contact.mobile.toString().replace("91", "").replace("@c.us", "")}
                                        </STableCell>
                                        <STableCell>
                                            {contact.created_at && new Date(contact.created_at).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {contact.created_by.username}
                                        </STableCell>
                                        <STableCell>
                                            {contact.updated_at && new Date(contact.updated_at).toLocaleString()}
                                        </STableCell>

                                        <STableCell>
                                            {contact.updated_by.username}
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