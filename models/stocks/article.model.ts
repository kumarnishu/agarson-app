import mongoose from "mongoose"
import { IArticle } from "../../types/stock.types"

const ArticleSchema = new mongoose.Schema<IArticle, mongoose.Model<IArticle, {}, {}>, {}>({
    name: {
        type: String,
        lowercase: true,
        required: true
    },
    sole: String,
    upper: String,
    lining: String,
    socks: String,
    sizes: String,
    toe: String,
    hsn: String,
    is_active: {
        type: Boolean,
        default: true,
        required: true
    },
    photo: {
        _id: { type: String },
        filename: { type: String },
        public_url: { type: String },
        content_type: { type: String },
        size: { type: String },
        bucket: { type: String },
        created_at: Date
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