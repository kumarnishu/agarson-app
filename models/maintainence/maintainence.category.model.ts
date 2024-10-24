import mongoose from "mongoose"
import { IUser } from "../users/user.model"

export type IMaintenanceCategory = {
    _id: string,
    name: string,
    active: boolean,
    display_name: string,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
const MaintenanceCategorySchema = new mongoose.Schema<IMaintenanceCategory, mongoose.Model<IMaintenanceCategory, {}, {}>, {}>({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    display_name: {
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

export const MaintenanceCategory = mongoose.model<IMaintenanceCategory, mongoose.Model<IMaintenanceCategory, {}, {}>>("MaintenanceCategory", MaintenanceCategorySchema)