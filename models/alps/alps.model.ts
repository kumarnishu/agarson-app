import mongoose from "mongoose"
import { IAlps } from "../../types"


const AlpsSchema = new mongoose.Schema<IAlps, mongoose.Model<IAlps, {}, {}>, {}>({
    serial_number: {
        type: String,
        required: true,
        index: true,
        trim: true,
        lowercase: true,
    },
    name: {
        type: String,
        trim: true,
        required: true,
        index: true,
    },
    city: {
        type: String,
        trim: true,
        required: true,
        index: true,
    },
    mobile: {
        type: String,
        trim: true,
        required: true,
        index: true,
    },
    media: {
        _id: { type: String },
        filename: { type: String },
        public_url: { type: String },
        content_type: { type: String },
        size: { type: String },
        bucket: { type: String },
        created_at: Date,
    },
    gst: {
        type: String,
        trim: true,
        required: true,
        index: true,
    },
    created_at: {
        type: Date,
        default: new Date(),
        required: true,

    }
})

export const Alps = mongoose.model<IAlps, mongoose.Model<IAlps, {}, {}>>("Alps", AlpsSchema)