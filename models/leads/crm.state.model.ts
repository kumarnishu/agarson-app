import mongoose from "mongoose"
import { ICRMState } from "../../types/crm.types"

const CRMStateSchema = new mongoose.Schema<ICRMState, mongoose.Model<ICRMState, {}, {}>, {}>({
    state: {
        type: String,
        trim: true,
        index: true,
        lowercase: true,
        required:true
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

export const CRMState = mongoose.model<ICRMState, mongoose.Model<ICRMState, {}, {}>>("CRMState", CRMStateSchema)