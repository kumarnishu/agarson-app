import mongoose from "mongoose"
import { Asset, IUser } from "../users/user.model"
import { IArticle } from "./article.model"
import { IDye } from "./dye.model"
import { IMachine } from "./machine.model"
import { IDyeLocation } from "./dye.location.model"

export type IDyeStatus = {
    _id: string,
    dye: IDye,
    article: IArticle,
    machine: IMachine,
    repair_required: boolean,
    dye_photo: Asset,
    photo_time: Date,
    location: IDyeLocation,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

const DyeStatusSchema = new mongoose.Schema<IDyeStatus, mongoose.Model<IDyeStatus, {}, {}>, {}>({
    machine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Machine'
    },
    dye: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dye',
        required: true
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
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

export const DyeStatus = mongoose.model<IDyeStatus, mongoose.Model<IDyeStatus, {}, {}>>("DyeStatus", DyeStatusSchema)