import { NextFunction, Request, Response } from "express"
import { MessageTemplate } from "../models/watemplates/watemplate.model"
import isMongoId from "validator/lib/isMongoId"
import { BroadCastWithTemplates, BroadCastWithMessage, timeouts } from "../utils/HandleBroadcast"
import { User } from "../models/users/user.model"
import { Broadcast } from "../models/broadcast/broadcast.model"
import Lead from "../models/leads/lead.model"
import { clients } from "../utils/CreateWhatsappClient"
import { destroyFile } from "../utils/destroyFile.util"
import { uploadFileToCloud } from "../utils/uploadFile.util"
import { BroadcastReport } from "../models/broadcast/broadcast.report.model"
import { clearTimeout } from "timers"
import { ExportToExcel } from "../utils/ExportToExcel"
import { isvalidDate } from "../utils/isValidDate"
import { GetDailyCronString } from "../utils/GetDailyCronString"
import cron from "cron"
import { BroadcastManager } from "../app"
import { IBroadcastBody } from "../types/broadcast.types"
import { IMessage, IMessageTemplate } from "../types/template.types"


//get
export const GetBroadcasts = async (req: Request, res: Response, next: NextFunction) => {
    let broadcasts = await Broadcast.find().populate('templates').populate('created_by').populate('updated_at').populate('updated_by')
    return res.status(200).json(broadcasts)
}

export const GetBroadcastReports = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct broadcast id" })
    }
    let broadcast = await Broadcast.findById(id)
    let reports = await BroadcastReport.find({ broadcast: broadcast }).populate('created_by').populate('updated_by')
    return res.status(200).json(reports)
}

