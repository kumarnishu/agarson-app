export type IChat = {
    from: string,
    name: string,
    isGroup: boolean,
    author?: string,
    body: string,
    hasMedia: boolean,
    timestamp: Date,
    created_at:Date,
}