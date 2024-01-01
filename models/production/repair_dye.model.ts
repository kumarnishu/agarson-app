import mongoose from "mongoose"
import { IRepairDyeReport } from "../../types/production.types"


const RepairDyeReportSchema = new mongoose.Schema<IRepairDyeReport, mongoose.Model<IRepairDyeReport, {}, {}>, {}>({
    machine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Machine',
        required: true
    },
    dye: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dye',
        required: true
    },
    problem: String,
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

export const RepairDyeReport = mongoose.model<IRepairDyeReport, mongoose.Model<IRepairDyeReport, {}, {}>>("RepairDyeReport", RepairDyeReportSchema)