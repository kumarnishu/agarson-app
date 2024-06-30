import { Asset } from "./asset.types"
import { IUser } from "./user.types"

export type ILeadTemplate = {
    _id: string,
    name: string,
    customer_name: string,
    customer_designation: string,
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

export type IReferredParty = {
    _id: string,
    name: string,
    customer_name: string,
    mobile: string,
    gst: string,
    city: string,
    state: string,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
export type IRemark = {
    _id: string,
    remark: string,
    lead: ILead,
    created_at: Date,
    remind_date: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export type ILead = {
    _id: string,
    name: string,
    customer_name: string,
    customer_designation: string,
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
    lead_type: string
    stage: string
    lead_source: string
    remarks: IRemark[]
    visiting_card: Asset,
    is_customer: boolean,
    last_whatsapp: Date,
    is_sent: boolean,
    referred_party?: IReferredParty,
    referred_party_name?: string,
    referred_party_mobile?: string,
    referred_date?: Date,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}


