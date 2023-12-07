import mongoose from "mongoose"
import { IContact } from "../../types/contact.types"

const ContactSchema = new mongoose.Schema<IContact, mongoose.Model<IContact, {}, {}>, {}>({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
        lowercase: true,
    },
    designation: {
        type: String,
        required: true,
        trim: true,
        index: true,
        lowercase: true
    },
    mobile: {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    reminders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reminder'
    }],
   
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

export const Contact = mongoose.model<IContact, mongoose.Model<IContact, {}, {}>>("Contact", ContactSchema)