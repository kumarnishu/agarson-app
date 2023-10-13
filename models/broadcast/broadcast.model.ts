import mongoose from "mongoose"
import { IBroadcast } from "../../types/broadcast.types"

const BroadcastSchema = new mongoose.Schema<IBroadcast, mongoose.Model<IBroadcast, {}, {}>, {}>({
    name: {
        type: String,
        lowercase: true,
        required: true
    },
    templates: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MessageTemplate'
        }
    ],
    message: {
        media: {
            _id: { type: String },
            filename: { type: String },
            public_url: { type: String },
            content_type: { type: String },
            size: { type: String },
            bucket: { type: String },
            created_at: Date
        },
        message: { type: String },
        caption: { type: String }
    },
    start_date: {
        type: Date,
        default: new Date(),
        required: true,
    },
    next_run_date: {
        type: Date,
    },
    cron_key: {
        type: String,
    },
    cron_string: {
        type: String,
    },
    is_active: {
        type: Boolean,
        default: false,
    },
    leads_selected: {
        type: Boolean,
        default: false,
    },
    connected_number: {
        type: String,
        trim: true,
        index: true
    },
    daily_count: { type: Number, default: 0 },
    daily_limit: { type: Number, default: 0 },
    time_gap: String,
    is_random_template: { type: Boolean, default: false },
    is_paused: { type: Boolean, default: false },
    created_at: {
        type: Date,
        default: new Date(),
        required: true,

    },
    autoRefresh: { type: Boolean, default: false },
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

export const Broadcast = mongoose.model<IBroadcast, mongoose.Model<IBroadcast, {}, {}>>("Broadcast", BroadcastSchema)