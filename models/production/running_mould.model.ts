import mongoose from "mongoose"
import { IRunningMouldReport } from "../../types/production.types"


const RunningMouldReportSchema = new mongoose.Schema<IRunningMouldReport, mongoose.Model<IRunningMouldReport, {}, {}>, {}>({
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
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
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

export const RunningMouldReport = mongoose.model<IRunningMouldReport, mongoose.Model<IRunningMouldReport, {}, {}>>("RunningMouldReport", RunningMouldReportSchema)