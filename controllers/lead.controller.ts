import { NextFunction, Request, Response } from "express"
import isMongoId from "validator/lib/isMongoId"
import xlsx from "xlsx"
import Lead from "../models/leads/lead.model.js"
import { User } from "../models/users/user.model.js"
import { Remark } from "../models/leads/remark.model.js"
import { uploadFileToCloud } from "../utils/uploadFile.util.js"
import { isvalidDate } from "../utils/isValidDate.js"
import { Types } from "mongoose"
import { LeadUpdatableField } from "../models/leads/lead.fields.model.js"
import { destroyFile } from "../utils/destroyFile.util.js"
import { ReferredParty } from "../models/leads/referred.model.js"
import { ExportLeadMobiles, ExportLeads } from "../utils/CrmUtils.js"
import { ILead, ILeadTemplate, IReferredParty, IRemark, TLeadBody, TLeadUpdatableFieldBody, TReferredPartyBody } from "../types/crm.types.js"
import { IUser } from "../types/user.types.js"
import { Asset } from "../types/asset.types.js"
import { Broadcast } from "../models/leads/broadcast.model.js"
import cron from "cron"
import { GetDailyBroadcastCronString } from "../utils/GetDailyBroadcastCronString.js"
import { handleBroadcast, timeouts } from "../utils/handleBroadcast.js"
import { clients } from "../utils/CreateWhatsappClient.js"

// get request
export const GetLeads = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    const id = req.query.id
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        let leads: ILead[] = []
        let count = 0
        if (req.user?.is_admin) {
            if (id) {
                leads = await Lead.find({ is_customer: false, stage: { $nin: ["useless"] }, lead_owners: id }).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at').skip((page - 1) * limit).limit(limit)
                count = await Lead.find({ is_customer: false, stage: { $nin: ["useless"] }, lead_owners: id }).countDocuments()
            }
            else {
                leads = await Lead.find({ is_customer: false, stage: { $nin: ["useless"] } }).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at').skip((page - 1) * limit).limit(limit)
                count = await Lead.find({ is_customer: false, stage: { $nin: ["useless"] } }).countDocuments()
            }

        }

        if (!req.user?.is_admin) {
            leads = await Lead.find({ is_customer: false, stage: { $nin: ["useless"] }, lead_owners: { $in: [req.user._id] } }).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                path: 'remarks',
                populate: [
                    {
                        path: 'created_by',
                        model: 'User'
                    },
                    {
                        path: 'updated_by',
                        model: 'User'
                    }
                ]
            }).sort('-created_at').skip((page - 1) * limit).limit(limit)
            count = await Lead.find({ is_customer: false, stage: { $nin: ["useless"] }, lead_owners: { $in: [req.user._id] } }).countDocuments()
        }

        return res.status(200).json({
            leads,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })
}

export const GetUselessLeads = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    const id = req.query.id
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        let leads: ILead[] = []
        let count = 0
        if (req.user?.is_admin) {
            if (id) {
                leads = await Lead.find({ stage: 'useless', lead_owners: id }).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at').skip((page - 1) * limit).limit(limit)
                count = await Lead.find({ stage: 'useless', lead_owners: id }).countDocuments()
            }
            else {
                leads = await Lead.find({ stage: 'useless' }).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at').skip((page - 1) * limit).limit(limit)
                count = await Lead.find({ stage: 'useless' }).countDocuments()
            }

        }

        if (!req.user?.is_admin) {
            leads = await Lead.find({ stage: 'useless', lead_owners: { $in: [req.user._id] } }).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                path: 'remarks',
                populate: [
                    {
                        path: 'created_by',
                        model: 'User'
                    },
                    {
                        path: 'updated_by',
                        model: 'User'
                    }
                ]
            }).sort('-created_at').skip((page - 1) * limit).limit(limit)
            count = await Lead.find({ stage: 'useless', lead_owners: { $in: [req.user._id] } }).countDocuments()
        }
        leads = leads.slice((page - 1) * limit, limit * page)
        return res.status(200).json({
            leads,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })

}
export const GetCustomers = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let id = req.query.id
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        let leads: ILead[] = []
        let count = 0
        if (req.user?.is_admin) {
            if (id) {
                leads = await Lead.find({ is_customer: true, lead_owners: id }).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at').skip((page - 1) * limit).limit(limit)
                count = await Lead.find({ is_customer: true, lead_owners: id }).countDocuments()
            }
            else {
                leads = await Lead.find({ is_customer: true }).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at').skip((page - 1) * limit).limit(limit)
                count = await Lead.find({ is_customer: true }).countDocuments()
            }
        }

        if (!req.user?.is_admin) {
            leads = await Lead.find({ is_customer: true, lead_owners: { $in: [req.user._id] } }).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                path: 'remarks',
                populate: [
                    {
                        path: 'created_by',
                        model: 'User'
                    },
                    {
                        path: 'updated_by',
                        model: 'User'
                    }
                ]
            }).sort('-created_at').skip((page - 1) * limit).limit(limit)
            count = await Lead.find({ is_customer: true, lead_owners: { $in: [req.user._id] } }).countDocuments()
        }

        return res.status(200).json({
            leads,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })
}
export const GetRefers = async (req: Request, res: Response, next: NextFunction) => {
    let refers: IReferredParty[] = []
    if (req.user?.is_admin) {
        refers = await ReferredParty.find().sort('name')
    }
    if (!req.user?.is_admin) {
        refers = await ReferredParty.find({ lead_owners: { $in: [req.user._id] } }).sort('name')
    }
    return res.status(200).json(refers)
}
export const GetPaginatedRefers = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    const id = req.params.id
    let parties: IReferredParty[] = []
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        if (id)
            parties = await ReferredParty.find({ lead_owners: id }).populate('created_by').populate('updated_by').populate('lead_owners').sort('name')
        else
            parties = await ReferredParty.find().populate('created_by').populate('updated_by').populate('lead_owners').sort('name')
        let result: {
            party: IReferredParty,
            leads: ILead[]
        }[] = []
        for (let i = 0; i < parties.length; i++) {
            let leads = await Lead.find({ referred_party: parties[i] }).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                path: 'remarks',
                populate: [
                    {
                        path: 'created_by',
                        model: 'User'
                    },
                    {
                        path: 'updated_by',
                        model: 'User'
                    }
                ]
            }).sort('name')
            result.push({
                party: parties[i],
                leads: leads
            })
        }
        if (!req.user?.is_admin) {
            result = result.filter((item) => {
                let owners = item.party.lead_owners.filter((owner) => {
                    return owner.username == req.user.username
                })
                if (owners.length > 0)
                    return item
            })
        }

        let count = result.length
        result = result.slice((page - 1) * limit, limit * page)

        return res.status(200).json({
            result,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else return res.status(400).json({ message: 'bad request' })



}
export const GetReminderRemarks = async (req: Request, res: Response, next: NextFunction) => {
    let previous_date = new Date()
    let day = previous_date.getDate() - 7
    previous_date.setDate(day)

    let reminders = await Remark.find({ remind_date: { $lte: new Date(), $gt: previous_date } }).populate('created_by').populate('updated_by').populate({
        path: 'lead',
        populate: [
            {
                path: 'lead_owners',
                model: 'User'
            },
            {
                path: 'referred_party',
                model: 'ReferredParty'
            },
            {
                path: 'remarks',
                populate: [
                    {
                        path: 'created_by',
                        model: 'User'
                    },
                    {
                        path: 'updated_by',
                        model: 'User'
                    }
                ]
            }
        ]
    }).sort('-remind_date')
    reminders = reminders.filter((reminder) => {
        return reminder.created_by.username === req.user.username
    })
    return res.status(200).json(reminders)
}
export const GetRemarks = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let id = req.query.id
    let start_date = req.query.start_date
    let end_date = req.query.end_date
    let remarks: IRemark[] = []
    let count = 0
    let dt1 = new Date(String(start_date))
    let dt2 = new Date(String(end_date))


    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        if (!id) {
            remarks = await Remark.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: req.user._id }).populate('created_by').populate('updated_by').populate({
                path: 'lead',
                populate: [
                    {
                        path: 'lead_owners',
                        model: 'User'
                    },
                    {
                        path: 'referred_party',
                        model: 'ReferredParty'
                    },
                    {
                        path: 'remarks',
                        populate: [
                            {
                                path: 'created_by',
                                model: 'User'
                            },
                            {
                                path: 'updated_by',
                                model: 'User'
                            }
                        ]
                    }
                ]
            }).sort('-created_at').skip((page - 1) * limit).limit(limit)
            count = await Remark.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: req.user._id }).countDocuments()
        }


        if (id) {
            remarks = await Remark.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: id }).populate('created_by').populate('updated_by').populate({
                path: 'lead',
                populate: [
                    {
                        path: 'lead_owners',
                        model: 'User'
                    },
                    {
                        path: 'referred_party',
                        model: 'ReferredParty'
                    },
                    {
                        path: 'remarks',
                        populate: [
                            {
                                path: 'created_by',
                                model: 'User'
                            },
                            {
                                path: 'updated_by',
                                model: 'User'
                            }
                        ]
                    }
                ]
            }).sort('-created_at').skip((page - 1) * limit).limit(limit)
            count = await Remark.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: id }).countDocuments()
        }

        return res.status(200).json({
            remarks,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })
}

