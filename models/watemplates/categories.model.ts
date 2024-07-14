import mongoose from "mongoose"
import { IUser } from "../users/user.model"

export type ITemplateCategoryField = {
    _id: string,
    categories: string[],
    updated_at: Date,
    created_at: Date,
    created_by: IUser,
    updated_by: IUser
}

const TemplateCategoryFieldSchema = new mongoose.Schema<ITemplateCategoryField, mongoose.Model<ITemplateCategoryField, {}, {}>, {}>({
    categories: [{
        type: String,
        required: true,
        trim: true,
        index: true,
        lowercase: true,
    }],
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

export const TemplateCategoryField = mongoose.model<ITemplateCategoryField, mongoose.Model<ITemplateCategoryField, {}, {}>>("TemplateCategoryField", TemplateCategoryFieldSchema)