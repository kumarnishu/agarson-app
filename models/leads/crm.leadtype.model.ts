import mongoose from "mongoose"
import { ILeadType } from "../../types/crm.types"

const LeadTypeSchema = new mongoose.Schema<ILeadType, mongoose.Model<ILeadType, {}, {}>, {}>({
    type: {
        type: String,
        trim: true,
        index: true,
        lowercase: true,
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

export const LeadType = mongoose.model<ILeadType, mongoose.Model<ILeadType, {}, {}>>("LeadType", LeadTypeSchema)