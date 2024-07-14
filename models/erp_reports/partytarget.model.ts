import mongoose from "mongoose"
import { IState } from "./state.model"
import { IUser } from "../users/user.model"

export type IPartyTargetReport = {
    _id: string,
    slno: string,
    PARTY: string,
    Create_Date: string,
    STATION: string,
    SALES_OWNER: string,
    report_owner: IState
    All_TARGET: string,
    TARGET: number,
    PROJECTION: number,
    GROWTH: string,
    TARGET_ACHIEVE: string,
    TOTAL_SALE_OLD: number,
    TOTAL_SALE_NEW: number,
    Last_Apr: number,
    Cur_Apr: number,
    Last_May: number,
    Cur_May: number,
    Last_Jun: number,
    Cur_Jun: number,
    Last_Jul: number,
    Cur_Jul: number,
    Last_Aug: number,
    Cur_Aug: number,
    Last_Sep: number,
    Cur_Sep: number,
    Last_Oct: number,
    Cur_Oct: number,
    Last_Nov: number,
    Cur_Nov: number,
    Last_Dec: number,
    Cur_Dec: number,
    Last_Jan: number,
    Cur_Jan: number,
    Last_Feb: number,
    Cur_Feb: number,
    Last_Mar: number,
    Cur_Mar: number,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser,
    status?: string
}

const PartyTargetReportSchema = new mongoose.Schema<IPartyTargetReport, mongoose.Model<IPartyTargetReport, {}, {}>, {}>({
    report_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State'
    },
    slno: String,
    PARTY: String,
    Create_Date: String,
    STATION: String,
    SALES_OWNER: String,
    All_TARGET: String,
    TARGET: Number,
    PROJECTION: Number,
    GROWTH: String,
    TARGET_ACHIEVE: String,
    TOTAL_SALE_OLD: Number,
    TOTAL_SALE_NEW: Number,
    Last_Apr: Number,
    Cur_Apr: Number,
    Last_May: Number,
    Cur_May: Number,
    Last_Jun: Number,
    Cur_Jun: Number,
    Last_Jul: Number,
    Cur_Jul: Number,
    Last_Aug: Number,
    Cur_Aug: Number,
    Last_Sep: Number,
    Cur_Sep: Number,
    Last_Oct: Number,
    Cur_Oct: Number,
    Last_Nov: Number,
    Cur_Nov: Number,
    Last_Dec: Number,
    Cur_Dec: Number,
    Last_Jan: Number,
    Cur_Jan: Number,
    Last_Feb: Number,
    Cur_Feb: Number,
    Last_Mar: Number,
    Cur_Mar: Number,
    created_at: {
        type: Date,
        default: new Date(),
        required: true,

    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updated_at: {
        type: Date,
        default: new Date(),
        required: true,

    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

export const PartyTargetReport = mongoose.model<IPartyTargetReport, mongoose.Model<IPartyTargetReport, {}, {}>>("PartyTargetReport", PartyTargetReportSchema)