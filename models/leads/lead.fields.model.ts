import mongoose from "mongoose"
import { ILeadUpdatableField } from "../../types"
const LeadUpdatableFieldSchema = new mongoose.Schema<ILeadUpdatableField, mongoose.Model<ILeadUpdatableField, {}, {}>, {}>({
    stages: [{
        type: String,
        required: true,
        trim: true,
        index: true,
        lowercase: true,
    }],
    lead_sources: [{
        type: String,
        required: true,
        trim: true,
        index: true,
        lowercase: true,
    }],
     lead_types: [{
        type: String,
        required: true,
        trim: true,
        index: true,
        lowercase: true,
    }],
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

export const LeadUpdatableField = mongoose.model<ILeadUpdatableField, mongoose.Model<ILeadUpdatableField, {}, {}>>("LeadUpdatableField", LeadUpdatableFieldSchema)