import { InputAdornment, Stack, TextField } from '@mui/material'
import { Search } from '@mui/icons-material'


type Props = {
    contact: {
        mobile: string;
        name: string;
        is_sent: boolean;
        is_completed: false;
    } | undefined,
    setContact: React.Dispatch<React.SetStateAction<{
        mobile: string;
        name: string;
        is_sent: boolean;
        is_completed: false;
    } | undefined>>
    contacts: {
        mobile: string,
        name: string,
        is_sent: boolean,
        is_completed: false
    }[],

    setContacts: React.Dispatch<React.SetStateAction<{
        mobile: string,
        name: string,
        is_sent: boolean,
        is_completed: false
    }[]>>
}

export default function SelectContactsInput({ contacts }: Props) {
    // const [filter, setFilter] = useState<string>()
    // const [selectall, setSelectAll] = useState(false)
    return (
        <>

            < Stack direction="row" spacing={2}>
                <TextField
                    fullWidth

                    // onChange={(e) => setFilter(e.currentTarget.value)}
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
            {/* <Stack direction={"row"} alignItems={"center"} >
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
            </Stack> */}
            {/* {!selectAll && contacts.map((contact, index) => {
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
            })} */}
        </>

    )

}
