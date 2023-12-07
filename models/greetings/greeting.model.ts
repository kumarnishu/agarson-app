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
    category: {
        type: String,
        lowercase: true,
        required: true
    },
    mobile: {
        type: String,
        lowercase: true,
        required: true
    },

    is_active: {
        type: Boolean,
        default: false,
    },
    is_paused: {
        type: Boolean,
        default: false,
    },
    dob_key: { type: String },
    anniversary_key: { type: String },
    dob_cronstring: { type: String },
    anniversary_cronstring: { type: String },
    dob_time: Date,
    anniversary_time: Date,
    next_run_dob_time: Date,
    next_run_anniversary_time: Date,
    dob_whatsapp_status: String,
    anniversary_whatsapp_status: String,
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