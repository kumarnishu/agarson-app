import mongoose from "mongoose"
import { IVisitingCard } from "../../types/visiting_card.types"

const VisitingCardSchema = new mongoose.Schema<IVisitingCard, mongoose.Model<IVisitingCard, {}, {}>, {}>({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
        lowercase: true,
    },
    city: String,
    state: String,
    salesman: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    refer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReferredParty'
    },
    comments: [{
        comment: String,
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: Date
    }],
    card: {
        _id: { type: String },
        filename: { type: String },
        public_url: { type: String },
        content_type: { type: String },
        size: { type: String },
        bucket: { type: String },
        created_at: Date
    },
    is_closed: { type: Boolean, default: false },
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

export const VisitingCard = mongoose.model<IVisitingCard, mongoose.Model<IVisitingCard, {}, {}>>("VisitingCard", VisitingCardSchema)