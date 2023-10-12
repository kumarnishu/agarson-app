import mongoose from "mongoose"
import { IMessageTemplate } from "../../types"

const MessageTemplateSchema = new mongoose.Schema<IMessageTemplate, mongoose.Model<IMessageTemplate, {}, {}>, {}>({
    name: {
        type: String,
        trim: true,
        index: true
    },
    message: {
        type: String,
        trim: true
    },
    media: {
        _id: { type: String },
        filename: { type: String },
        public_url: { type: String },
        content_type: { type: String },
        size: { type: String },
        bucket: { type: String },
        created_at: Date
    },
    categories: [{ type: String }],
    caption: { type: String },
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

export const MessageTemplate = mongoose.model<IMessageTemplate, mongoose.Model<IMessageTemplate, {}, {}>>("MessageTemplate", MessageTemplateSchema)