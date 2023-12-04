import { AxiosResponse } from 'axios'
import { useContext } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { GetChats } from '../../services/BotServices'
import { UserContext } from '../../contexts/userContext'

function ChatsPage() {
    const { user } = useContext(UserContext)
    const { data } = useQuery<AxiosResponse<{ chats: any, page: number, total: number, limit: number }>, BackendError>("chats", async () => GetChats({ client_id: user?.client_id }))
    console.log(data)
    return (
        <div>ChatsPage</div>
    )
}

export default ChatsPage