export const FuzzySearchLeads = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    const id = req.params.id
    let key = String(req.query.key).split(",")
    if (!key)
        return res.status(500).json({ message: "bad request" })
    let leads: ILead[] = []
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        if (key.length == 1 || key.length > 4) {
            if (id) {
                leads = await Lead.find({
                    lead_owners: id,
                    $or: [
                        { name: { $regex: key[0], $options: 'i' } },
                        { city: { $regex: key[0], $options: 'i' } },
                        { customer_name: { $regex: key[0], $options: 'i' } },
                        { customer_designation: { $regex: key[0], $options: 'i' } },
                        { mobile: { $regex: key[0], $options: 'i' } },
                        { email: { $regex: key[0], $options: 'i' } },
                        { state: { $regex: key[0], $options: 'i' } },
                        { country: { $regex: key[0], $options: 'i' } },
                        { address: { $regex: key[0], $options: 'i' } },
                        { work_description: { $regex: key[0], $options: 'i' } },
                        { turnover: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                        { alternate_email: { $regex: key[0], $options: 'i' } },
                        { lead_type: { $regex: key[0], $options: 'i' } },
                        { stage: { $regex: key[0], $options: 'i' } },
                        { lead_source: { $regex: key[0], $options: 'i' } },
                        { last_remark: { $regex: key[0], $options: 'i' } },

                    ]

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            }
            else {
                leads = await Lead.find({
                    $or: [
                        { name: { $regex: key[0], $options: 'i' } },
                        { city: { $regex: key[0], $options: 'i' } },
                        { customer_name: { $regex: key[0], $options: 'i' } },
                        { customer_designation: { $regex: key[0], $options: 'i' } },
                        { mobile: { $regex: key[0], $options: 'i' } },
                        { email: { $regex: key[0], $options: 'i' } },
                        { state: { $regex: key[0], $options: 'i' } },
                        { country: { $regex: key[0], $options: 'i' } },
                        { address: { $regex: key[0], $options: 'i' } },
                        { work_description: { $regex: key[0], $options: 'i' } },
                        { turnover: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                        { alternate_email: { $regex: key[0], $options: 'i' } },
                        { lead_type: { $regex: key[0], $options: 'i' } },
                        { stage: { $regex: key[0], $options: 'i' } },
                        { lead_source: { $regex: key[0], $options: 'i' } },
                        { last_remark: { $regex: key[0], $options: 'i' } },

                    ]

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            }
        }
        if (key.length == 2) {
            if (id) {
                leads = await Lead.find({
                    lead_owners: id,
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { state: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },

                            ]
                        }
                    ]
                    ,

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            }
            else {
                leads = await Lead.find({
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { state: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },

                            ]
                        }
                    ]
                    ,

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            }
        }
        if (key.length == 3) {
            if (id) {
                leads = await Lead.find({
                    lead_owners: id,
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { state: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { state: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },
                                { stage: { $regex: key[2], $options: 'i' } },
                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },

                            ]
                        }
                    ]
                    ,

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            }
            else {
                leads = await Lead.find({
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { state: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { state: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },
                                { stage: { $regex: key[2], $options: 'i' } },
                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },

                            ]
                        }
                    ]
                    ,

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            }
        }
        if (key.length == 4) {
            if (id) {
                leads = await Lead.find({
                    lead_owners: id,
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { state: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { state: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },
                                { stage: { $regex: key[2], $options: 'i' } },
                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[3], $options: 'i' } },
                                { city: { $regex: key[3], $options: 'i' } },
                                { customer_name: { $regex: key[3], $options: 'i' } },
                                { customer_designation: { $regex: key[3], $options: 'i' } },
                                { mobile: { $regex: key[3], $options: 'i' } },
                                { email: { $regex: key[3], $options: 'i' } },
                                { state: { $regex: key[3], $options: 'i' } },
                                { country: { $regex: key[3], $options: 'i' } },
                                { address: { $regex: key[3], $options: 'i' } },
                                { work_description: { $regex: key[3], $options: 'i' } },
                                { turnover: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile3: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[3], $options: 'i' } },
                                { alternate_email: { $regex: key[3], $options: 'i' } },
                                { lead_type: { $regex: key[3], $options: 'i' } },
                                { stage: { $regex: key[3], $options: 'i' } },
                                { lead_source: { $regex: key[3], $options: 'i' } },
                                { last_remark: { $regex: key[3], $options: 'i' } },

                            ]
                        }
                    ]
                    ,

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            }
            else {
                leads = await Lead.find({
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { state: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { state: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },
                                { stage: { $regex: key[2], $options: 'i' } },
                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[3], $options: 'i' } },
                                { city: { $regex: key[3], $options: 'i' } },
                                { customer_name: { $regex: key[3], $options: 'i' } },
                                { customer_designation: { $regex: key[3], $options: 'i' } },
                                { mobile: { $regex: key[3], $options: 'i' } },
                                { email: { $regex: key[3], $options: 'i' } },
                                { state: { $regex: key[3], $options: 'i' } },
                                { country: { $regex: key[3], $options: 'i' } },
                                { address: { $regex: key[3], $options: 'i' } },
                                { work_description: { $regex: key[3], $options: 'i' } },
                                { turnover: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile3: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[3], $options: 'i' } },
                                { alternate_email: { $regex: key[3], $options: 'i' } },
                                { lead_type: { $regex: key[3], $options: 'i' } },
                                { stage: { $regex: key[3], $options: 'i' } },
                                { lead_source: { $regex: key[3], $options: 'i' } },
                                { last_remark: { $regex: key[3], $options: 'i' } },

                            ]
                        }
                    ]
                    ,

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            }
        }

        if (!req.user?.is_admin) {
            leads = leads.filter((lead) => {
                let owners = lead.lead_owners.filter((owner) => {
                    return owner.username == req.user.username
                })
                if (owners.length > 0)
                    return lead
            })
        }
        let count = leads.length
        leads = leads.slice((page - 1) * limit, limit * page)
        return res.status(200).json({
            leads,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })

}