export const GetPaginatedBroadcastReports = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let id = String(req.query.id)
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct broadcast id" })
    }
    let broadcast = await Broadcast.findById(id)
    if (!broadcast)
        return res.status(404).json({ message: "broadcast not found" })

    if (!Number.isNaN(limit) && !Number.isNaN(page) && id) {
        let reports = await BroadcastReport.find({ broadcast: broadcast }).populate('created_by').populate('updated_by').sort('-updated_at')
            .limit(limit * 1)
            .skip((page - 1) * limit)

        let count = await BroadcastReport.countDocuments()
        return res.status(200).json({
            reports,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(500).json({ message: "bad request" })

}

export const SearchBroadcastReportByMobile = async (req: Request, res: Response, next: NextFunction) => {
    let mobile = String(`91${req.query.mobile}@c.us`)
    let id = String(req.query.id)
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct broadcast id" })
    }
    let broadcast = await Broadcast.findById(id)
    if (!broadcast)
        return res.status(404).json({ message: "broadcast not found" })

    if (!mobile)
        return res.status(400).json({ message: "mobile not provided" })

    let reports = await BroadcastReport.find({ broadcast: broadcast, mobile: mobile }).populate('created_by').populate('updated_by').sort('-updated_at')
    return res.status(200).json(reports)
}

//post/put/delete/patch
export const CreateBroadcastByTemplate = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { name, templates, mobiles } = body as IBroadcastBody & { templates: string[], mobiles: string[] }
    if (!name || !templates)
        return res.status(400).json({ message: "fill all required fields" })

    // if templates
    let new_templates: IMessageTemplate[] = []
    if (templates && templates.length > 0)
        for (let i = 0; i < templates.length; i++) {
            let item = await MessageTemplate.findById(templates[i])
            if (item)
                new_templates.push(item)
        }

    if (new_templates.length == 0)
        return res.status(400).json({ "message": "must provide one template" })

    let newMobiles: string[] = []
    if (mobiles) {
        mobiles.forEach((mobile) => {
            if (!newMobiles.includes("91" + mobile + "@c.us") && mobile !== "" && mobile.length === 10)
                newMobiles.push("91" + mobile + "@c.us")
        })
    }
    //for leads
    if (!mobiles) {
        let oldLeads = await Lead.find().sort('-created_at')
        oldLeads = oldLeads.filter((l) => { return l.stage !== "useless" })
        oldLeads.forEach((lead) => {
            if (lead.mobile)
                newMobiles.push("91" + lead.mobile + "@c.us")
            if (lead.alternate_mobile1)
                newMobiles.push("91" + lead.alternate_mobile1 + "@c.us")
            if (lead.alternate_mobile2)
                newMobiles.push("91" + lead.alternate_mobile2 + "@c.us")
        })
    }



    let broadcast = new Broadcast({
        name,
        is_active: false,
        connected_number: undefined,
        templates: new_templates,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user,
    })

    if (!mobiles) {
        broadcast.leads_selected = true
    }
    broadcast.cron_key = broadcast._id + "broadcast"
    await broadcast.save()
    // create report
    if (newMobiles.length > 0)
        newMobiles.forEach(async (mobile) => {
            if (req.user)
                await new BroadcastReport({
                    mobile: mobile,
                    customer_name: "",
                    is_buisness: false,
                    status: "pending",
                    created_at: new Date(),
                    updated_at: new Date(),
                    created_by: req.user,
                    updated_by: req.user,
                    broadcast: broadcast
                }).save()
        })
    return res.status(201).json({ "message": "broadcast created" })
}
export const CreateBroadcastByMessage = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { name, message, caption, mobiles } = body as IBroadcastBody & { message: string, mobiles: string[], caption: string, leads_selected: boolean }
    if (!name)
        return res.status(400).json({ message: "fill all required fields" })


    if (!message && !caption && !req.file) {
        return res.status(400).json({ message: "please select one chat item" })
    }
    let new_message: IMessage | undefined = {
        message: message,
        caption: caption
    }
    // if templates
    if (req.file) {
        const allowedFiles = ["image/png", "image/jpeg", "image/gif", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
        const storageLocation = `wamessages/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 1024 * 1024 * 10)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc) {
            new_message.media = doc
        }
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    let newMobiles: string[] = []
    if (mobiles) {
        mobiles.forEach((mobile) => {
            if (!newMobiles.includes("91" + mobile + "@c.us") && mobile !== "" && mobile.length === 10)
                newMobiles.push("91" + mobile + "@c.us")
        })
    }
    //for leads
    if (!mobiles) {
        let oldLeads = await Lead.find().sort('-created_at')
        oldLeads = oldLeads.filter((l) => { return l.stage !== "useless" })
        oldLeads.forEach((lead) => {
            if (lead.mobile)
                newMobiles.push("91" + lead.mobile + "@c.us")
            if (lead.alternate_mobile1)
                newMobiles.push("91" + lead.alternate_mobile1 + "@c.us")
            if (lead.alternate_mobile2)
                newMobiles.push("91" + lead.alternate_mobile2 + "@c.us")
        })
    }



    let broadcast = new Broadcast({
        name,
        is_active: false,
        connected_number: undefined,
        message: new_message,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user,
    })

    if (!mobiles) {
        broadcast.leads_selected = true
    }
    broadcast.cron_key = broadcast._id + "broadcast"
    await broadcast.save()
    if (newMobiles.length > 0)
        newMobiles.forEach(async (mobile) => {
            if (req.user)
                await new BroadcastReport({
                    mobile: mobile,
                    customer_name: "",
                    is_buisness: false,
                    status: "pending",
                    created_at: new Date(),
                    updated_at: new Date(),
                    created_by: req.user,
                    updated_by: req.user,
                    broadcast: broadcast
                }).save()
        })
    return res.status(201).json({ "message": "broadcast created" })
}

export const UpdateBroadcastByMessage = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { name, message, caption, mobiles } = body as { name: string, message: string, mobiles: string[], caption: string }
    if (!name)
        return res.status(400).json({ message: "fill all required fields" })

    if (!message && !caption && !req.file) {
        return res.status(400).json({ message: "please select one chat item" })
    }
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct broadcast id" })
    }
    let broadcast = await Broadcast.findById(id)
    if (!broadcast)
        return res.status(400).json({ message: "not found" })

    let new_message = broadcast.message
    new_message.caption = caption
    new_message.message = message

    // if templates
    if (req.file) {
        const allowedFiles = ["image/png", "image/jpeg", "image/gif", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
        const storageLocation = `wamessages/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 1024 * 1024 * 10)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc) {
            if (new_message.media?._id)
                await destroyFile(new_message.media?._id)
            new_message.media = doc
        }
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }

    let newMobiles: string[] = []
    if (mobiles) {
        mobiles.forEach((mobile) => {
            if (!newMobiles.includes("91" + mobile + "@c.us") && mobile !== "" && mobile.length === 10)
                newMobiles.push("91" + mobile + "@c.us")
        })
    }
    //for leads
    if (!mobiles) {
        let oldLeads = await Lead.find().sort('-created_at')
        oldLeads = oldLeads.filter((l) => { return l.stage !== "useless" })
        oldLeads.forEach((lead) => {
            if (lead.mobile)
                newMobiles.push("91" + lead.mobile + "@c.us")
            if (lead.alternate_mobile1)
                newMobiles.push("91" + lead.alternate_mobile1 + "@c.us")
            if (lead.alternate_mobile2)
                newMobiles.push("91" + lead.alternate_mobile2 + "@c.us")
        })
    }



    let leads_selected = false
    if (!mobiles) {
        leads_selected = true
    }
    await Broadcast.findByIdAndUpdate(broadcast._id, {
        name: name,
        message: new_message,
        updated_at: new Date(),
        updated_by: req.user,
        leads_selected: leads_selected
    })
    if (newMobiles.length > 0) {
        let reports = await BroadcastReport.find({ broadcast: broadcast })
        reports.forEach(async (report) => {
            await report.remove()
        })
        newMobiles.forEach(async (mobile) => {
            if (req.user)
                await new BroadcastReport({
                    mobile: mobile,
                    customer_name: "",
                    is_buisness: false,
                    status: "pending",
                    created_at: new Date(),
                    updated_at: new Date(),
                    created_by: req.user,
                    updated_by: req.user,
                    broadcast: broadcast
                }).save()
        })
        if (BroadcastManager.exists(broadcast.cron_key))
            BroadcastManager.deleteJob(broadcast.cron_key)
    }
    return res.status(200).json({ "message": "broadcast updated" })
}

