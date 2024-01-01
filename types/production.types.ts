import { Asset } from "./asset.types"
import { IUser } from "./user.types"

export type IDye = {
    _id: string,
    active:boolean,
    dye_number: number,
    size: string,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export type IMachine = {
    _id: string,
    name: string,
    active: boolean,
    display_name: string,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export type IArticle = {
    _id: string,
    name: string,
    active: boolean,
    display_name: string,
    sizes: [{
        size: string,
        standard_weight: number,
        upper_weight: number,
    }
    ],
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export type IShoeWeight = {
    _id: string,
    machine: IMachine,
    dye: IDye,
    article: IArticle,
    is_validated:boolean,
    shoe_weight: number,
    shoe_photo: Asset,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export type IProduction = {
    _id: string,
    machine: IMachine,
    thekedar: IUser,
    article: IArticle,
    manpower: number,
    production: number,
    big_repair: number,
    small_repair: number,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export type IRepairDyeReport = {
    _id: string,
    machine: IMachine,
    dye: IDye,
    problem: string,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export type IRunningMouldReport = {
    _id: string,
    machine: IMachine,
    dye: IDye,
    article: IArticle,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