export const FuzzySearchCustomers = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let id = req.params.id
    let key = String(req.query.key).split(",")
    if (!key)
        return res.status(500).json({ message: "bad request" })
    let leads: ILead[] = []
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        if (key.length == 1 || key.length > 4) {
            if (id) {
                leads = await Lead.find({
                    lead_owners: id,
                    is_customer: true,
                    $or: [
                        { name: { $regex: key[0], $options: 'i' } },
                        { city: { $regex: key[0], $options: 'i' } },
                        { customer_name: { $regex: key[0], $options: 'i' } },
                        { customer_designation: { $regex: key[0], $options: 'i' } },
                        { mobile: { $regex: key[0], $options: 'i' } },
                        { email: { $regex: key[0], $options: 'i' } },
                        { state: { $regex: key[0], $options: 'i' } },
                        { country: { $regex: key[0], $options: 'i' } },
                        { address: { $regex: key[0], $options: 'i' } },
                        { work_description: { $regex: key[0], $options: 'i' } },
                        { turnover: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                        { alternate_email: { $regex: key[0], $options: 'i' } },
                        { lead_type: { $regex: key[0], $options: 'i' } },
                        { stage: { $regex: key[0], $options: 'i' } },
                        { lead_source: { $regex: key[0], $options: 'i' } },
                        { last_remark: { $regex: key[0], $options: 'i' } },

                    ]

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            } else {
                leads = await Lead.find({
                    is_customer: true,
                    $or: [
                        { name: { $regex: key[0], $options: 'i' } },
                        { city: { $regex: key[0], $options: 'i' } },
                        { customer_name: { $regex: key[0], $options: 'i' } },
                        { customer_designation: { $regex: key[0], $options: 'i' } },
                        { mobile: { $regex: key[0], $options: 'i' } },
                        { email: { $regex: key[0], $options: 'i' } },
                        { state: { $regex: key[0], $options: 'i' } },
                        { country: { $regex: key[0], $options: 'i' } },
                        { address: { $regex: key[0], $options: 'i' } },
                        { work_description: { $regex: key[0], $options: 'i' } },
                        { turnover: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                        { alternate_email: { $regex: key[0], $options: 'i' } },
                        { lead_type: { $regex: key[0], $options: 'i' } },
                        { stage: { $regex: key[0], $options: 'i' } },
                        { lead_source: { $regex: key[0], $options: 'i' } },
                        { last_remark: { $regex: key[0], $options: 'i' } },

                    ]

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            }
        }
        if (key.length == 2) {
            if (id) {
                leads = await Lead.find({
                    lead_owners: id,
                    is_customer: true,
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { state: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },

                            ]
                        }
                    ]
                    ,

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            }
            else {
                leads = await Lead.find({
                    is_customer: true,
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { state: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },

                            ]
                        }
                    ]
                    ,

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            }
        }
        if (key.length == 3) {
            if (id) {
                leads = await Lead.find({
                    lead_owners: id,
                    is_customer: true,
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { state: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { state: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },
                                { stage: { $regex: key[2], $options: 'i' } },
                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },

                            ]
                        }
                    ]
                    ,

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            } else {
                leads = await Lead.find({
                    is_customer: true,
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { state: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { state: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },
                                { stage: { $regex: key[2], $options: 'i' } },
                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },

                            ]
                        }
                    ]
                    ,

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            }
        }
        if (key.length == 4) {
            if (id) {
                leads = await Lead.find({
                    lead_owners: id,
                    is_customer: true,
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { state: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { state: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },
                                { stage: { $regex: key[2], $options: 'i' } },
                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[3], $options: 'i' } },
                                { city: { $regex: key[3], $options: 'i' } },
                                { customer_name: { $regex: key[3], $options: 'i' } },
                                { customer_designation: { $regex: key[3], $options: 'i' } },
                                { mobile: { $regex: key[3], $options: 'i' } },
                                { email: { $regex: key[3], $options: 'i' } },
                                { state: { $regex: key[3], $options: 'i' } },
                                { country: { $regex: key[3], $options: 'i' } },
                                { address: { $regex: key[3], $options: 'i' } },
                                { work_description: { $regex: key[3], $options: 'i' } },
                                { turnover: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile3: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[3], $options: 'i' } },
                                { alternate_email: { $regex: key[3], $options: 'i' } },
                                { lead_type: { $regex: key[3], $options: 'i' } },
                                { stage: { $regex: key[3], $options: 'i' } },
                                { lead_source: { $regex: key[3], $options: 'i' } },
                                { last_remark: { $regex: key[3], $options: 'i' } },

                            ]
                        }
                    ]
                    ,

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            } else {
                leads = await Lead.find({
                    is_customer: true,
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { state: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { state: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },
                                { stage: { $regex: key[2], $options: 'i' } },
                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[3], $options: 'i' } },
                                { city: { $regex: key[3], $options: 'i' } },
                                { customer_name: { $regex: key[3], $options: 'i' } },
                                { customer_designation: { $regex: key[3], $options: 'i' } },
                                { mobile: { $regex: key[3], $options: 'i' } },
                                { email: { $regex: key[3], $options: 'i' } },
                                { state: { $regex: key[3], $options: 'i' } },
                                { country: { $regex: key[3], $options: 'i' } },
                                { address: { $regex: key[3], $options: 'i' } },
                                { work_description: { $regex: key[3], $options: 'i' } },
                                { turnover: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile3: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[3], $options: 'i' } },
                                { alternate_email: { $regex: key[3], $options: 'i' } },
                                { lead_type: { $regex: key[3], $options: 'i' } },
                                { stage: { $regex: key[3], $options: 'i' } },
                                { lead_source: { $regex: key[3], $options: 'i' } },
                                { last_remark: { $regex: key[3], $options: 'i' } },

                            ]
                        }
                    ]
                    ,

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            }
        }

        if (!req.user?.is_admin) {
            leads = leads.filter((lead) => {
                let owners = lead.lead_owners.filter((owner) => {
                    return owner.username == req.user.username
                })
                if (owners.length > 0)
                    return lead
            })
        }
        let count = leads.length
        leads = leads.slice((page - 1) * limit, limit * page)
        return res.status(200).json({
            leads,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })
}

