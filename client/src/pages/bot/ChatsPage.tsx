import { AxiosResponse } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { GetChats } from '../../services/BotServices'
import { UserContext } from '../../contexts/userContext'
import ChatsTable from '../../components/tables/ChatTable'
import { IChat } from '../../types/chat.types'
import { LinearProgress, Stack, TextField, Typography } from '@mui/material'
import FuzzySearch from "fuzzy-search";

function ChatsPage() {
    const { user } = useContext(UserContext)
    const [filter, setFilter] = useState<string | undefined>()
    const [chats, setChats] = useState<IChat[]>([])
    const [prefilterChats, setPreFilteredChats] = useState<IChat[]>([])

    const { data, isSuccess, isLoading, error } = useQuery<AxiosResponse<IChat[]>, BackendError>("chats", async () => GetChats({ client_id: user?.client_id }))
    useEffect(() => {
        if (filter) {
            if (chats) {
                const searcher = new FuzzySearch(chats, ["name", "id.user", "lastMessage.body", "timestamp"], {
                    caseSensitive: false,
                });
                const result = searcher.search(filter);
                setChats(result)
            }
        }

        if (!filter) {
            setChats(prefilterChats)
        }
    }, [filter])

    useEffect(() => {
        if (isSuccess) {
            setChats(data.data)
            setPreFilteredChats(data.data)
        }
    }, [isSuccess])
    return (
        <>
            <Typography color="red" p={2}>{error && error.response.data.message || "error ocurred"}</Typography>
            {isLoading && <LinearProgress />}

            < Stack direction="row" p={2} gap={2} alignItems={'center'} justifyContent={'space-between'}>
                <Typography variant="button" fontWeight={'bold'}>WA Chats</Typography>
                <TextField
                    size="small"
                    onChange={(e) => setFilter(e.currentTarget.value)}
                    autoFocus
                    placeholder={`${chats?.length} records...`}
                    style={{
                        fontSize: '1.1rem',
                        border: '0',
                    }}
                />
            </Stack >
            <ChatsTable chats={chats} />
        </>
    )
}

export default ChatsPage