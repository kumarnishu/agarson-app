export type Asset = {
    _id: string,
    filename: string,
    public_url: string,
    content_type: string,
    size: string,
    bucket: string,
    created_at: Date
} | undefined