export const FuzzySearchRefers = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let id = req.params.id
    let key = String(req.query.key).split(",")
    if (!key)
        return res.status(500).json({ message: "bad request" })
    let result: {
        party: IReferredParty,
        leads: ILead[]
    }[] = []
    let parties: IReferredParty[] = []
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        if (key.length == 1 || key.length > 4) {
            if (id) {
                parties = await ReferredParty.find({
                    lead_owners: id,
                    $or: [
                        { name: { $regex: key[0], $options: 'i' } },
                        { city: { $regex: key[0], $options: 'i' } },
                        { customer_name: { $regex: key[0], $options: 'i' } },
                        { mobile: { $regex: key[0], $options: 'i' } },
                        { state: { $regex: key[0], $options: 'i' } },
                    ]
                }).populate('created_by').populate('updated_by').populate('lead_owners').sort('-created_at')
            }
            else {
                parties = await ReferredParty.find({
                    $or: [
                        { name: { $regex: key[0], $options: 'i' } },
                        { city: { $regex: key[0], $options: 'i' } },
                        { customer_name: { $regex: key[0], $options: 'i' } },
                        { mobile: { $regex: key[0], $options: 'i' } },
                        { state: { $regex: key[0], $options: 'i' } },
                    ]
                }).populate('created_by').populate('updated_by').populate('lead_owners').sort('-created_at')
            }
        }
        if (key.length == 2) {
            if (id) {
                parties = await ReferredParty.find({
                    lead_owners: id,
                    is_customer: false,
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('created_by').populate('updated_by').populate('lead_owners').sort('-created_at')
            }
            else {
                parties = await ReferredParty.find({
                    is_customer: false,
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('created_by').populate('updated_by').populate('lead_owners').sort('-created_at')
            }
        }

        if (key.length == 3) {
            if (id) {
                parties = await ReferredParty.find({
                    lead_owners: id,
                    is_customer: false,
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('created_by').populate('updated_by').populate('lead_owners').sort('-created_at')
            } else {
                parties = await ReferredParty.find({
                    is_customer: false,
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('created_by').populate('updated_by').populate('lead_owners').sort('-created_at')
            }
        }
        if (key.length == 4) {
            if (id) {
                parties = await ReferredParty.find({
                    lead_owners: id,
                    is_customer: false,
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('created_by').populate('updated_by').populate('lead_owners').sort('-created_at')
            } else {
                parties = await ReferredParty.find({
                    is_customer: false,
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('created_by').populate('updated_by').populate('lead_owners').sort('-created_at')
            }
        }
        for (let i = 0; i < parties.length; i++) {
            let leads = await Lead.find({ referred_party: parties[i] }).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                path: 'remarks',
                populate: [
                    {
                        path: 'created_by',
                        model: 'User'
                    },
                    {
                        path: 'updated_by',
                        model: 'User'
                    }
                ]
            }).sort('-created_at')
            result.push({
                party: parties[i],
                leads: leads
            })
        }
        if (!req.user?.is_admin) {
            result = result.filter((item) => {
                let owners = item.party.lead_owners.filter((owner) => {
                    return owner.username == req.user.username
                })
                if (owners.length > 0)
                    return item
            })
        }

        let count = result.length
        result = result.slice((page - 1) * limit, limit * page)

        return res.status(200).json({
            result,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }

    else
        return res.status(400).json({ message: "bad request" })

}
export const FuzzySearchUseLessLeads = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let id = req.params.id
    let key = String(req.query.key).split(",")
    if (!key)
        return res.status(500).json({ message: "bad request" })
    let leads: ILead[] = []
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {

        if (key.length == 1 || key.length > 4) {
            if (id) {
                leads = await Lead.find({
                    lead_owners: id,
                    stage: 'useless',
                    $or: [
                        { name: { $regex: key[0], $options: 'i' } },
                        { city: { $regex: key[0], $options: 'i' } },
                        { customer_name: { $regex: key[0], $options: 'i' } },
                        { customer_designation: { $regex: key[0], $options: 'i' } },
                        { mobile: { $regex: key[0], $options: 'i' } },
                        { email: { $regex: key[0], $options: 'i' } },
                        { state: { $regex: key[0], $options: 'i' } },
                        { country: { $regex: key[0], $options: 'i' } },
                        { address: { $regex: key[0], $options: 'i' } },
                        { work_description: { $regex: key[0], $options: 'i' } },
                        { turnover: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                        { alternate_email: { $regex: key[0], $options: 'i' } },
                        { lead_type: { $regex: key[0], $options: 'i' } },
                        { stage: { $regex: key[0], $options: 'i' } },
                        { lead_source: { $regex: key[0], $options: 'i' } },
                        { last_remark: { $regex: key[0], $options: 'i' } },

                    ]

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            } else {
                leads = await Lead.find({
                    stage: 'useless',
                    $or: [
                        { name: { $regex: key[0], $options: 'i' } },
                        { city: { $regex: key[0], $options: 'i' } },
                        { customer_name: { $regex: key[0], $options: 'i' } },
                        { customer_designation: { $regex: key[0], $options: 'i' } },
                        { mobile: { $regex: key[0], $options: 'i' } },
                        { email: { $regex: key[0], $options: 'i' } },
                        { state: { $regex: key[0], $options: 'i' } },
                        { country: { $regex: key[0], $options: 'i' } },
                        { address: { $regex: key[0], $options: 'i' } },
                        { work_description: { $regex: key[0], $options: 'i' } },
                        { turnover: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                        { alternate_email: { $regex: key[0], $options: 'i' } },
                        { lead_type: { $regex: key[0], $options: 'i' } },
                        { stage: { $regex: key[0], $options: 'i' } },
                        { lead_source: { $regex: key[0], $options: 'i' } },
                        { last_remark: { $regex: key[0], $options: 'i' } },

                    ]

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            }
        }
        if (key.length == 2) {
            if (id) {
                leads = await Lead.find({
                    lead_owners: id,
                    stage: 'useless',
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { state: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },

                            ]
                        }
                    ]
                    ,

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            } else {
                leads = await Lead.find({
                    stage: 'useless',
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { state: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },

                            ]
                        }
                    ]
                    ,

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            }
        }
        if (key.length == 3) {
            if (id) {
                leads = await Lead.find({
                    lead_owners: id,
                    stage: 'useless',
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { state: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { state: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },
                                { stage: { $regex: key[2], $options: 'i' } },
                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },

                            ]
                        }
                    ]
                    ,

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            } else {
                leads = await Lead.find({
                    stage: 'useless',
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { state: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { state: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },
                                { stage: { $regex: key[2], $options: 'i' } },
                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },

                            ]
                        }
                    ]
                    ,

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            }
        }
        if (key.length == 4) {
            if (id) {
                leads = await Lead.find({
                    lead_owners: id,
                    stage: 'useless',
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { state: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { state: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },
                                { stage: { $regex: key[2], $options: 'i' } },
                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[3], $options: 'i' } },
                                { city: { $regex: key[3], $options: 'i' } },
                                { customer_name: { $regex: key[3], $options: 'i' } },
                                { customer_designation: { $regex: key[3], $options: 'i' } },
                                { mobile: { $regex: key[3], $options: 'i' } },
                                { email: { $regex: key[3], $options: 'i' } },
                                { state: { $regex: key[3], $options: 'i' } },
                                { country: { $regex: key[3], $options: 'i' } },
                                { address: { $regex: key[3], $options: 'i' } },
                                { work_description: { $regex: key[3], $options: 'i' } },
                                { turnover: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile3: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[3], $options: 'i' } },
                                { alternate_email: { $regex: key[3], $options: 'i' } },
                                { lead_type: { $regex: key[3], $options: 'i' } },
                                { stage: { $regex: key[3], $options: 'i' } },
                                { lead_source: { $regex: key[3], $options: 'i' } },
                                { last_remark: { $regex: key[3], $options: 'i' } },

                            ]
                        }
                    ]
                    ,

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            } else {
                leads = await Lead.find({
                    stage: 'useless',
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { state: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { state: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },
                                { stage: { $regex: key[2], $options: 'i' } },
                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },

                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[3], $options: 'i' } },
                                { city: { $regex: key[3], $options: 'i' } },
                                { customer_name: { $regex: key[3], $options: 'i' } },
                                { customer_designation: { $regex: key[3], $options: 'i' } },
                                { mobile: { $regex: key[3], $options: 'i' } },
                                { email: { $regex: key[3], $options: 'i' } },
                                { state: { $regex: key[3], $options: 'i' } },
                                { country: { $regex: key[3], $options: 'i' } },
                                { address: { $regex: key[3], $options: 'i' } },
                                { work_description: { $regex: key[3], $options: 'i' } },
                                { turnover: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile3: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[3], $options: 'i' } },
                                { alternate_email: { $regex: key[3], $options: 'i' } },
                                { lead_type: { $regex: key[3], $options: 'i' } },
                                { stage: { $regex: key[3], $options: 'i' } },
                                { lead_source: { $regex: key[3], $options: 'i' } },
                                { last_remark: { $regex: key[3], $options: 'i' } },

                            ]
                        }
                    ]
                    ,

                }
                ).populate('lead_owners').populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-created_at')
            }
        }

        if (!req.user?.is_admin) {
            leads = leads.filter((lead) => {
                let owners = lead.lead_owners.filter((owner) => {
                    return owner.username == req.user.username
                })
                if (owners.length > 0)
                    return lead
            })
        }
        let count = leads.length
        leads = leads.slice((page - 1) * limit, limit * page)
        return res.status(200).json({
            leads,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })
}

export const GetUpdatableLeadFields = async (req: Request, res: Response, next: NextFunction) => {
    let fields = await LeadUpdatableField.findOne();
    return res.status(200).json(fields)
}


export const BackUpAllLeads = async (req: Request, res: Response, next: NextFunction) => {
    const value = String(req.query.value)
    console.log(value)
    let fileName = "blank.xlsx"
    ExportLeads([])
    let leads = await Lead.find().populate('created_by').populate('updated_by').populate('lead_owners')
    if (value === "leads" || value === "mobiles") {
        if (leads.length > 0) {
            if (value === "leads") {
                ExportLeads(leads)
                fileName = "leads_backup.xlsx"
            }
            if (value === "mobiles") {
                ExportLeadMobiles(leads)
                fileName = "lead_mobiles_backup.xlsx"
            }
            return res.download("./file", fileName)
        }
    }

    res.status(200).json({ message: "no leads found" })
}

// post/put/patch/delete
export const CreateLead = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { mobile, remark, lead_owners, alternate_mobile1, alternate_mobile2 } = body as TLeadBody & { remark: string, lead_owners: string[] }

    // validations
    if (!mobile)
        return res.status(400).json({ message: "provide primary mobile number" });

    let uniqueNumbers = []
    if (mobile)
        uniqueNumbers.push(mobile)
    if (alternate_mobile1)
        uniqueNumbers.push(alternate_mobile1)
    if (alternate_mobile2)
        uniqueNumbers.push(alternate_mobile2)

    uniqueNumbers = uniqueNumbers.filter((item, i, ar) => ar.indexOf(item) === i);

    if (uniqueNumbers[0] && await Lead.findOne({ $or: [{ mobile: uniqueNumbers[0] }, { alternate_mobile1: uniqueNumbers[0] }, { alternate_mobile2: uniqueNumbers[0] }] }))
        return res.status(400).json({ message: `${mobile} already exists ` })


    if (uniqueNumbers[1] && await Lead.findOne({ $or: [{ mobile: uniqueNumbers[1] }, { alternate_mobile1: uniqueNumbers[1] }, { alternate_mobile2: uniqueNumbers[1] }] }))
        return res.status(400).json({ message: `${uniqueNumbers[1]} already exists ` })

    if (uniqueNumbers[2] && await Lead.findOne({ $or: [{ mobile: uniqueNumbers[2] }, { alternate_mobile1: uniqueNumbers[2] }, { alternate_mobile2: uniqueNumbers[2] }] }))
        return res.status(400).json({ message: `${uniqueNumbers[2]} already exists ` })


    let new_lead_owners: IUser[] = []
    let owners = String(lead_owners).split(",")
    for (let i = 0; i < owners.length; i++) {
        let owner = await User.findById(owners[i])
        if (owner)
            new_lead_owners.push(owner)
    }
    let visiting_card: Asset = undefined
    if (req.file) {
        const allowedFiles = ["image/png", "image/jpeg", "image/gif", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "application/pdf"];
        const storageLocation = `crm/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 10 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc)
            visiting_card = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    let lead = new Lead({
        ...body,
        visiting_card: visiting_card,
        mobile: uniqueNumbers[0] || null,
        alternate_mobile1: uniqueNumbers[1] || null,
        alternate_mobile2: uniqueNumbers[2] || null,
        lead_owners: new_lead_owners,
        created_by: req.user,
        updated_by: req.user,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
    })
    if (remark) {
        let new_remark = new Remark({
            remark,
            lead: lead,
            created_at: new Date(),
            created_by: req.user,
            updated_at: new Date(),
            updated_by: req.user
        })
        await new_remark.save()
        lead.last_remark = remark
        lead.remarks = [new_remark]
    }

    await lead.save()

    return res.status(200).json("lead created")
}


export const UpdateLead = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    const { mobile, remark, lead_owners, alternate_mobile1, alternate_mobile2 } = body as TLeadBody & { remark: string, lead_owners: string[] }
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "lead id not valid" })
    let lead = await Lead.findById(id);
    if (!lead) {
        return res.status(404).json({ message: "lead not found" })
    }
    // validations
    if (!mobile)
        return res.status(400).json({ message: "provide primary mobile number" });

    let uniqueNumbers = []
    if (mobile) {
        if (mobile === lead.mobile) {
            uniqueNumbers[0] = lead.mobile
        }
        if (mobile !== lead.mobile) {
            uniqueNumbers[0] = mobile
        }
    }
    if (alternate_mobile1) {
        if (alternate_mobile1 === lead.alternate_mobile1) {
            uniqueNumbers[1] = lead.alternate_mobile1
        }
        if (alternate_mobile1 !== lead.alternate_mobile1) {
            uniqueNumbers[1] = alternate_mobile1
        }
    }
    if (alternate_mobile2) {
        if (alternate_mobile2 === lead.alternate_mobile2) {
            uniqueNumbers[2] = lead.alternate_mobile2
        }
        if (alternate_mobile2 !== lead.alternate_mobile2) {
            uniqueNumbers[2] = alternate_mobile2
        }
    }

    uniqueNumbers = uniqueNumbers.filter((item, i, ar) => ar.indexOf(item) === i);


    if (uniqueNumbers[0] && uniqueNumbers[0] !== lead.mobile && await Lead.findOne({ $or: [{ mobile: uniqueNumbers[0] }, { alternate_mobile1: uniqueNumbers[0] }, { alternate_mobile2: uniqueNumbers[0] }] }))
        return res.status(400).json({ message: `${mobile} already exists ` })


    if (uniqueNumbers[1] && uniqueNumbers[1] !== lead.alternate_mobile1 && await Lead.findOne({ $or: [{ mobile: uniqueNumbers[1] }, { alternate_mobile1: uniqueNumbers[1] }, { alternate_mobile2: uniqueNumbers[1] }] }))
        return res.status(400).json({ message: `${uniqueNumbers[1]} already exists ` })

    if (uniqueNumbers[2] && uniqueNumbers[2] !== lead.alternate_mobile2 && await Lead.findOne({ $or: [{ mobile: uniqueNumbers[2] }, { alternate_mobile1: uniqueNumbers[2] }, { alternate_mobile2: uniqueNumbers[2] }] }))
        return res.status(400).json({ message: `${uniqueNumbers[2]} already exists ` })


    let new_lead_owners: IUser[] = []
    let owners = String(lead_owners).split(",")
    for (let i = 0; i < owners.length; i++) {
        let owner = await User.findById(owners[i])
        if (owner)
            new_lead_owners.push(owner)
    }

    let visiting_card = lead?.visiting_card;
    if (req.file) {
        const allowedFiles = ["image/png", "image/jpeg", "image/gif", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "application/pdf"];
        const storageLocation = `crm/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 10 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc) {
            if (lead.visiting_card?._id)
                await destroyFile(lead.visiting_card._id)
            visiting_card = doc
        }
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    if (remark) {
        if (!lead.last_remark) {
            let new_remark = new Remark({
                remark,
                lead: lead,
                created_at: new Date(),
                created_by: req.user,
                updated_at: new Date(),
                updated_by: req.user
            })
            await new_remark.save()
            lead.last_remark = remark
            lead.remarks = [new_remark]
        }
        else {
            let last_remark = lead.remarks[lead.remarks.length - 1]
            await Remark.findByIdAndUpdate(last_remark._id, {
                remark: remark,
                lead: lead,
                updated_at: new Date(),
                updated_by: req.user,
                updated_by_username: req.user?.username,
            })
            lead.last_remark = last_remark.remark
        }
    }
    await Lead.findByIdAndUpdate(lead._id, {
        ...body,
        mobile: uniqueNumbers[0] || null,
        alternate_mobile1: uniqueNumbers[1] || null,
        alternate_mobile2: uniqueNumbers[2] || null,
        lead_owners: new_lead_owners,
        visiting_card: visiting_card,
        updated_by: req.user,
        updated_at: new Date(Date.now()),
        remarks: lead.remarks
    })

    return res.status(200).json({ message: "lead updated" })
}


export const DeleteLead = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "lead id not valid" })
    let lead = await Lead.findById(id);
    if (!lead) {
        return res.status(404).json({ message: "lead not found" })
    }
    let remarks = await Remark.find({ lead: lead._id })
    remarks.map(async (remark) => {
        await remark.remove()
    })
    await lead.remove()
    if (lead.visiting_card && lead.visiting_card._id)
        await destroyFile(lead.visiting_card?._id)

    return res.status(200).json({ message: "lead and related remarks are deleted" })
}

