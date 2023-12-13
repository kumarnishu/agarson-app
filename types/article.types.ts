export type IArticle = {
    _id: string,
    name: string,
    hsn: string,
    sole: string,
    upper: string,
    toe: string,
    lining: string,
    socks: string
}

export type ISTock = {
    _id: string,
    article: IArticle,
    size: string,
    stock: number,
    color: string,
}