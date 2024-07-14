import mongoose from "mongoose";
import { IUser } from "../users/user.model";

export type IChecklist = {
    _id: string,
    title: string,
    sheet_url: string,
    serial_no: number,
    boxes: {
        desired_date: Date,
        actual_date?: Date,
    }[],
    owner: IUser,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
const ChecklistSchema = new mongoose.Schema<IChecklist, mongoose.Model<IChecklist, {}, {}>, {}>({
    title: {
        type: String,
        lowercase: true,
        required: true
    },
    serial_no:Number,
    sheet_url: {
        type: String,
        required: true
    },
    boxes: [{
        desired_date: { type: Date },
        actual_date: { type: Date }
    }],
    owner:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    ,
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

export const Checklist = mongoose.model<IChecklist, mongoose.Model<IChecklist, {}, {}>>("Checklist", ChecklistSchema)