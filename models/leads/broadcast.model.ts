import mongoose from "mongoose"
import { IBroadcast } from "../../types/crm.types"
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
    
    connected_users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    counter: { type: Number, default: 0 },
    daily_limit: { type: Number, default: 0 },
    time_gap: Number,
    is_random_template: { type: Boolean, default: false },
    is_paused: { type: Boolean, default: false },
    autoRefresh: { type: Boolean, default: false },
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

export const Broadcast = mongoose.model<IBroadcast, mongoose.Model<IBroadcast, {}, {}>>("Broadcast", BroadcastSchema)