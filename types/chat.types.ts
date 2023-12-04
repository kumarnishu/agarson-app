export type IChat = {
    id: {
        user: string
    },
    timestamp: Date,
    name: string,
    isGroup: boolean,
    lastMessage: {
        hasMedia: boolean,
        body: string,
        fromMe: boolean
    }
}