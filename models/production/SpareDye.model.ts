import mongoose from "mongoose"
import { Asset, IUser } from "../users/user.model"
import { IDye } from "./dye.model"
import { IDyeLocation } from "./dye.location.model"

export type ISpareDye = {
    _id: string,
    dye: IDye,
    repair_required: boolean,
    dye_photo: Asset,
    photo_time: Date,
    location: IDyeLocation,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

const SpareDyeSchema = new mongoose.Schema<ISpareDye, mongoose.Model<ISpareDye, {}, {}>, {}>({
   
    dye: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dye',
        required: true
    },
    repair_required: { type: Boolean, default: false },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DyeLocation'
    },
    dye_photo: {
        _id: { type: String },
        filename: { type: String },
        public_url: { type: String },
        content_type: { type: String },
        size: { type: String },
        bucket: { type: String },
        created_at: Date,
    },
    photo_time: Date,
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

export const SpareDye = mongoose.model<ISpareDye, mongoose.Model<ISpareDye, {}, {}>>("SpareDye", SpareDyeSchema)