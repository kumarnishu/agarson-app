import mongoose from "mongoose"
import { IReminder } from "../../types/reminder.types"

const ReminderSchema = new mongoose.Schema<IReminder, mongoose.Model<IReminder, {}, {}>, {}>({
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
    is_active: {
        type: Boolean,
        default: false,
    },
    is_paused: {
        type: Boolean,
        default: false,
    },
    is_todo: {
        type: Boolean,
        default: false,
    },
    run_once: {
        type: Boolean,
        default: false,
    },
    serial_number: { type: String },
    index_num: { type: Number, default: 0 },
    running_key: { type: String },
    refresh_key: { type: String },
    frequency_type: { type: String },
    frequency_value: { type: String },
    cron_string: { type: String },
    refresh_cron_string: { type: String },
    next_refresh_date: Date,
    next_run_date: Date,
    start_date: Date,
    is_hidden: {
        type: Boolean,
        default: false
    },
    connected_number: {
        type: String,
        trim: true,
        index: true
    },
    is_random_template: { type: Boolean, default: false },
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

export const Reminder = mongoose.model<IReminder, mongoose.Model<IReminder, {}, {}>>("Reminder", ReminderSchema)