import mongoose from "mongoose"
import { IUser } from "../users/user.model"

export type ITodoTemplate = {
    _id: string,
    serial_no: number,
    title: string,
    sheet_url: string,
    category: string,
    category2: string,
    contacts: string,
    reply: string,
    todo_type: string,
    start_time: string,
    dates: string,
    months: string,
    weekdays: string,
    years: string,
    connected_user: string,
    status?: string
}
export type ITodo = {
    _id: string,
    serial_no: number,
    title: string,
    sheet_url: string,
    category: string,
    category2: string,
    contacts: {
        mobile: string,
        name: string,
        is_sent: boolean,
        timestamp: Date
    }[],
    replies: {
        reply: string,
        created_by: IUser,
        timestamp: Date
    }[],
    todo_type: string,
    is_hidden: boolean,
    is_active: boolean,
    start_time: string,
    dates: string,
    months: string,
    weekdays: string,
    years: string,
    connected_user: IUser,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}


const TodoSchema = new mongoose.Schema<ITodo, mongoose.Model<ITodo, {}, {}>, {}>({
    title: {
        type: String
    },
    sheet_url: {
        type: String
    },

    category: { type: String },
    category2: { type: String },
    todo_type: { type: String },
    serial_no: { type: Number, default: 0 },
    contacts: [{
        mobile: String,
        name: String,
        is_sent: Boolean,
        timestamp: Date
    }],
    replies: [{
        reply: String,
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: Date
    }],
    is_active: { type: Boolean, default: false },
    is_hidden: { type: Boolean, default: true },
    start_time: String,
    dates: String,
    months: String,
    weekdays: String,
    years: String,
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