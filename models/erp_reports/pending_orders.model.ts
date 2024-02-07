import mongoose from "mongoose"
import { IPendingOrdersReport } from "../../types/erp_report.types"

const PendingOrdersReportSchema = new mongoose.Schema<IPendingOrdersReport, mongoose.Model<IPendingOrdersReport, {}, {}>, {}>({
    report_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State'
    },
    account: String,
    product_family: String,
    article: String,
    size5: Number,
    size6: Number,
    size7: Number,
    size8: Number,
    size9: Number,
    size10: Number,
    size11: Number,
    size12_24pairs: Number,
    size13: Number,
    size11x12: Number,
    size3: Number,
    size4: Number,
    size6to10: Number,
    size7to10: Number,
    size8to10: Number,
    size4to8: Number,
    size6to9: Number,
    size5to8: Number,
    size6to10A: Number,
    size7to10B: Number,
    size6to9A: Number,
    size11close: Number,
    size11to13: Number,
    size3to8: Number,
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

export const PendingOrdersReport = mongoose.model<IPendingOrdersReport, mongoose.Model<IPendingOrdersReport, {}, {}>>("PendingOrdersReport", PendingOrdersReportSchema)