import mongoose from "mongoose"
import { IRemark } from "../../types"
const RemarkSchema = new mongoose.Schema<IRemark, mongoose.Model<IRemark, {}, {}>, {}>({
    remark: {
        type: String,
        required: true,
        trim: true,
        index: true,
        lowercase: true,
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
    },
    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead',
        required: true
    }
})

export const Remark = mongoose.model<IRemark, mongoose.Model<IRemark, {}, {}>>("Remark", RemarkSchema)