export const UpdateBroadcastByTemplate = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { name, templates, mobiles } = body as IBroadcastBody & {
        templates: string[], mobiles: string[]
    }
    if (!name || !templates)
        return res.status(400).json({ message: "fill all required fields" })

    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct broadcast id" })
    }
    let broadcast = await Broadcast.findById(id)
    if (!broadcast)
        return res.status(400).json({ message: "not found" })

    // if templates
    let new_templates: IMessageTemplate[] = []
    if (templates && templates.length > 0)
        for (let i = 0; i < templates.length; i++) {
            let item = await MessageTemplate.findById(templates[i])
            if (item)
                new_templates.push(item)
        }

    if (new_templates.length == 0)
        return res.status(400).json({ "message": "must provide one template" })

    let newMobiles: string[] = []
    if (mobiles) {
        mobiles.forEach((mobile) => {
            if (!newMobiles.includes("91" + mobile + "@c.us") && mobile !== "" && mobile.length === 10)
                newMobiles.push("91" + mobile + "@c.us")
        })
    }
    //for leads
    if (!mobiles) {
        let oldLeads = await Lead.find().sort('-created_at')
        oldLeads = oldLeads.filter((l) => { return l.stage !== "useless" })
        oldLeads.forEach((lead) => {
            if (lead.mobile)
                newMobiles.push("91" + lead.mobile + "@c.us")
            if (lead.alternate_mobile1)
                newMobiles.push("91" + lead.alternate_mobile1 + "@c.us")
            if (lead.alternate_mobile2)
                newMobiles.push("91" + lead.alternate_mobile2 + "@c.us")
        })
    }



    let leads_selected = false
    if (!mobiles) {
        leads_selected = true
    }
    await Broadcast.findByIdAndUpdate(broadcast._id, {
        name: name,
        templates: new_templates,
        updated_at: new Date(),
        updated_by: req.user,
        leads_selected: leads_selected
    })
    if (newMobiles.length > 0) {
        let reports = await BroadcastReport.find({ broadcast: broadcast })
        reports.forEach(async (report) => {
            await report.remove()
        })
        newMobiles.forEach(async (mobile) => {
            if (req.user)
                await new BroadcastReport({
                    mobile: mobile,
                    customer_name: "",
                    is_buisness: false,
                    status: "pending",
                    created_at: new Date(),
                    updated_at: new Date(),
                    created_by: req.user,
                    updated_by: req.user,
                    broadcast: broadcast
                }).save()
        })
        if (BroadcastManager.exists(broadcast.cron_key))
            BroadcastManager.deleteJob(broadcast.cron_key)
    }
    return res.status(200).json({ "message": "broadcast updated" })
}

