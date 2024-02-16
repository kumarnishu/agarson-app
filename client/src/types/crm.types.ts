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
    lead_owners: string,
    is_customer: boolean,
    status?: string
}
export type ILeadUpdatableField = {
    _id: string,
    stages: string[],
    lead_types: string[],
    lead_sources: string[],
    updated_at: Date,
    created_at: Date,
    created_by: IUser,
    updated_by: IUser
}
export type TLeadUpdatableFieldBody = Request['body'] & ILeadUpdatableField;
export type IReferredParty = {
    _id: string,
    name: string,
    customer_name: string,
    mobile: string,
    lead_owners: IUser[],
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
export type TRemarkBody = Request['body'] & IRemark;
export type TReferredPartyBody = Request['body'] & IReferredParty;

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
    lead_owners: IUser[],
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
export type TLeadBody = Request['body'] & ILead;


