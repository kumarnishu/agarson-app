import { AxiosResponse } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { GetChats } from '../../services/BotServices'
import { UserContext } from '../../contexts/userContext'
import ChatsTable from '../../components/tables/ChatTable'
import { IChat } from '../../types/chat.types'
import { FormControlLabel, InputAdornment, LinearProgress, Stack, Switch, TextField, Typography } from '@mui/material'
import FuzzySearch from "fuzzy-search";
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { Search } from '@mui/icons-material'

function ChatsPage() {
    const { user } = useContext(UserContext)
    const [limit, setLimit] = useState<number>(100)
    const [reverse, setReverse] = useState(true)
    const [filter, setFilter] = useState<string | undefined>()
    const [chats, setChats] = useState<IChat[]>([])
    const [prefilterChats, setPreFilteredChats] = useState<IChat[]>([])

    const { data, isSuccess, isLoading, error, refetch } = useQuery<AxiosResponse<IChat[]>, BackendError>("chats", async () => GetChats({ limit: limit }))


    useEffect(() => {
        if (filter && !reverse) {
            if (chats) {
                const searcher = new FuzzySearch(chats, ["from", "name", "body", "author", "authorName","timestamp"], {
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
        refetch()
    }, [limit])

    useEffect(() => {
        if (isSuccess) {
            setChats(data.data)
            setPreFilteredChats(data.data)
        }
    }, [isSuccess, data])
    return (
        <>
            {error && error.response && error.response.data && error.response.data.message && <Typography color="red" p={2}>{error.response.data.message}</Typography>}
            {isLoading && <LinearProgress />}
            < Stack direction="row" p={2} gap={2} alignItems={'center'} justifyContent={'space-between'} >
                <Typography variant='h6'>WA Chats</Typography>
                {user?.bot_access_fields.is_editable &&
                    <Stack direction="row" gap={2}>
                        <Stack
                            spacing={2} direction={"row"}
                             alignItems={"center"}
                        >
                            <label htmlFor="chats">Show </label>
                            <select id="chats"
                                style={{ width: '55px' }}
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value))
                                }}
                            >
                                {
                                    [100, 500, 1000, 2000, 5000].map(item => {
                                        return (<option key={item} value={item}>
                                            {item}
                                        </option>)
                                    })
                                }
                            </select>

                        </Stack>

                        <FormControlLabel control={<Switch
                            defaultChecked={Boolean(reverse)}
                            onChange={() => setReverse(!reverse)}
                        />} label="Reverse" />
                        <TextField
                            size="small"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>,
                            }}
                            onChange={(e) => setFilter(e.currentTarget.value)}
                            fullWidth
                            placeholder={`${chats?.length} records...`}
                            style={{
                                fontSize: '1.1rem',
                                border: '0',
                            }}
                        />
                    </Stack>}
            </Stack >

            {isLoading && <TableSkeleton />}
            {!isLoading &&
                <ChatsTable chats={chats} />}
        </>
    )
}

export default ChatsPage