export const StartBroadcastWithMessage = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { client_id, time_gap, daily_limit, autoRefresh, start_date } = body as {
        client_id: string, daily_limit: number, time_gap: string, is_random_template: boolean, autoRefresh: boolean, start_date: string
    }
    if (!isvalidDate(new Date(start_date)))
        return res.status(400).json({
            message: "please provide valid date"
        })

    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct broadcast id" })
    }
    if (Number(daily_limit) <= 0)
        return res.status(400).json({ message: "daily limit should be greater than 0" })
    if (Number(time_gap) < 5)
        return res.status(400).json({ message: "time gap should be greater than 4" })
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct broadcast id" })
    }

    if (!client_id || !time_gap) {
        return res.status(400).json({ message: "please provide required fields" })
    }
    let user = await User.findOne({ client_id: client_id })
    let client = clients.find((c) => {
        return c.client_id === client_id
    })
    if (!user?.connected_number || !client)
        return res.status(500).json({ message: "whatsapp not connected" })
    if (Number.isNaN(time_gap)) {
        return res.status(400).json({ message: "please provide valid time gap in seconds" })
    }

    let broadcast = await Broadcast.findById(id)
    if (!broadcast)
        return res.status(400).json({ message: "not found broadcast" })
    if (time_gap) {
        broadcast.time_gap = time_gap
    }

    broadcast.autoRefresh = Boolean(autoRefresh)
    let cron_string = GetDailyCronString(new Date(start_date))
    broadcast.cron_string = cron_string
    broadcast.next_run_date = new Date(cron.sendAt(broadcast.cron_string))
    broadcast.start_date = new Date(start_date)
    broadcast.daily_limit = daily_limit
    broadcast.is_active = true
    broadcast.daily_count = 0
    await broadcast.save()
    if (req.user)
        await BroadCastWithMessage(broadcast, client.client, req.user)
    if (user)
        broadcast.connected_number = user.connected_number
    await broadcast.save()
    return res.status(200).json({ message: "broadcast activated" })
}

export const StartBroadcastWithTemplate = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { client_id, time_gap, is_random_template, daily_limit, autoRefresh, start_date } = body as {
        client_id: string, daily_limit: number, time_gap: string, is_random_template: boolean, autoRefresh: boolean, start_date: string
    }
    if (!isvalidDate(new Date(start_date)))
        return res.status(400).json({
            message: "please provide valid date"
        })
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct broadcast id" })
    }
    if (Number(daily_limit) <= 0)
        return res.status(400).json({ message: "daily limit should be greater than 0" })
    if (Number(time_gap) < 5)
        return res.status(400).json({ message: "time gap should be greater than 4" })
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct broadcast id" })
    }

    if (!client_id || !time_gap) {
        return res.status(400).json({ message: "please provide required fields" })
    }
    let user = await User.findOne({ client_id: client_id })
    let client = clients.find((c) => {
        return c.client_id === client_id
    })
    if (!user?.connected_number || !client)
        return res.status(500).json({ message: "whatsapp not connected" })
    if (Number.isNaN(time_gap)) {
        return res.status(400).json({ message: "please provide valid time gap in seconds" })
    }

    let broadcast = await Broadcast.findById(id).populate('templates')
    if (!broadcast)
        return res.status(400).json({ message: "not found broadcast" })


    if (time_gap) {
        broadcast.time_gap = time_gap
    }
    if (is_random_template) {
        broadcast.is_random_template = true
    }
    if (!is_random_template)
        broadcast.is_random_template = false

    broadcast.autoRefresh = Boolean(autoRefresh)
    let cron_string = GetDailyCronString(new Date(start_date))
    broadcast.cron_string = cron_string
    broadcast.next_run_date = new Date(cron.sendAt(broadcast.cron_string))
    broadcast.start_date = new Date(start_date)
    broadcast.daily_limit = daily_limit
    broadcast.is_active = true
    broadcast.daily_count = 0



    await broadcast.save()
    if (req.user)
        await BroadCastWithTemplates(broadcast, client.client, req.user)
    if (user)
        broadcast.connected_number = user.connected_number
    await broadcast.save()
    return res.status(200).json({ message: "broadcast activated" })
}



export const DeleteBroadcast = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct broadcast id" })
    }
    let broadcast = await Broadcast.findById(id)
    if (broadcast) {
        let reports = await BroadcastReport.find({ broadcast: broadcast })
        reports.forEach(async (report) => {
            await report.remove()
        })
        if (broadcast.message && broadcast.message.media?.public_url) {
            await destroyFile(broadcast.message.media._id)
        }
        await broadcast.remove()
        if (BroadcastManager.exists(broadcast.cron_key))
            BroadcastManager.deleteJob(broadcast.cron_key)
    }

    timeouts.forEach((item) => {
        if (String(item.id) === String(broadcast?._id)) {
            clearTimeout(item.timeout)
        }
    })

    return res.status(200).json({ "messgae": "deleted broadcast" })
}

