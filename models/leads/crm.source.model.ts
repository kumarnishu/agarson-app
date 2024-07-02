import mongoose from "mongoose"
import { ILeadSource } from "../../types/crm.types"

const LeadSourceSchema = new mongoose.Schema<ILeadSource, mongoose.Model<ILeadSource, {}, {}>, {}>({
    source: {
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

export const LeadSource = mongoose.model<ILeadSource, mongoose.Model<ILeadSource, {}, {}>>("LeadSource", LeadSourceSchema)