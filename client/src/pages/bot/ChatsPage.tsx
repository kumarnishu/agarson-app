import { AxiosResponse } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { GetChats } from '../../services/BotServices'
import { UserContext } from '../../contexts/userContext'
import ChatsTable from '../../components/tables/ChatTable'
import { IChat } from '../../types/chat.types'
import { FormControlLabel, LinearProgress, Stack, Switch, TextField, Typography } from '@mui/material'
import FuzzySearch from "fuzzy-search";
import { IUser } from '../../types/user.types'
import { GetUsers } from '../../services/UserServices'

function ChatsPage() {
    const { user } = useContext(UserContext)
    const [reverse, setReverse] = useState(true)
    const [filter, setFilter] = useState<string | undefined>()
    const [chats, setChats] = useState<IChat[]>([])
    const [prefilterChats, setPreFilteredChats] = useState<IChat[]>([])
    const [clientId, setClientId] = useState<string | undefined>(user?.client_id)
    const [users, setUsers] = useState<IUser[]>([])

    const { data, isSuccess, isLoading, error, refetch } = useQuery<AxiosResponse<IChat[]>, BackendError>("chats", async () => GetChats({ client_id: clientId }))

    const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", GetUsers)

    useEffect(() => {
        if (filter && !reverse) {
            if (chats) {
                const searcher = new FuzzySearch(chats, ["from", "name", "author.body", "timestamp"], {
                    caseSensitive: false,
                });
                let result = searcher.search(filter);
                setChats(result)
            }
        }
        if (filter && reverse) {
            let result = chats;
            if (reverse) {
                result = result.filter((result) => {
                    return String(result.from) !== String(filter)
                })
            }
            setChats(result)
        }

        if (!filter) {
            setChats(prefilterChats)
        }
    }, [filter, reverse])


    useEffect(() => {
        if (isUsersSuccess)
            setUsers(usersData?.data)
    }, [users, isUsersSuccess, usersData])


    useEffect(() => {
        if (isSuccess) {
            setChats(data.data)
            setPreFilteredChats(data.data)
        }
    }, [isSuccess, data])
    console.log(filter)
    return (
        <>
            {error && error.response && error.response.data && error.response.data.message && <Typography color="red" p={2}>{error.response.data.message}</Typography>}
            {isLoading && <LinearProgress />}
            < Stack direction="row" p={2} gap={2} alignItems={'center'} justifyContent={'space-between'}>
                <Typography variant="button" fontWeight={'bold'}>Chats</Typography>
                {user?.bot_access_fields.is_editable &&
                    <Stack direction="row" gap={2}>
                        < TextField
                            size='small'
                            select
                            SelectProps={{
                                native: true,
                            }}
                            onChange={(e) => {
                                setClientId(e.target.value)
                                refetch()
                            }}
                            focused
                            fullWidth
                            required
                            id="chat"
                            label="Filter Chats Of Indivdual"
                        >
                            <option key={'00'} value={user.client_id}>
                                {user.username}
                            </option>
                            {
                                users.map((user, index) => {
                                    if (user.connected_number)
                                        return (<option key={index} value={user.client_id}>
                                            {user.username}
                                        </option>)
                                    else
                                        return null
                                })
                            }
                        </TextField>
                        <FormControlLabel control={<Switch
                            defaultChecked={Boolean(reverse)}
                            onChange={() => setReverse(!reverse)}
                        />} label="Reverse" />
                        <TextField
                            size="small"
                            onChange={(e) => setFilter(e.currentTarget.value)}
                            autoFocus
                            fullWidth
                            placeholder={`${chats?.length} records...`}
                            style={{
                                fontSize: '1.1rem',
                                border: '0',
                            }}
                        />
                    </Stack>}
            </Stack >
            {isLoading && <LinearProgress />}
            <ChatsTable chats={chats} />
        </>
    )
}

export default ChatsPage