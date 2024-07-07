import mongoose from "mongoose"
import { IPartyTargetReport } from "../../types/erp_report.types"

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