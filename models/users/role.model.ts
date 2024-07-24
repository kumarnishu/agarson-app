import mongoose from "mongoose"
import { IUser } from "../users/user.model"

export type IRole = {
    _id: string,
    role: string,
    permissions:string[],
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
const RoleSchema = new mongoose.Schema<IRole, mongoose.Model<IRole, {}, {}>, {}>({
    role: {
        type: String,
        trim: true,
        lowercase:true
    },
    permissions:[
        {
            type: String,
            lowercase: true,
            trim: true
        }
    ],
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

export const Role = mongoose.model<IRole, mongoose.Model<IRole, {}, {}>>("Role", RoleSchema)