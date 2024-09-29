import mongoose from "mongoose"
import { IUser } from "../users/user.model"

export type IFolder = {
    _id: string,
    name: string,
    display_name: string,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

const FolderSchema = new mongoose.Schema<IFolder, mongoose.Model<IFolder, {}, {}>, {}>({

    name: {
        type: String,
        required: true,
        trim: true
    },
    display_name: {
        type: String,
        required: true,
        trim: true
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

export const Folder = mongoose.model<IFolder, mongoose.Model<IFolder, {}, {}>>("Folder", FolderSchema)