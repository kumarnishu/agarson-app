import mongoose from "mongoose"
import { IBroadcastReport } from "../../types/broadcast.types"

const BroadcastSchema = new mongoose.Schema<IBroadcastReport, mongoose.Model<IBroadcastReport, {}, {}>, {}>({
    mobile: { type: String, required: true },
    status: { type: String, lowercase: true, default: 'pending' },
    customer_name: { type: String, lowercase: true },
    is_buisness: { type: Boolean, default: false },
    broadcast: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Broadcast',
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

export const BroadcastReport = mongoose.model<IBroadcastReport, mongoose.Model<IBroadcastReport, {}, {}>>("BroadcastReport", BroadcastSchema)