import mongoose from "mongoose"
import { IVisitReport } from "../../types/visit.types"


const VisitReportSchema = new mongoose.Schema<IVisitReport, mongoose.Model<IVisitReport, {}, {}>, {}>({
    visit_in_credientials: {
        latitude: String,
        longitute: String,
        timestamp: Date
    },
    visit_out_credentials: {
        latitude: String,
        longitute: String,
        timestamp: Date
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
    person: String,
    party_name: String,
    city: String,
    summary: String,
    is_old_party: Boolean,
    dealer_of: String,
    refs_given: String,
    reviews_taken: Number,
    ankit_input: {
        input: String,
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: Date
    },
    brijesh_input: {
        input: String,
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: Date
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