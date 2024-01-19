import mongoose from "mongoose"
import { ITodo } from "../../types/todo.types"

const TodoSchema = new mongoose.Schema<ITodo, mongoose.Model<ITodo, {}, {}>, {}>({
    title: {
        type: String,
        lowercase: true,
        required: true
    },
    subtitle: {
        type: String,
        lowercase: true,
        required: true
    },
    category: { type: String },
    replies: [{
        reply: String,
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: Date
    }],
    is_hidden: { type: Boolean, default: false },
    serial_no: { type: Number, default: 0 },
    contacts: [{
        mobile: String,
        name: String,
        is_sent: Boolean,
        status: String
    }],
    is_completed: { type: Boolean, default: false },
    is_active: { type: Boolean, default: false },
    run_once: { type: Boolean, default: false },
    is_paused: { type: Boolean, default: false },
    running_key: String,
    refresh_key: String,
    frequency_type: String,
    frequency_value: String,
    cron_string: String,
    refresh_cron_string: String,
    next_run_date: Date,
    next_refresh_date: Date,
    start_date: Date,
    connected_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

export const Todo = mongoose.model<ITodo, mongoose.Model<ITodo, {}, {}>>("Todo", TodoSchema)