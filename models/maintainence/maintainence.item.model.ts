import mongoose from "mongoose"
import { IUser } from "../users/user.model"
import { IMachine } from "../production/machine.model"
import { IMaintenanceCategory } from "./maintainence.category.model"

export type IMaintenanceItem = {
    _id: string,
    machine:IMachine,   
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
const MaintenanceItemSchema = new mongoose.Schema<IMaintenanceItem, mongoose.Model<IMaintenanceItem, {}, {}>, {}>({
    work: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaintenanceItemCategory',
        required: true
    },
    frequency:String,
    maintainable_item:String,
   
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

export const MaintenanceItem = mongoose.model<IMaintenanceItem, mongoose.Model<IMaintenanceItem, {}, {}>>("MaintenanceItem", MaintenanceItemSchema)