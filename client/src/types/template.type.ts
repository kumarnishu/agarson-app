import { Asset } from "./asset.types"
import { IUser } from "./user.types"

export type ILeadTemplate = {
    _id: string,
    name: string,
    customer_name: string,
    customer_designation: string,
    gst: string,
    mobile: string,
    email: string,
    city: string,
    state: string,
    country: string,
    address: string,
    work_description: string,
    turnover: string,
    alternate_mobile1: string,
    alternate_mobile2: string,
    alternate_email: string,
    remarks: string,
    lead_type: string
    stage: string
    lead_source: string
    status?: string
}

export type IReferTemplate = {
    _id: string,
    name: string,
    customer_name: string,
    mobile: string,
    gst: string,
    city: string,
    state: string,
    status?: string
}

export type IErpStateTemplate = {
    _id?:string,
    state: string,
    apr: number,
    may: number,
    jun: number,
    jul: number,
    aug: number,
    sep: number,
    oct: number,
    nov: number,
    dec: number,
    jan: number,
    feb: number,
    mar: number,
    status?: any
}
export type ICRMStateTemplate = {
    _id: string,
    state: string,
    users?: string,
    status?: string
}
export type ICRMCityTemplate = {
    _id: string,
    city: string,
    users?: string,
    status?: string
}

export type IStageTemplate = {
    _id: string,
    stage: string,
    status?: string
}

export type ILeadTypeTemplate = {
    _id: string,
    type: string,
    status?: string
}

export type ILeadSourceTemplate = {
    _id: string,
    source: string,
    status?: string
}


export type ITemplateCategoryField = {
    _id: string,
    categories: string[],
    updated_at: Date,
    created_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export type IMessageTemplate = {
    _id: string,
    name: string,
    message?: string,
    caption?: string,
    media?: Asset,
    category: string,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export type IMessageTemplateBody = Request['body'] & IMessageTemplate;