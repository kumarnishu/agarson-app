import { Checkbox, InputAdornment, Stack, TextField, Typography } from '@mui/material'

import { headColor } from '../../utils/colors'
import { Search } from '@mui/icons-material'
import { IContact } from '../../types/contact.types'

type Props = {
    contact: IContact | undefined,
    setContact: React.Dispatch<React.SetStateAction<IContact | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    contacts: IContact[],
    selectedContacts: IContact[]
    setSelectedContacts: React.Dispatch<React.SetStateAction<IContact[]>>,
    setFilter: React.Dispatch<React.SetStateAction<string | undefined>>
}

export default function SelectContactBox({ contact, selectAll, contacts, setSelectAll, setContact, selectedContacts, setSelectedContacts, setFilter }: Props) {

    return (
        <>
            < Stack direction="row" spacing={2} sx={{ bgcolor: headColor }
            }>
                <TextField
                    fullWidth

                    onChange={(e) => setFilter(e.currentTarget.value)}
                    autoFocus
                    InputProps={{
                        startAdornment: <InputAdornment position="start">
                            <Search />
                        </InputAdornment>,
                    }}
                    placeholder={`${contacts?.length} contacts...`}
                    style={{
                        fontSize: '1.1rem',
                        border: '0',
                    }}
                />
            </Stack >
            <Stack direction={"row"} alignItems={"center"} sx={{ bgcolor: headColor }}>
                <Checkbox
                    onChange={(e) => {
                        setContact(contact)
                        if (e.target.checked) {
                            setSelectAll(true)
                        }
                        if (!e.target.checked) {
                            setSelectAll(false)
                        }
                    }}
                />
                <Typography>Select All</Typography>
            </Stack>
            {!selectAll && contacts.map((contact, index) => {
                return (
                    <Stack key={index} direction={"row"} alignItems={"center"} sx={{ backgroundColor: 'whitesmoke', borderBottom: 2 }}>
                        <Checkbox
                            checked={Boolean(selectedContacts.filter((cont) => { return cont._id === contact._id }).length)}
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
                        <Stack p={1}>
                            <Typography variant='button'>{contact.name}</Typography>
                            <Typography variant="caption">{contact.mobile.replace("91", "").replace("@c.us", "")}</Typography>
                        </Stack>
                    </Stack>
                )
            })}

            {selectAll && contacts.map((contact, index) => {
                return (
                    <Stack key={index} direction={"row"} alignItems={"center"} sx={{ backgroundColor: 'whitesmoke', borderBottom: 2 }}>
                        <Checkbox
                            checked={Boolean(selectAll)}
                        />
                        <Stack p={1}>
                            <Typography variant='button'>{contact.name}</Typography>
                            <Typography variant="caption">{contact.mobile.replace("91", "").replace("@c.us", "")}</Typography>
                        </Stack>
                    </Stack>
                )
            })}
        </>

    )

}

