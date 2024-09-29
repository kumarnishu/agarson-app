import mongoose from "mongoose"
import { Asset, IUser } from "../users/user.model"
import { IFolder } from "./folder.model"

export type IFile = {
    _id: string,
    name: string,
    display_name: string,
    file: Asset,
    folder: IFolder,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

const FileSchema = new mongoose.Schema<IFile, mongoose.Model<IFile, {}, {}>, {}>({

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
    file: {
        _id: { type: String },
        filename: { type: String },
        public_url: { type: String },
        content_type: { type: String },
        size: { type: String },
        bucket: { type: String },
        created_at: Date,
    },
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
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

export const File = mongoose.model<IFile, mongoose.Model<IFile, {}, {}>>("File", FileSchema)