import mongoose from "mongoose"
import { IUser } from "../users/user.model"
import { IArticle } from "./article.model"

export type ILocation = {
    _id: string,
    active: boolean,
    dye_number: number,
    size: string,
    article: IArticle,
    stdshoe_weight: number,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}


const LocationSchema = new mongoose.Schema<ILocation, mongoose.Model<ILocation, {}, {}>, {}>({
    dye_number: {
        type: Number,
        required: true,
        trim: true
    },
    stdshoe_weight: {
        type: Number,
        required: true,
        trim: true,
        default: 0
    },
    size: {
        type: String,
        required: true,
        trim: true
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
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

export const Location = mongoose.model<ILocation, mongoose.Model<ILocation, {}, {}>>("Location", LocationSchema)