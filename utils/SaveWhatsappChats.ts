import { Chat } from "../models/bot/chat.model"
import { clients } from "./CreateWhatsappClient"

export async function SaveWhatsappChats(client_id: string) {
    if (client_id) {
        await Chat.deleteMany({})
        let client = clients.find((client) => {
            return client.client_id === client_id
        })
        if (client) {
            console.log("saving3")
            let chats = await client.client.getChats()
            for (let i = 0; i < chats.length; i++) {
                let chat = chats[i]
                let isgroup = false
                if (chat.isGroup)
                    isgroup = true
                let msgs = await chat.fetchMessages({ limit: 10 })
                for (let i = 0; i < msgs.length; i++) {
                    await new Chat({
                        name: chat.name,
                        isGroup: isgroup,
                        from: msgs[i].from.replace("@g.us", "").replace("@c.us", ""),
                        author: msgs[i].author && String(msgs[i].author).replace("@g.us", "").replace("@c.us", ""),
                        body: msgs[i].body,
                        hasMedia: Boolean(msgs[i].hasMedia),
                        timestamp: new Date(Number(msgs[i].timestamp) * 1000),
                        created_at: new Date()
                    }).save()
                }
            }
        }
    }
}

