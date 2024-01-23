import mongoose from "mongoose"
import { IState } from "../../types/user.types";

const StateSchema = new mongoose.Schema<IState, mongoose.Model<IState, {}, {}>, {}>({
    state: {
        type: String,
        trim: true,
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

export const State = mongoose.model<IState, mongoose.Model<IState, {}, {}>>("State", StateSchema)