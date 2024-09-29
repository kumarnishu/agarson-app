import mongoose from "mongoose"
import { IUser } from "../users/user.model"

export type ICartoon = {
    _id: string,
    fileno: string,
    document_details: string,
    cartoon_no: string,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

const CartoonSchema = new mongoose.Schema<ICartoon, mongoose.Model<ICartoon, {}, {}>, {}>({

    fileno: {
        type: String,
        required: true,
        trim: true
    },
    document_details: {
        type: String,
        required: true,
        trim: true
    },
    cartoon_no: {
        type: String, required: true,
        trim: true
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

export const Cartoon = mongoose.model<ICartoon, mongoose.Model<ICartoon, {}, {}>>("Cartoon", CartoonSchema)