export const NewRemark = async (req: Request, res: Response, next: NextFunction) => {
    const { remark, lead_owners, remind_date } = req.body as { remark: string, lead_owners: string[], remind_date: string }
    if (!remark) return res.status(403).json({ message: "please fill required fields" })
    if (lead_owners && lead_owners.length === 0)
        return res.status(403).json({ message: "please select one lead owner" })
    const user = await User.findById(req.user?._id)
    if (!user)
        return res.status(403).json({ message: "please login to access this resource" })
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "lead id not valid" })

    let lead = await Lead.findById(id)
    if (!lead) {
        return res.status(404).json({ message: "lead not found" })
    }
    let new_lead_owners: IUser[] = []
    let owners = lead_owners
    for (let i = 0; i < owners.length; i++) {
        let owner = await User.findById(owners[i])
        if (owner)
            new_lead_owners.push(owner)
    }
    let new_remark = new Remark({
        remark,
        lead: lead,
        created_at: new Date(Date.now()),
        created_by: req.user,
        updated_at: new Date(Date.now()),
        updated_by: req.user
    })
    if (remind_date)
        new_remark.remind_date = new Date(remind_date)
    await new_remark.save()
    let updatedRemarks = lead.remarks
    updatedRemarks.push(new_remark)
    lead.last_remark = remark
    lead.remarks = updatedRemarks
    if (req.user) {
        lead.updated_by = req.user
        lead.lead_owners = new_lead_owners
        lead.updated_at = new Date(Date.now())
    }
    await lead.save()
    return res.status(200).json({ message: "new remark added successfully" })
}

