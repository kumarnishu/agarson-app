import { Asset } from "./asset.types"
import { IUser } from "./user.types"

export type IVisitReport = {
    visit_in_credientials: {
        latitude: string,
        longitute: string,
        timestamp: Date
    },
    visit_out_credentials: {
        latitude: string,
        longitute: string,
        timestamp: Date
    },
    person: IUser,
    party_name: string,
    city: string,
    summary: string,
    is_old_party: boolean,
    dealer_of: string,
    refs_given: string,
    reviews_taken: number,
    visit_in_photo: Asset,
    ankit_input: { input: string, created_by: IUser, timestamp: Date },
    brijesh_input: { input: string, created_by: IUser, timestamp: Date },
    visit_validated: boolean,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
export type IVisit = {
    _id: string,
    start_day_photo: Asset,
    end_day_photo: Asset,
    start_day_credientials: {
        latitude: string,
        longitute: string,
        timestamp: Date
    },
    end_day_credentials: {
        latitude: string,
        longitute: string,
        timestamp: Date
    },
    visit_reports: IVisitReport[]
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export type IVisitBody = Request['body'] & IVisit;
export type IVisitReportBody = Request['body'] & IVisitReport;