import mongoose from "mongoose"
import { IDye } from "../../types/production.types"


const DyeSchema = new mongoose.Schema<IDye, mongoose.Model<IDye, {}, {}>, {}>({
    dye_number: {
        type: Number,
        required: true,
        trim: true
    },
    size: {
        type: String,
        required: true,
        trim: true
    },
    active: {
        type: Boolean,
        default: true
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

export const Dye = mongoose.model<IDye, mongoose.Model<IDye, {}, {}>>("Dye", DyeSchema)