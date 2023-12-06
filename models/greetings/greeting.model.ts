import mongoose from "mongoose"
import { IGreeting } from "../../types/greeting.types"

const GreetingSchema = new mongoose.Schema<IGreeting, mongoose.Model<IGreeting, {}, {}>, {}>({
    name: {
        type: String,
        lowercase: true,
        required: true
    },
    party: {
        type: String,
        lowercase: true,
        required: true
    },
    mobile: {
        type: String,
        lowercase: true,
        required: true
    },
    message: {
        type: String,
        lowercase: true
    },
    caption: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MessageTemplate'
        }
    ],
    
    is_active: {
        type: Boolean,
        default: false,
    },
    is_paused: {
        type: Boolean,
        default: false,
    },
    running_key: { type: String },
    greeting_type: { type: String },
    cron_string: { type: String },
    start_date: Date,
    next_run_date: Date,
    template: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MessageTemplate'
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

export const Greeting = mongoose.model<IGreeting, mongoose.Model<IGreeting, {}, {}>>("Greeting", GreetingSchema)