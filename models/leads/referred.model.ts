import mongoose from "mongoose"
import { IReferredParty } from "../../types/crm.types"

const ReferredPartySchema = new mongoose.Schema<IReferredParty, mongoose.Model<IReferredParty, {}, {}>, {}>({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
        lowercase: true,
    },
    customer_name: {
        type: String,
        trim: true,
        index: true,
        lowercase: true,
    },
    gst: {
        type: String,
        trim: true,
        index: true,
        lowercase: true,
    },
    mobile: {
        type: String,
        required: true,
        trim: true,
        index: true,
        lowercase: true,
    },

    city: {
        type: String,
        required: true,
        trim: true,
        index: true,
        lowercase: true,
    },
    state: {
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
    }
})

export const ReferredParty = mongoose.model<IReferredParty, mongoose.Model<IReferredParty, {}, {}>>("ReferredParty", ReferredPartySchema)