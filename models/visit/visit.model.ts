import mongoose from "mongoose"
import { Asset, IUser } from "../users/user.model"
import { IVisitReport } from "./visit.report.model"


export type IVisit = {
    _id: string,
    start_day_photo: Asset,
    end_day_photo: Asset,
    is_present: boolean
    real_city: string,
    start_day_credientials: {
        latitude: string,
        longitude: string,
        timestamp: Date,
        address: string
    },
    end_day_credentials: {
        latitude: string,
        longitude: string,
        timestamp: Date,
        address: string
    },
    visit_reports: IVisitReport[]
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

const VisitSchema = new mongoose.Schema<IVisit, mongoose.Model<IVisit, {}, {}>, {}>({
    start_day_credientials: {
        latitude: String,
        longitude: String,
        timestamp: Date,
        address: String
    },
    end_day_credentials: {
        latitude: String,
        longitude: String,
        timestamp: Date,
        address: String
    },
    real_city:String,
    is_present: { type: Boolean, default: true },
    start_day_photo: {
        _id: { type: String },
        filename: { type: String },
        public_url: { type: String },
        content_type: { type: String },
        size: { type: String },
        bucket: { type: String },
        created_at: Date,
    },
    end_day_photo: {
        _id: { type: String },
        filename: { type: String },
        public_url: { type: String },
        content_type: { type: String },
        size: { type: String },
        bucket: { type: String },
        created_at: Date,
    },
    visit_reports: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VisitReport',
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

export const Visit = mongoose.model<IVisit, mongoose.Model<IVisit, {}, {}>>("Visit", VisitSchema)