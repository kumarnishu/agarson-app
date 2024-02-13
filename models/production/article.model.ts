import mongoose from "mongoose"
import { IArticle } from "../../types/production.types"


const ArticleSchema = new mongoose.Schema<IArticle, mongoose.Model<IArticle, {}, {}>, {}>({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    display_name: {
        type: String,
        required: true,
        trim: true
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

export const Article = mongoose.model<IArticle, mongoose.Model<IArticle, {}, {}>>("Article", ArticleSchema)