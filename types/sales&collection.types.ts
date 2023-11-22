import { IUser } from "./user.types"

export type ISalesAndCollectionReport = {
    sale: string,
    collection: string,
    current_month_sale: string,
    current_month_collection: string,
    ageing_0to25: string,
    ageing_25to32: string,
    ageing_32to45: string,
    ageing_45to60: string,
    ageing_60to90: string,
    ageing_90to120: string,
    ageing_above_120: string,
    brijesh_input: { input: string, created_by: IUser, timestamp: Date }
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
export type ISalesAndCollectionReportBody = Request['body'] & ISalesAndCollectionReport;