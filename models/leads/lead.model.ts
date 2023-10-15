import mongoose from "mongoose";
import { ILead } from "../../types/crm.types";

const leadSchema = new mongoose.Schema<ILead, mongoose.Model<ILead>>({
    name: {
        type: String,
        trim: true,
        index: true,
        lowercase: true,
    },
    customer_name: {
        type: String,
        trim: true,
        lowercase: true,
    },
    customer_designation: {
        type: String,
        trim: true,
        lowercase: true,
    },
    mobile: {
        type: String,
        trim: true,
        index: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        index: true,
        lowercase: true
    },
    city: {
        type: String,
        trim: true,
        lowercase: true,
    },
    state: {
        type: String,
        trim: true,
        lowercase: true,
    },
    country: {
        type: String,
        trim: true,
        lowercase: true,
    },
    address: {
        type: String,
        trim: true,
        lowercase: true
    },
    work_description: {
        type: String,
        trim: true,
        lowercase: true
    },
    turnover: {
        type: String,
        trim: true,
        index: true,
    },
    alternate_mobile1: {
        type: String,
        trim: true,
    },
    alternate_mobile2: {
        type: String,
        trim: true,
    },
    alternate_email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    lead_type: {
        type: String,
        trim: true,
        lowercase: true
    },
    stage: {
        type: String,
        trim: true,
        lowercase: true,
        default: "open"
    },
    lead_source: {
        type: String,
        trim: true,
        lowercase: true,
    },
    last_remark: {
        type: String,
        trim: true,
        index: true,
        lowercase: true
    },
    
    remarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Remark'
    }],
    lead_owners: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    visiting_card: {
        _id: { type: String },
        filename: { type: String },
        public_url: { type: String },
        content_type: { type: String },
        size: { type: String },
        bucket: { type: String },
        created_at: Date
    },
    is_customer: {
        type: Boolean,
        default: false,
        required: true,
    },
    referred_party: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'IReferredParty'
    },
    referred_party_name: {
        type: String,
        trim: true,
        index: true,
        lowercase: true,
    },
    referred_party_mobile: {
        type: String,
        trim: true,
        index: true,
        lowercase: true,
    },
    referred_date: {
        type: Date
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
    },
})
leadSchema.index({ '$**': 'text' })
const Lead = mongoose.model<ILead, mongoose.Model<ILead>>("Lead", leadSchema);
export default Lead;