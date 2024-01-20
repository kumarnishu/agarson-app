import { Button, Checkbox, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { Add, Search } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import FuzzySearch from 'fuzzy-search'


type Props = {
    contacts: {
        mobile: string,
        name: string,
        is_sent: boolean,
        status: string
    }[],

    setContacts: React.Dispatch<React.SetStateAction<{
        mobile: string,
        name: string,
        is_sent: boolean,
        status: string
    }[]>>
    selectedContacts: {
        mobile: string,
        name: string,
        is_sent: boolean,
        status: string
    }[],

    setSelectedContacts: React.Dispatch<React.SetStateAction<{
        mobile: string,
        name: string,
        is_sent: boolean,
        status: string
    }[]>>
}

export default function SelectContactsInput({ contacts, selectedContacts, setSelectedContacts }: Props) {
    const [filter, setFilter] = useState<string>()
    const [contact, setContact] = useState<{
        mobile: string,
        name: string,
        is_sent: boolean,
        status: string
    }>()
    const [filterdContacts, setFilteredContacts] = useState<{
        mobile: string,
        name: string,
        is_sent: boolean,
        status: string
    }[]>(contacts)

    useEffect(() => {
        if (filter) {
            if (contacts) {
                const searcher = new FuzzySearch(contacts, ["name", "mobile"], {
                    caseSensitive: false,
                });
                const result = searcher.search(filter);
                setFilteredContacts(result)
            }
        }
        if (!filter)
            setFilteredContacts(contacts)

    }, [filter])
    return (
        <>
            {/* add new mobile number */}
            < Stack direction="row" spacing={2}>
                <TextField
                    fullWidth
                    type="search"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    onChange={(e) => {
                        setFilter(e.currentTarget.value)
                        if (String(e.currentTarget.value).length === 10)
                            setContact({
                                name: "",
                                mobile: e.target.value,
                                status: "pending",
                                is_sent: false
                            })
                    }
                    }
                    placeholder={`${selectedContacts?.length} contacts selected`}
                    style={{
                        fontSize: '1.1rem',
                        border: '0',
                    }}
                />
                <Button variant="contained" onClick={() => {
                    if (contact) {
                        setSelectedContacts([...selectedContacts, contact])
                        setContact(undefined)
                    }
                }}><Add /></Button>
            </Stack >
            {!filter && selectedContacts.map((contact, index) => {
                return (
                    <Stack key={index} direction={"row"} alignItems={"center"} sx={{ backgroundColor: 'whitesmoke', borderBottom: 2 }}>
                        <Checkbox
                            checked={Boolean(selectedContacts.filter((cont) => { return cont.mobile === contact.mobile }).length)}
                            onChange={(e) => {
                                setContact(contact)
                                if (e.target.checked) {
                                    setSelectedContacts([...selectedContacts, contact])
                                }
                                if (!e.target.checked) {
                                    setSelectedContacts((contacts) => contacts.filter((item) => {
                                        return item.mobile !== contact.mobile
                                    }))
                                }
                                setContact(undefined)
                            }}
                        />
                        <Stack p={1}>
                            <Typography variant='button'>{contact.name}</Typography>
                            <Typography variant="caption">{contact.mobile.replace("91", "").replace("@c.us", "")}</Typography>
                        </Stack>
                    </Stack>
                )
            })}
            {filter && filterdContacts.map((contact, index) => {
                return (
                    <Stack key={index} direction={"row"} alignItems={"center"} sx={{ backgroundColor: 'whitesmoke', borderBottom: 2 }}>
                        <Checkbox
                            checked={Boolean(selectedContacts.filter((cont) => { return cont.mobile === contact.mobile }).length)}
                            onChange={(e) => {
                                setContact(contact)
                                if (e.target.checked) {
                                    setSelectedContacts([...selectedContacts, contact])
                                }
                                if (!e.target.checked) {
                                    setSelectedContacts((contacts) => contacts.filter((item) => {
                                        return item.mobile !== contact.mobile
                                    }))
                                }
                                setContact(undefined)
                            }}
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
