export type IChat = {
    id: {
        user:string
    },
    timestamp: Date,
    name: string,
    isGroup: string,
    lastMessage: {
        hasMedia: boolean,
        body: string,
        fromMe:boolean
    }
}