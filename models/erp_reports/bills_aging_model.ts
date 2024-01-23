import mongoose from "mongoose"
import { IBillsAgingReport } from "../../types/erp_report.types"

const BillsAgingReportSchema = new mongoose.Schema<IBillsAgingReport, mongoose.Model<IBillsAgingReport, {}, {}>, {}>({
    report_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State'
    },
    account: String,
    plu70: Number,
    in70to90: Number,
    in90to120: Number,
    plus120: Number,
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

export const BillsAgingReport = mongoose.model<IBillsAgingReport, mongoose.Model<IBillsAgingReport, {}, {}>>("BillsAgingReport", BillsAgingReportSchema)