export const BulkLeadUpdateFromExcel = async (req: Request, res: Response, next: NextFunction) => {
    let result: ILeadTemplate[] = []
    if (!req.file)
        return res.status(400).json({
            message: "please provide an Excel file",
        });
    if (req.file) {
        const allowedFiles = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only excel and csv are allowed to upload` })
        if (req.file.size > 100 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :100mb` })
        const workbook = xlsx.read(req.file.buffer);
        let workbook_sheet = workbook.SheetNames;
        let workbook_response: ILeadTemplate[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        let statusText: string = ""
        let oldLeads = await Lead.find()
        let OldNumbers: number[] = []
        oldLeads.forEach((lead) => {
            if (lead.mobile)
                OldNumbers.push(Number(lead.mobile))
            if (lead.alternate_mobile1)
                OldNumbers.push(Number(lead.alternate_mobile1))
            if (lead.alternate_mobile2)
                OldNumbers.push(Number(lead.alternate_mobile2))
        })

        let new_lead_owners: IUser[] = []
        workbook_response.forEach(async (lead) => {
            let mobile: number | null = Number(lead.mobile)
            let alternate_mobile1: number | null = Number(lead.alternate_mobile1)
            let alternate_mobile2: number | null = Number(lead.alternate_mobile2)

            let validated = true

            //important
            if (mobile && Number.isNaN(mobile)) {
                validated = false
                statusText = "invalid mobile"
            }
            if (alternate_mobile1 && Number.isNaN(alternate_mobile1)) {
                validated = false
                statusText = "invalid alternate mobile 1"
            }
            if (alternate_mobile2 && Number.isNaN(alternate_mobile2)) {
                validated = false
                statusText = "invalid alternate mobile 2"
            }
            if (alternate_mobile1 && String(alternate_mobile1).length !== 10)
                alternate_mobile1 = null
            if (alternate_mobile2 && String(alternate_mobile2).length !== 10)
                alternate_mobile2 = null

            if (lead.is_customer && typeof (lead.is_customer) !== "boolean") {
                validated = false
                statusText = "invalid is icustomer"
            }
            if (mobile && String(mobile).length !== 10) {
                validated = false
                statusText = "invalid mobile"
            }

            if (lead.created_at && !isvalidDate(new Date(lead.created_at))) {
                validated = false
                statusText = "invalid date"
            }
            if (lead.updated_at && !isvalidDate(new Date(lead.updated_at))) {
                validated = false
                statusText = "invalid date"
            }

            // duplicate number checker
            let uniqueNumbers: number[] = []
            if (mobile && !OldNumbers.includes(mobile)) {
                uniqueNumbers.push(mobile)
                OldNumbers.push(mobile)

            }
            else
                statusText = "duplicate"
            if (alternate_mobile1 && !OldNumbers.includes(alternate_mobile1)) {
                uniqueNumbers.push(alternate_mobile1)
                OldNumbers.push(alternate_mobile1)
            }
            if (alternate_mobile2 && !OldNumbers.includes(alternate_mobile2)) {
                uniqueNumbers.push(alternate_mobile2)
                OldNumbers.push(alternate_mobile2)
            }
            if (uniqueNumbers.length === 0)
                validated = false

            if (!isMongoId(String(lead._id)) && !validated) {
                result.push({
                    ...lead,
                    status: statusText
                })
            }

            if (lead.lead_owners) {
                let names = String((lead.lead_owners)).split(",")
                for (let i = 0; i < names.length; i++) {
                    let owner = await User.findOne({ username: names[i] })
                    if (owner)
                        new_lead_owners.push(owner)
                }

            }
            //update and create new nead
            console.log(validated)
            if (lead._id && isMongoId(String(lead._id))) {
                console.log(new_lead_owners)
                let targetLead = await Lead.findById(lead._id)
                if (targetLead) {
                    if (lead.remarks) {
                        if (!lead.remarks.length) {
                            let new_remark = new Remark({
                                remark: lead.remarks,
                                lead: lead,
                                created_at: new Date(),
                                created_by: req.user,
                                updated_at: new Date(),
                                updated_by: req.user
                            })
                            await new_remark.save()
                            targetLead.last_remark = lead.remarks
                            targetLead.remarks = [new_remark]
                        }
                        else {
                            let last_remark = targetLead.remarks[targetLead.remarks.length - 1]
                            await Remark.findByIdAndUpdate(last_remark._id, {
                                remark: lead.remarks,
                                lead: lead,
                                updated_at: new Date(),
                                updated_by: req.user
                            })
                            targetLead.last_remark = last_remark.remark
                        }

                    }

                    await Lead.findByIdAndUpdate(lead._id, {
                        ...lead,
                        remarks: targetLead.remarks,
                        mobile: uniqueNumbers[0] || mobile,
                        alternate_mobile1: uniqueNumbers[1] || alternate_mobile1 || null,
                        alternate_mobile2: uniqueNumbers[2] || alternate_mobile2 || null,
                        lead_owners: new_lead_owners,
                        updated_by: req.user,
                        updated_at: new Date(Date.now())
                    })
                }

            }

            if (validated) {
                if (!lead._id || !isMongoId(String(lead._id))) {
                    let newlead = new Lead({
                        ...lead,
                        _id: new Types.ObjectId(),
                        mobile: uniqueNumbers[0] || null,
                        alternate_mobile1: uniqueNumbers[1] || null,
                        alternate_mobile2: uniqueNumbers[2] || null,
                        lead_owners: new_lead_owners,
                        created_by: req.user,
                        updated_by: req.user,
                        updated_at: new Date(Date.now()),
                        created_at: new Date(Date.now()),
                        remarks: undefined
                    })
                    if (lead.remarks) {
                        let new_remark = new Remark({
                            remark: lead.remarks,
                            lead: newlead,
                            created_at: new Date(),
                            created_by: req.user,
                            updated_at: new Date(),
                            updated_by: req.user
                        })
                        await new_remark.save()
                        newlead.last_remark = lead.remarks
                        newlead.remarks = [new_remark]
                    }
                    await newlead.save()

                }
            }
        })

    }
    return res.status(200).json(result);
}

export const ConvertCustomer = async (req: Request, res: Response, next: NextFunction) => {
    const { remark } = req.body as { remark: string }
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "lead id not valid" })
    let lead = await Lead.findById(id);
    if (!lead) {
        return res.status(404).json({ message: "lead not found" })
    }
    if (remark) {
        let remarks = lead.remarks
        let new_remark = new Remark({
            remark,
            lead: lead,
            created_at: new Date(),
            created_by: req.user,
            updated_at: new Date(),
            updated_by: req.user
        })
        await new_remark.save()
        lead.last_remark = remark
        remarks.push(new_remark)
        lead.remarks = remarks
    }
    lead.is_customer = true
    lead.stage = "closed"
    lead.updated_by = req.user
    lead.updated_at = new Date(Date.now())
    await lead.save()
    return res.status(200).json({ message: "new customer created" })
}

