import mongoose from "mongoose"
import { IState } from "./state.model"
import { IUser } from "../users/user.model"
export type IPendingOrdersReport = {
    _id: string,
    report_owner: IState
    account: string,
    product_family: string,
    article: string,
    size5: number,
    size6: number,
    size7: number,
    size8: number,
    size9: number,
    size10: number,
    size11: number,
    size12_24pairs: number,
    size13: number,
    size11x12: number,
    size3: number,
    size4: number,
    size6to10: number,
    size7to10: number,
    size8to10: number,
    size4to8: number,
    size6to9: number,
    size5to8: number,
    size6to10A: number,
    size7to10B: number,
    size6to9A: number,
    size11close: number,
    size11to13: number,
    size3to8: number,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser,
    status?: string
}
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