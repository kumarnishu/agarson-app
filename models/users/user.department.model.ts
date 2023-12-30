import mongoose from "mongoose"
import { IUserDepartment } from "../../types/user.types"

const UserDepartmentSchema = new mongoose.Schema<IUserDepartment, mongoose.Model<IUserDepartment, {}, {}>, {}>({
    department: {
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

export const UserDepartment = mongoose.model<IUserDepartment, mongoose.Model<IUserDepartment, {}, {}>>("UserDepartment", UserDepartmentSchema)