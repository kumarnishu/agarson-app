import mongoose from "mongoose"
import { Asset, IUser } from "../users/user.model"
import { IVisit } from "./visit.model"

export type IVisitReport = {
    _id: string,
    visit_in_credientials: {
        latitude: string,
        longitude: string,
        timestamp: Date,
        address: string
    },
    visit_out_credentials: {
        latitude: string,
        longitude: string,
        timestamp: Date,
        address: string
    },
    person: IUser,
    party_name: string,
    mobile: string,
    city: string,
    summary: string,
    is_old_party: boolean,
    dealer_of: string,
    refs_given: string,
    real_city: string
    reviews_taken: number,
    turnover: string,
    visit_in_photo: Asset,
    visit_samples_photo: Asset
    ankit_input: { input: string, created_by: IUser, timestamp: Date },
    visit_validated: boolean,
    visit: IVisit,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

const VisitReportSchema = new mongoose.Schema<IVisitReport, mongoose.Model<IVisitReport, {}, {}>, {}>({
    visit_in_credientials: {
        latitude: String,
        longitude: String,
        timestamp: Date,
        address: String
    },
    visit_out_credentials: {
        latitude: String,
        longitude: String,
        timestamp: Date,
        address: String
    },
    visit_samples_photo: {
        _id: { type: String },
        filename: { type: String },
        public_url: { type: String },
        content_type: { type: String },
        size: { type: String },
        bucket: { type: String },
        created_at: Date,
    },
    visit_in_photo: {
        _id: { type: String },
        filename: { type: String },
        public_url: { type: String },
        content_type: { type: String },
        size: { type: String },
        bucket: { type: String },
        created_at: Date,
    },
    person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    party_name: String,
    city: String,
    real_city: String,
    mobile: String,
    summary: String,
    is_old_party: Boolean,
    dealer_of: String,
    refs_given: String,
    reviews_taken: Number,
    turnover: String,
    visit_validated: Boolean,
    ankit_input: {
        input: String,
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: Date
    },
    visit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Visit'
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

export const VisitReport = mongoose.model<IVisitReport, mongoose.Model<IVisitReport, {}, {}>>("VisitReport", VisitReportSchema)