export const ToogleUseless = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { remark } = req.body as { remark: string }
    if (!isMongoId(id)) return res.status(403).json({ message: "lead id not valid" })
    let lead = await Lead.findById(id);
    if (!lead) {
        return res.status(404).json({ message: "lead not found" })
    }
    if (lead.stage === "useless") {
        if (remark) {
            let remarks = lead.remarks
            let new_remark = new Remark({
                remark,
                lead: lead,
                created_at: new Date(),
                created_by: req.user,
                updated_at: new Date(),
                updated_by: req.user
            })
            await new_remark.save()
            lead.last_remark = remark
            remarks.push(new_remark)
            lead.remarks = remarks
        }
        lead.stage = "open"
        lead.updated_by = req.user
        lead.updated_at = new Date(Date.now())
        await lead.save()

    }
    else {
        if (remark) {
            let remarks = lead.remarks
            let new_remark = new Remark({
                remark,
                lead: lead,
                created_at: new Date(),
                created_by: req.user,
                updated_at: new Date(),
                updated_by: req.user
            })
            await new_remark.save()
            lead.last_remark = remark
            remarks.push(new_remark)
            lead.remarks = remarks
        }
        lead.stage = "useless"
        lead.updated_by = req.user
        lead.updated_at = new Date(Date.now())
        await lead.save()


    }
    return res.status(200).json({ message: "successfully changed stage" })
}

export const UpdateLeadFields = async (req: Request, res: Response, next: NextFunction) => {
    const { stages, lead_types, lead_sources } = req.body as TLeadUpdatableFieldBody
    let fields = await LeadUpdatableField.findOne();

    if (!fields) {
        let stages = ["open", "closed", "potential"]
        let lead_sources = ["internet", "leads gorilla", "whatsapp", "visit"]
        let lead_types = ["wholesale", "company", "retail"]
        fields = await new LeadUpdatableField({
            stages: stages,
            lead_sources: lead_sources,
            lead_types: lead_types,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: req.user,
            updated_by: req.user
        }).save()
        return res.status(200).json(fields)
    }

    fields.stages = stages
    fields.lead_types = lead_types
    fields.lead_sources = lead_sources
    fields.updated_at = new Date()
    if (req.user)
        fields.updated_by = req.user
    await fields.save()
    return res.status(200).json(fields)
}


export const CreateReferParty = async (req: Request, res: Response, next: NextFunction) => {
    const { name, customer_name, city, state, mobile, lead_owners } = req.body as TReferredPartyBody
    if (!name || !city || !state || !mobile || !lead_owners) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    if (!lead_owners)
        return res.status(400).json({ message: "assign at least one lead owner" });
    if (lead_owners.length < 1)
        return res.status(400).json({ message: "assign at least one lead owner" });
    let resultParty = await ReferredParty.findOne({ $or: [{ name: name }, { mobile: mobile }] })
    if (resultParty) {
        return res.status(400).json({ message: "this party already exists,check phone or name" })
    }
    let new_lead_owners: IUser[] = []
    let owners = String(lead_owners).split(",")
    for (let i = 0; i < owners.length; i++) {
        let owner = await User.findById(owners[i])
        if (owner)
            new_lead_owners.push(owner)
    }
    let party = await new ReferredParty({
        name, customer_name, city, state, mobile,
        lead_owners: new_lead_owners,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()
    return res.status(201).json(party)
}

export const UpdateReferParty = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id))
        return res.status(400).json({ message: "bad mongo id" })

    const { name, customer_name, city, state, mobile, lead_owners } = req.body as TReferredPartyBody
    if (!name || !city || !state || !mobile) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    if (!lead_owners)
        return res.status(400).json({ message: "assign at least one lead owner" });
    if (lead_owners.length < 1)
        return res.status(400).json({ message: "assign at least one lead owner" });
    let party = await ReferredParty.findById(id)
    let new_lead_owners: IUser[] = []
    let owners = String(lead_owners).split(",")
    for (let i = 0; i < owners.length; i++) {
        let owner = await User.findById(owners[i])
        if (owner)
            new_lead_owners.push(owner)
    }
    if (!party)
        return res.status(404).json({ message: "party not found" })
    if (name !== party.name || mobile !== party.mobile) {
        let resultParty = await ReferredParty.findOne({ $or: [{ name: name }, { mobile: mobile }] })
        if (resultParty) {
            return res.status(400).json({ message: "this party already exists,check phone or name" })
        }
    }

    party = await ReferredParty.findByIdAndUpdate(id, {
        name, customer_name, city, state, mobile,
        lead_owners: new_lead_owners,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    })
    return res.status(200).json({ message: "party updated" })
}



export const DeleteReferParty = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id))
        return res.status(400).json({ message: "bad mongo id" })
    let party = await ReferredParty.findById(id)
    if (!party)
        return res.status(404).json({ message: "party not found" })
    await ReferredParty.findByIdAndDelete(id)
    return res.status(200).json({ message: "deleted" })
}

export const ReferLead = async (req: Request, res: Response, next: NextFunction) => {
    const { party_id, remark } = req.body
    if (!party_id)
        return res.status(400).json({ message: "fill required field" })
    const id = req.params.id
    if (!isMongoId(id) || !isMongoId(party_id))
        return res.status(400).json({ message: "bad mongo id" })
    let lead = await Lead.findById(id)
    if (!lead)
        return res.status(404).json({ message: "lead not found" })
    let party = await ReferredParty.findById(party_id)
    if (!party)
        return res.status(404).json({ message: "referred party not found" })

    if (remark) {
        let remarks = lead.remarks
        let new_remark = new Remark({
            remark,
            lead: lead,
            created_at: new Date(),
            created_by: req.user,
            updated_at: new Date(),
            updated_by: req.user
        })
        await new_remark.save()
        lead.last_remark = remark
        remarks.push(new_remark)
        lead.remarks = remarks
    }

    lead.referred_party = party
    lead.stage = "refer"
    lead.referred_party_mobile = party.mobile
    lead.referred_party_name = party.name
    lead.referred_date = new Date()
    await lead.save()
    return res.status(200).json({ message: "party referred successfully" })
}

export const RemoveLeadReferrals = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const { remark } = req.body as { remark: string }
    if (!isMongoId(id))
        return res.status(400).json({ message: "bad mongo id" })
    let lead = await Lead.findById(id)
    if (!lead)
        return res.status(404).json({ message: "lead not found" })
    if (remark) {
        let remarks = lead.remarks
        let new_remark = new Remark({
            remark,
            lead: lead,
            created_at: new Date(),
            created_by: req.user,
            updated_at: new Date(),
            updated_by: req.user
        })
        await new_remark.save()
        lead.last_remark = remark
        remarks.push(new_remark)
        lead.remarks = remarks
    }
    lead.referred_party = undefined
    lead.referred_party_mobile = undefined
    lead.referred_party_name = undefined
    lead.referred_date = undefined
    lead.stage = "open"
    await lead.save()
    return res.status(200).json({ message: "referrals removed successfully" })
}

export const BulkDeleteUselessLeads = async (req: Request, res: Response, next: NextFunction) => {
    const { leads_ids } = req.body as { leads_ids: string[] }
    for (let i = 0; i <= leads_ids.length; i++) {
        let lead = await Lead.findById(leads_ids[i])
        if (lead) {
            let remarks = await Remark.find({ lead: lead._id })
            remarks.map(async (remark) => {
                await remark.remove()
            })
            await lead.remove()
            if (lead.visiting_card && lead.visiting_card._id)
                await destroyFile(lead.visiting_card?._id)


        }
    }
    return res.status(200).json({ message: "lead and related remarks are deleted" })
}