export const ResetBroadcast = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct broadcast id" })
    }
    let broadcast = await Broadcast.findById(id)
    if (!broadcast)
        return res.status(400).json({ message: "not found" })

    let newMobiles: string[] = []
    let oldLeads = await Lead.find().sort('-created_at')
    oldLeads = oldLeads.filter((l) => { return l.stage !== "useless" })
    oldLeads.forEach((lead) => {
        if (lead.mobile)
            newMobiles.push("91" + lead.mobile + "@c.us")
        if (lead.alternate_mobile1)
            newMobiles.push("91" + lead.alternate_mobile1 + "@c.us")
        if (lead.alternate_mobile2)
            newMobiles.push("91" + lead.alternate_mobile2 + "@c.us")
    })

    if (newMobiles.length > 0) {
        let reports = await BroadcastReport.find({ broadcast: broadcast })
        reports.forEach(async (report) => {
            await report.remove()
        })
        newMobiles.forEach(async (mobile) => {
            if (req.user)
                await new BroadcastReport({
                    mobile: mobile,
                    customer_name: "",
                    is_buisness: false,
                    status: "pending",
                    created_at: new Date(),
                    updated_at: new Date(),
                    created_by: req.user,
                    updated_by: req.user,
                    broadcast: broadcast
                }).save()
        })
    }


    timeouts.forEach((item) => {
        if (String(item.id) === String(broadcast?._id)) {
            clearTimeout(item.timeout)
        }
    })
    if (BroadcastManager.exists(broadcast.cron_key))
        BroadcastManager.deleteJob(broadcast.cron_key)
    return res.status(200).json({ message: "broadcast reset done" })
}

export const StopBroadcast = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct broadcast id" })
    }
    let broadcast = await Broadcast.findById(id)
    if (!broadcast)
        return res.status(400).json({ message: "not found" })
    await Broadcast.findByIdAndUpdate(broadcast._id, {
        is_active: false,
        daily_count: 0,
    })

    timeouts.forEach((item) => {
        if (String(item.id) === String(broadcast?._id)) {
            clearTimeout(item.timeout)
        }
    })
    if (BroadcastManager.exists(broadcast.cron_key))
        BroadcastManager.deleteJob(broadcast.cron_key)
    return res.status(200).json({ message: "broadcast stopped" })
}

export const StopSingleBroadcastReport = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct broadcast report id" })
    }
    let report = await BroadcastReport.findById(id)
    if (!report)
        return res.status(400).json({ message: "not found" })
    report.status = "stopped"
    await report.save()
    return res.status(200).json({ message: "broadcast stopped for this number" })
}



export const DownloadBroadcastReports = async (req: Request, res: Response, next: NextFunction) => {
    const id = String(req.query.id)
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct broadcast id" })
    }
    let broadcast = await Broadcast.findById(id)
    let reports = await BroadcastReport.find({ broadcast: broadcast }).populate('created_by').populate('updated_by').sort('-updated_at')
    let newreports = reports.map((report) => {
        return {
            mobile: report.mobile.replace("91", "").replace("@c.us", ""),
            status: report.status,
            is_business: report.is_buisness,
            customer_name: report.customer_name,
            created_at: new Date(report.created_at),
            updated_at: new Date(report.updated_at),
            created_by: report.created_by && report.created_by.username
        }
    })
    let fileName = "blank.xlsx"
    if (newreports.length > 0) {
        fileName = "broadcast_report.xlsx"
        ExportToExcel(newreports)
        return res.download("./file", fileName)
    }
    res.status(200).json({ message: "no reports found" })
}

export const SetDailyCount = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const { count } = req.body
    if (!count)
        return res.status(400).json({ message: "please provide daily count" })
    if (!isMongoId(id))
        return res.status(400).json({ message: "please provide correct broadcast id" })


    let broadcast = await Broadcast.findById(id)
    if (broadcast) {
        if (broadcast.daily_limit < count)
            return res.status(400).json({ message: "should be smaller or equal to daily limit" })
        broadcast.daily_count = count
        await broadcast.save()
    }
    return res.status(200).json({ message: "daily count reset succcessful" })
}
