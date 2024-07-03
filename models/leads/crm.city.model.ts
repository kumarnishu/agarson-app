import mongoose from "mongoose"
import { ICRMCity } from "../../types/crm.types"

const CRMCitySchema = new mongoose.Schema<ICRMCity, mongoose.Model<ICRMCity, {}, {}>, {}>({
    city: {
        type: String,
        trim: true,
        index: true,
        lowercase: true,
        required: true
    },
    state: {
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

export const CRMCity = mongoose.model<ICRMCity, mongoose.Model<ICRMCity, {}, {}>>("CRMCity", CRMCitySchema)