export const AssignRefer = async (req: Request, res: Response, next: NextFunction) => {
    const { lead_owners } = req.body as { lead_owners: string[] }
    if (lead_owners && lead_owners.length === 0)
        return res.status(403).json({ message: "please select one lead owner" })
    const user = await User.findById(req.user?._id)
    if (!user)
        return res.status(403).json({ message: "please login to access this resource" })
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "refer id not valid" })

    let refer = await ReferredParty.findById(id);
    if (!refer) {
        return res.status(404).json({ message: "refer party not found" })
    }
    let new_lead_owners: IUser[] = []
    let owners = lead_owners
    for (let i = 0; i < owners.length; i++) {
        let owner = await User.findById(owners[i])
        if (owner)
            new_lead_owners.push(owner)
    }
    if (req.user) {
        refer.updated_by = req.user
        refer.lead_owners = new_lead_owners
        refer.updated_at = new Date(Date.now())
    }
    await refer.save()
    return res.status(200).json({ message: "assigned successfully" })
}

export const BulkAssignRefer = async (req: Request, res: Response, next: NextFunction) => {
    const { lead_owners, refers } = req.body as { lead_owners: string[], refers: string[] }
    if (lead_owners && lead_owners.length === 0)
        return res.status(403).json({ message: "please select one lead owner" })
    if (refers && refers.length === 0)
        return res.status(403).json({ message: "please select one refer" })
    const user = await User.findById(req.user?._id)

    if (!user)
        return res.status(403).json({ message: "please login to access this resource" })

    let new_lead_owners: IUser[] = []
    let owners = String(lead_owners).split(",")
    for (let i = 0; i < owners.length; i++) {
        let owner = await User.findById(owners[i])
        if (owner)
            new_lead_owners.push(owner)
    }
    refers.forEach(async (referid) => {
        await ReferredParty.findByIdAndUpdate(referid, {
            lead_owners: new_lead_owners,
            updated_by: req.user,
            updated_at: new Date(Date.now())
        })
    })

    return res.status(200).json({ message: "assigned successfully" })
}
export const BulkAssignLeads = async (req: Request, res: Response, next: NextFunction) => {
    const { leads, lead_owners } = req.body as { leads: string[], lead_owners: string[] }
    if (leads && leads.length === 0)
        return res.status(403).json({ message: "please select one lead " })
    if (lead_owners && lead_owners.length === 0)
        return res.status(403).json({ message: "please select one lead owner" })

    const user = await User.findById(req.user?._id)
    if (!user)
        return res.status(403).json({ message: "please login to access this resource" })

    let new_lead_owners: IUser[] = []
    let owners = lead_owners
    for (let i = 0; i < owners.length; i++) {
        let owner = await User.findById(owners[i])
        if (owner)
            new_lead_owners.push(owner)
    }
    leads.forEach(async (leadid) => {
        await Lead.findByIdAndUpdate(leadid, {
            updated_by: req.user,
            lead_owners: new_lead_owners,
            updated_at: new Date(Date.now())
        })
    })

    return res.status(200).json({ message: "assigned successfully" })
}


export const UpdateRemark = async (req: Request, res: Response, next: NextFunction) => {
    const { remark, remind_date } = req.body as { remark: string, remind_date: string }
    if (!remark) return res.status(403).json({ message: "please fill required fields" })

    const user = await User.findById(req.user?._id)
    if (!user)
        return res.status(403).json({ message: "please login to access this resource" })
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "lead id not valid" })
    let rremark = await Remark.findById(id).populate('lead')
    if (!rremark) {
        return res.status(404).json({ message: "remark not found" })
    }
    rremark.remark = remark
    if (remind_date)
        rremark.remind_date = new Date(remind_date)
    await rremark.save()

    let lead = await Lead.findById(rremark.lead._id).populate('remarks')
    if (req.user && lead) {
        let updatedRemarks = lead.remarks
        let last_remark = updatedRemarks[updatedRemarks.length - 1]
        if (String(rremark._id) === String(last_remark._id))
            lead.last_remark = last_remark.remark
        lead.updated_by = req.user
        lead.updated_at = new Date(Date.now())
        await lead.save()
    }
    return res.status(200).json({ message: "remark updated successfully" })
}

export const DeleteRemark = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "lead id not valid" })
    let rremark = await Remark.findById(id).populate('lead')
    if (!rremark) {
        return res.status(404).json({ message: "remark not found" })
    }

    let lead = await Lead.findById(rremark.lead._id).populate('remarks')
    if (req.user && lead) {
        let updatedRemarks = lead.remarks
        updatedRemarks = updatedRemarks.filter((rr) => {
            return String(rr._id) !== String(rremark?._id)
        })
        if (updatedRemarks[updatedRemarks.length - 1])
            lead.last_remark = updatedRemarks[updatedRemarks.length - 1].remark
        lead.remarks = updatedRemarks
        lead.updated_by = req.user
        lead.updated_at = new Date(Date.now())
        await lead.save()
    }
    await rremark.remove()
    return res.status(200).json({ message: " remark deleted successfully" })

}

export const GetBroadcast = async (req: Request, res: Response, next: NextFunction) => {
    let broadcast = await Broadcast.findOne().populate('templates').populate('connected_users').populate('updated_by').populate('created_by')
    return res.status(200).json(broadcast)
}
export const StartBroadcast = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "broadcast id not valid" })
    let cron_string = GetDailyBroadcastCronString()
    let broadcast = await Broadcast.findById(id)
    if (!broadcast) {
        return res.status(404).json({ message: "broadcast not found" })
    }
    let clientids: string[] = broadcast.connected_users.map((user) => { return user.client_id })
    let newclients = clients.filter((client) => {
        if (clientids.includes(client.client_id))
            return client
    })
    if (newclients.length === 0) {
        return res.status(400).json({ message: "no whatsapp connected" })
    }
    await Broadcast.findByIdAndUpdate(id, {
        is_active: true,
        is_paused: false,
        cron_string: cron_string,
        counter: 0,
        next_run_date: new Date(cron.sendAt(cron_string))
    })

    await handleBroadcast(broadcast, newclients)
    return res.status(200).json({ message: "started" })
}

export const CreateBroadcast = async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        connected_users,
        templates,
        is_random_template,
        daily_limit,
        time_gap,
        autoRefresh } = req.body as { name: string, connected_users: string[], templates: string[], is_random_template: boolean, daily_limit: number, time_gap: number, autoRefresh: boolean }

    if (!name || !connected_users || !templates || !daily_limit || !time_gap)
        return res.status(500).json({ message: "please fill all required fields" })
    let broadcast = await Broadcast.findOne()
    if (broadcast) {
        return res.status(404).json({ message: "broadcast already exists" })
    }
    await new Broadcast({
        name,
        connected_users,
        templates,
        is_random_template,
        daily_limit,
        time_gap,
        autoRefresh,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()
    return res.status(200).json(broadcast)
}

export const UpdateBroadcast = async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        connected_users,
        templates,
        is_random_template,
        daily_limit,
        time_gap,
        autoRefresh } = req.body as { name: string, connected_users: string[], templates: string[], is_random_template: boolean, daily_limit: number, time_gap: number, autoRefresh: boolean }

    if (!name || !connected_users || !templates || !daily_limit || !time_gap)
        return res.status(500).json({ message: "please fill all required fields" })
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "broadcast id not valid" })

    await Broadcast.findByIdAndUpdate(id, {
        name,
        connected_users,
        templates: templates,
        is_random_template,
        daily_limit,
        time_gap,
        autoRefresh,
        updated_at: new Date(),
        updated_by: req.user
    })
    return res.status(200).json({ message: "updated broadcast" })
}

export const StopBroadcast = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "broadcast id not valid" })
    let broadcast = await Broadcast.findById(id)
    if (!broadcast)
        return res.status(404).json({ message: "broadcast not found" })
    broadcast.is_active = false
    broadcast.counter = 0
    timeouts.forEach((item) => {
        if (String(item.id) === String(broadcast?._id)) {
            clearTimeout(item.timeout)
        }
    })
    await broadcast.save()
    return res.status(200).json({ message: " broadcast stopped successfully" })
}

