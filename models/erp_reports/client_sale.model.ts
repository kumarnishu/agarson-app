import mongoose from "mongoose"
import { IClientSaleReport } from "../../types/erp_report.types"

const ClientSaleReportSchema = new mongoose.Schema<IClientSaleReport, mongoose.Model<IClientSaleReport, {}, {}>, {}>({
    report_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State'
    },
    account: String,
    article: String,
    oldqty: String,
    newqty: String,
    apr: String,
    may: String,
    jun: String,
    jul: String,
    aug: String,
    sep: String,
    oct: String,
    nov: String,
    dec: String,
    jan: String,
    feb: String,
    mar: String,
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

export const ClientSaleReport = mongoose.model<IClientSaleReport, mongoose.Model<IClientSaleReport, {}, {}>>("ClientSaleReport", ClientSaleReportSchema)