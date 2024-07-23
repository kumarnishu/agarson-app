import mongoose from "mongoose"
import { Asset, IUser } from "../users/user.model"
import { IArticle } from "./article.model"
import { IDye } from "./dye.mode"
import { IMachine } from "./machine.model"

export type IShoeWeight = {
    _id: string,
    machine: IMachine,
    dye: IDye,
    article: IArticle,
    is_validated: boolean,
    shoe_weight: number,
    shoe_photo: Asset,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

const ShoeWeightSchema = new mongoose.Schema<IShoeWeight, mongoose.Model<IShoeWeight, {}, {}>, {}>({
    machine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Machine',
        required: true
    },
    dye: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dye',
        required: true
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    shoe_weight: Number,
    shoe_photo: {
        _id: { type: String },
        filename: { type: String },
        public_url: { type: String },
        content_type: { type: String },
        size: { type: String },
        bucket: { type: String },
        created_at: Date,
    },
    is_validated: { type: Boolean, default: false },
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

export const ShoeWeight = mongoose.model<IShoeWeight, mongoose.Model<IShoeWeight, {}, {}>>("ShoeWeight", ShoeWeightSchema)