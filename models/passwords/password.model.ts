import mongoose from "mongoose"
import { IPassword } from "../../types/password.types"

const PasswordSchema = new mongoose.Schema<IPassword, mongoose.Model<IPassword, {}, {}>, {}>({
    state: {
        type: String,
        lowercase: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    persons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

export const Password = mongoose.model<IPassword, mongoose.Model<IPassword, {}, {}>>("Password", PasswordSchema)