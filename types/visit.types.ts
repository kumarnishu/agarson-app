import { Asset } from "./asset.types"
import { IUser } from "./user.types"

export type IVisitReport = {
    _id: string,
    visit_in_credientials: {
        latitude: string,
        longitude: string,
        timestamp: Date,
        address: string
    },
    visit_out_credentials: {
        latitude: string,
        longitude: string,
        timestamp: Date,
        address: string
    },
    person: IUser,
    party_name: string,
    mobile: string,
    city: string,
    summary: string,
    is_old_party: boolean,
    dealer_of: string,
    refs_given: string,
    real_city: string
    reviews_taken: number,
    turnover: string,
    visit_in_photo: Asset,
    visit_samples_photo:Asset
    ankit_input: { input: string, created_by: IUser, timestamp: Date },
    brijesh_input: { input: string, created_by: IUser, timestamp: Date },
    visit_validated: boolean,
    visit: IVisit,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
export type IVisit = {
    _id: string,
    start_day_photo: Asset,
    end_day_photo: Asset,
    is_present:boolean
    real_city:string,
    start_day_credientials: {
        latitude: string,
        longitude: string,
        timestamp: Date,
        address: string
    },
    end_day_credentials: {
        latitude: string,
        longitude: string,
        timestamp: Date,
        address: string
    },
    visit_reports: IVisitReport[]
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export type IVisitBody = Request['body'] & IVisit;
export type IVisitReportBody = Request['body'] & IVisitReport;