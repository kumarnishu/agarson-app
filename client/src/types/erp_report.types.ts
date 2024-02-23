import { IState, IUser } from "./user.types"


export type IBillsAgingReport = {
    _id: string,
    report_owner: IState
    account: string,
    plu70: Number,
    in70to90: Number,
    in90to120: Number,
    plus120: Number
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser,
    status?: string
}

export type IClientSaleReport = {
    _id: string,
    report_owner: IState
    account: string,
    article: string,
    oldqty: string,
    newqty: string,
    apr: string,
    may: string,
    jun: string,
    jul: string,
    aug: string,
    sep: string,
    oct: string,
    nov: string,
    dec: string,
    jan: string,
    feb: string,
    mar: string,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser,
    status?: string
}

export type IPendingOrdersReport = {
    _id: string,
    report_owner: IState
    account: string,
    product_family: string,
    article: string,
    size5: number,
    size6: number,
    size7: number,
    size8: number,
    size9: number,
    size10: number,
    size11: number,
    size12_24pairs: number,
    size13: number,
    size11x12: number,
    size3: number,
    size4: number,
    size6to10: number,
    size7to10: number,
    size8to10: number,
    size4to8: number,
    size6to9: number,
    size5to8: number,
    size6to10A: number,
    size7to10B: number,
    size6to9A: number,
    size11close: number,
    size11to13: number,
    size3to8: number,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser,
    status?: string
}
