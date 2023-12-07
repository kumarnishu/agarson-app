import mongoose from "mongoose"
import { IContactReport } from "../../types/contact.types"

const ContactReportSchema = new mongoose.Schema<IContactReport, mongoose.Model<IContactReport, {}, {}>, {}>({
    reminder_whatsapp_status: { type: String },
    greeting_whatsapp_status: { type: String },
    reminder_status: { type: String },
    greeting_status: { type: String },
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
        required: true
    },
    reminder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reminder',
        required: true
    },
    greeting: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Greeting',
        required: true
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

export const ContactReport = mongoose.model<IContactReport, mongoose.Model<IContactReport, {}, {}>>("ContactReport", ContactReportSchema)