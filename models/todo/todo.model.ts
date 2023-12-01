import mongoose from "mongoose"
import { ITodo } from "../../types/todo.types"

const TodoSchema = new mongoose.Schema<ITodo, mongoose.Model<ITodo, {}, {}>, {}>({
    work_title: {
        type: String,
        lowercase: true,
        required: true
    },
    work_description: {
        type: String,
        lowercase: true,
        required: true
    },
    person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    category: { type: String },
    status: { type: String, default: 'pending' },
    replies: [{
        reply: String,
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: Date
    }],
    is_hidden: { type: Boolean, default: false },
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