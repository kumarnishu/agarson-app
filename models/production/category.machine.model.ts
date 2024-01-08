import mongoose from "mongoose"
import { IMachineCategory } from "../../types/production.types"


const MachineCategorySchema = new mongoose.Schema<IMachineCategory, mongoose.Model<IMachineCategory, {}, {}>, {}>({
    categories: [{
        type: String,
        required: true,
        trim: true
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

export const MachineCategory = mongoose.model<IMachineCategory, mongoose.Model<IMachineCategory, {}, {}>>("MachineCategory", MachineCategorySchema)