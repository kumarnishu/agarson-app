import { Asset } from "./asset.types"
import { IUser } from "./user.types"

export type IArticle = {
    _id: string,
    photo: Asset,
    is_active: Boolean,
    name: string,
    hsn: string,
    sole: string,
    upper: string,
    toe: string,
    lining: string,
    socks: string,
    sizes: string
    updated_at: Date,
    created_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export type IStock = {
    _id: string,
    is_active: Boolean,
    article: IArticle,
    size: string,
    stock: number,
    color: string,
    weight: string,
    updated_at: Date,
    created_at: Date,
    created_by: IUser,
    updated_by: IUser
}