import { NextFunction, Request, Response } from "express"
import { MessageTemplate } from "../models/watemplates/watemplate.model"
import isMongoId from "validator/lib/isMongoId"
import { User } from "../models/users/user.model"
import { clients } from "../utils/CreateWhatsappClient"
import { destroyFile } from "../utils/destroyFile.util"
import { uploadFileToCloud } from "../utils/uploadFile.util"
import { clearTimeout } from "timers"
import { ExportToExcel } from "../utils/ExportToExcel"
import { isvalidDate } from "../utils/isValidDate"
import cron from "cron"
import { ReminderManager } from "../app"
import { ContactReport } from "../models/contact/contact.report.model"
import { Reminder } from "../models/reminder/reminder.model"
import { ReminderWithMessage, ReminderWithTemplates, reminder_timeouts } from "../utils/HandleReminder"
import { GetRunningCronString } from "../utils/GetRunningCronString"
import { GetRefreshCronString } from "../utils/GetRefreshCronString"
import { Contact } from "../models/contact/contact.model"
import { IReminder, IReminderBody } from "../types/reminder.types"
import { IMessage, IMessageTemplate } from "../types/template.types"



//get
export const GetReminders = async (req: Request, res: Response, next: NextFunction) => {
    let hidden = String(req.query.hidden)
    let reminders: IReminder[] = []
    if (hidden === "true")
        reminders = await Reminder.find().populate('templates').populate('created_by').populate('updated_at').populate('updated_by').sort("-created_at")
    else
        reminders = await Reminder.find({ is_hidden: false }).populate('templates').populate('created_by').populate('updated_at').populate('updated_by').sort("-created_at")
    return res.status(200).json(reminders)
}

export const GetContactReports = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct reminder id" })
    }
    let reminder = await Reminder.findById(id)
    let reports = await ContactReport.find({ reminder: reminder }).populate('contact').populate('created_by').populate('updated_by').sort("created_at")
    return res.status(200).json(reports)
}

export const GetPaginatedContactReports = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let id = String(req.query.id)
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct reminder id" })
    }
    let reminder = await Reminder.findById(id)
    if (!reminder)
        return res.status(404).json({ message: "reminder not found" })

    if (!Number.isNaN(limit) && !Number.isNaN(page) && id) {
        let reports = await ContactReport.find({ reminder: reminder }).populate('contact').populate('created_by').populate('updated_by').sort('created_at')
            .limit(limit * 1)
            .skip((page - 1) * limit)

        let count = await ContactReport.countDocuments()
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

export const SearchContactReport = async (req: Request, res: Response, next: NextFunction) => {
    let mobile = String(`91${req.query.mobile}@c.us`)
    let name = req.query.name
    let id = String(req.query.id)
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct reminder id" })
    }
    let reminder = await Reminder.findById(id)
    if (!reminder)
        return res.status(404).json({ message: "reminder not found" })

    if (!mobile)
        return res.status(400).json({ message: "mobile not provided" })

    let reports = await ContactReport.find({
        reminder: reminder,
        $or: [
            { mobile: { $regex: mobile, $options: 'i' } },
            { name: { $regex: name, $options: 'i' } }
        ]
    }).populate('created_by').populate('updated_by').sort('created_at')
    return res.status(200).json(reports)
}


//post/put/delete/patch
export const CreateReminderByTemplate = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { name, templates, mobiles } = body as IReminderBody & { templates: string[], mobiles: string[] }
    if (!name || !templates || !mobiles)
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
    mobiles.forEach((mobile) => {
        if (!newMobiles.includes("91" + mobile + "@c.us") && mobile !== "" && mobile.length === 10)
            newMobiles.push("91" + mobile + "@c.us")
    })
    let count = await Reminder.countDocuments()
    let reminder = new Reminder({
        name,
        serial_number: String(count + 1),
        is_active: false,
        connected_number: undefined,
        templates: new_templates,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user,
    })


    reminder.running_key = reminder._id + "reminder"
    await reminder.save()
    // create report
    if (newMobiles.length > 0)
        newMobiles.forEach(async (mobile) => {
            if (req.user) {
                let contact = await Contact.findOne({ mobile: mobile })
                if (!contact) {
                    contact = new Contact({ mobile: mobile })
                    await contact.save()
                }
                await new ContactReport({
                    whatsapp_status: "pending",
                    reminder_status: "pending",
                    contact: contact,
                    created_at: new Date(),
                    updated_at: new Date(),
                    created_by: req.user,
                    updated_by: req.user,
                    reminder: reminder
                }).save()
            }
        })
    return res.status(201).json({ "message": "reminder created" })
}

export const CreateReminderByMessage = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { name, message, caption, mobiles } = body as IReminderBody & { message: string, mobiles: string[], caption: string, leads_selected: boolean }
    if (!name || !mobiles)
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

    mobiles.forEach((mobile) => {
        if (!newMobiles.includes("91" + mobile + "@c.us") && mobile !== "" && mobile.length === 10)
            newMobiles.push("91" + mobile + "@c.us")
    })



    let count = await Reminder.countDocuments()

    let reminder = new Reminder({
        name,
        serial_number: String(count + 1),
        is_active: false,
        connected_number: undefined,
        message: new_message,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user,
    })

    reminder.running_key = reminder._id + "reminder"
    await reminder.save()
    if (newMobiles.length > 0)
        newMobiles.forEach(async (mobile) => {
            if (req.user) {
                let contact = await Contact.findOne({ mobile: mobile })
                if (!contact) {
                    contact = new Contact({ mobile: mobile })
                    await contact.save()
                }
                await new ContactReport({
                    whatsapp_status: "pending",
                    reminder_status: "pending",
                    contact: contact,
                    created_at: new Date(),
                    updated_at: new Date(),
                    created_by: req.user,
                    updated_by: req.user,
                    reminder: reminder
                }).save()
            }
        })
    return res.status(201).json({ "message": "reminder created" })
}


export const UpdateReminderByMessage = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { name, message, caption, mobiles } = body as IReminderBody & { name: string, message: string, mobiles: string[], caption: string }
    if (!name || !mobiles)
        return res.status(400).json({ message: "fill all required fields" })

    if (!message && !caption && !req.file) {
        return res.status(400).json({ message: "please select one chat item" })
    }
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct reminder id" })
    }
    let reminder = await Reminder.findById(id)
    if (!reminder)
        return res.status(400).json({ message: "not found" })

    let new_message = reminder.message
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

    mobiles.forEach((mobile) => {
        if (!newMobiles.includes("91" + mobile + "@c.us") && mobile !== "" && mobile.length === 10)
            newMobiles.push("91" + mobile + "@c.us")
    })


    await Reminder.findByIdAndUpdate(reminder._id, {
        name: name,
        message: new_message,
        updated_at: new Date(),
        updated_by: req.user
    })
    if (newMobiles.length > 0) {
        let reports = await ContactReport.find({ reminder: reminder })
        reports.forEach(async (report) => {
            await report.remove()
        })
        newMobiles.forEach(async (mobile) => {
            if (req.user) {
                let contact = await Contact.findOne({ mobile: mobile })
                if (!contact) {
                    contact = new Contact({ mobile: mobile })
                    await contact.save()
                }
                await new ContactReport({
                    whatsapp_status: "pending",
                    reminder_status: "pending",
                    contact: contact,
                    created_at: new Date(),
                    updated_at: new Date(),
                    created_by: req.user,
                    updated_by: req.user,
                    reminder: reminder
                }).save()
            }
        })
    }

    return res.status(200).json({ "message": "reminder updated" })
}

export const UpdateReminderByTemplate = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { name, templates, mobiles } = body as IReminderBody & { templates: string[], mobiles: string[] }
    if (!name || !templates || !mobiles)
        return res.status(400).json({ message: "fill all required fields" })

    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct reminder id" })
    }
    let reminder = await Reminder.findById(id)
    if (!reminder)
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

    mobiles.forEach((mobile) => {
        if (!newMobiles.includes("91" + mobile + "@c.us") && mobile !== "" && mobile.length === 10)
            newMobiles.push("91" + mobile + "@c.us")
    })




    await Reminder.findByIdAndUpdate(reminder._id, {
        name: name,
        templates: new_templates,
        updated_at: new Date(),
        updated_by: req.user
    })

    if (newMobiles.length > 0) {
        let reports = await ContactReport.find({ reminder: reminder })
        reports.forEach(async (report) => {
            await report.remove()
        })
        newMobiles.forEach(async (mobile) => {
            if (req.user) {
                let contact = await Contact.findOne({ mobile: mobile })
                if (!contact) {
                    contact = new Contact({ mobile: mobile })
                    await contact.save()
                }
                await new ContactReport({
                    whatsapp_status: "pending",
                    reminder_status: "pending",
                    contact: contact,
                    created_at: new Date(),
                    updated_at: new Date(),
                    created_by: req.user,
                    updated_by: req.user,
                    reminder: reminder
                }).save()
            }
        })
    }
    return res.status(200).json({ "message": "reminder updated" })
}

export const StartReminderWithTemplate = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { client_id, frequency_value, is_random_template, frequency_type, start_date, is_todo, run_once } = body as IReminderBody & { templates: string[], mobiles: string[], client_id: string, is_random_template: boolean }

    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct reminder id" })
    }
    if (!client_id || !start_date || !frequency_value || !frequency_type) {
        return res.status(400).json({ message: "please provide required fields" })
    }
    if (!isvalidDate(new Date(start_date)))
        return res.status(400).json({
            message: "please provide valid date"
        })

    let user = await User.findOne({ client_id: client_id })
    let client = clients.find((c) => {
        return c.client_id === client_id
    })
    if (!user?.connected_number || !client)
        return res.status(500).json({ message: "whatsapp not connected" })


    let reminder = await Reminder.findById(id)
    if (!reminder)
        return res.status(400).json({ message: "not found reminder" })


    let reports = await ContactReport.find({ reminder: reminder })
    reports.forEach(async (report) => {
        if (req.user)
            if (report) {
                report.whatsapp_status = "pending"
                report.reminder_status = "pending"
                report.updated_at = new Date()
                report.updated_by = req.user
                await report.save()
            }
    })
    reminder.is_todo = Boolean(is_todo)
    reminder.run_once = Boolean(run_once)
    reminder.cron_string = GetRunningCronString(frequency_type, frequency_value, new Date(start_date)) || ""
    reminder.start_date = new Date(start_date)
    reminder.is_random_template = is_random_template
    reminder.refresh_cron_string = GetRefreshCronString(frequency_type, frequency_value, new Date(start_date)) || ""
    reminder.frequency_value = frequency_value
    reminder.frequency_type = frequency_type
    reminder.is_active = true
    reminder.connected_number = user.connected_number
    reminder.next_run_date = new Date(cron.sendAt(reminder.cron_string))
    reminder.next_refresh_date = new Date(cron.sendAt(reminder.refresh_cron_string))
    reminder.running_key = String(reminder._id) + "reminder"
    reminder.refresh_key = String(reminder._id) + "refresh"
    await reminder.save()
    if (ReminderManager.exists(reminder.running_key))
        ReminderManager.deleteJob(reminder.running_key)
    if (ReminderManager.exists(reminder.refresh_key))
        ReminderManager.deleteJob(reminder.refresh_key)
    if (req.user)
        await ReminderWithTemplates(reminder, client.client, req.user)
    return res.status(200).json({ message: "reminder activated" })
}

export const StartReminderWithMessage = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { client_id, frequency_value, frequency_type, start_date, is_todo, run_once } = body as IReminderBody & { templates: string[], mobiles: string[], client_id: string }

    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct reminder id" })
    }
    if (!client_id || !start_date || !frequency_value || !frequency_type) {
        return res.status(400).json({ message: "please provide required fields" })
    }
    if (!isvalidDate(new Date(start_date)))
        return res.status(400).json({
            message: "please provide valid date"
        })

    let user = await User.findOne({ client_id: client_id })
    let client = clients.find((c) => {
        return c.client_id === client_id
    })
    if (!user?.connected_number || !client)
        return res.status(500).json({ message: "whatsapp not connected" })


    let reminder = await Reminder.findById(id)
    if (!reminder)
        return res.status(400).json({ message: "not found reminder" })


    let reports = await ContactReport.find({ reminder: reminder })
    reports.forEach(async (report) => {
        if (req.user)
            if (report) {
                report.whatsapp_status = "pending"
                report.reminder_status = "pending"
                report.updated_at = new Date()
                report.updated_by = req.user
                await report.save()
            }
    })
    reminder.is_todo = Boolean(is_todo)
    reminder.run_once = Boolean(run_once)
    reminder.cron_string = GetRunningCronString(frequency_type, frequency_value, new Date(start_date)) || ""
    reminder.start_date = new Date(start_date)
    reminder.refresh_cron_string = GetRefreshCronString(frequency_type, frequency_value, new Date(start_date)) || ""
    reminder.frequency_value = frequency_value
    reminder.frequency_type = frequency_type
    reminder.is_active = true
    reminder.connected_number = user.connected_number
    reminder.next_run_date = new Date(cron.sendAt(reminder.cron_string))
    reminder.next_refresh_date = new Date(cron.sendAt(reminder.refresh_cron_string))
    reminder.running_key = String(reminder._id) + "reminder"
    reminder.refresh_key = String(reminder._id) + "refresh"
    await reminder.save()
    if (ReminderManager.exists(reminder.running_key))
        ReminderManager.deleteJob(reminder.running_key)
    if (ReminderManager.exists(reminder.refresh_key))
        ReminderManager.deleteJob(reminder.refresh_key)
    if (req.user)
        await ReminderWithMessage(reminder, client.client, req.user)
    return res.status(200).json({ message: "reminder activated" })
}



// export const DeleteReminder = async (req: Request, res: Response, next: NextFunction) => {
//     const id = req.params.id
//     if (!isMongoId(id)) {
//         return res.status(400).json({ message: "please provide correct reminder id" })
//     }
//     let reminder = await Reminder.findById(id)
//     if (reminder) {
//         let reports = await ContactReport.find({ reminder: reminder })
//         reports.forEach(async (report) => {
//             await report.remove()
//         })
//         if (reminder.message && reminder.message.media?.public_url) {
//             await destroyFile(reminder.message.media._id)
//         }
//         await reminder.remove()
//         if (ReminderManager.exists(reminder.running_key))
//             ReminderManager.deleteJob(reminder.running_key)
//     }

//     reminder_timeouts.forEach((item) => {
//         if (String(item.id) === String(reminder?._id)) {
//             clearTimeout(item.timeout)
//         }
//     })

//     return res.status(200).json({ "messgae": "deleted reminder" })
// }

export const ResetReminder = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct reminder id" })
    }
    let reminder = await Reminder.findById(id)
    if (!reminder)
        return res.status(400).json({ message: "not found" })
    let reports = await ContactReport.find({ reminder: reminder })
    reports.forEach(async (report) => {
        if (req.user)
            if (report) {
                report.whatsapp_status = "pending"
                report.reminder_status = "pending"
                report.updated_at = new Date()
                report.updated_by = req.user
                await report.save()
            }
    })

    await Reminder.findByIdAndUpdate(reminder._id, {
        connected_number: undefined,
        is_active: false
    })


    reminder_timeouts.forEach((item) => {
        if (String(item.id) === String(reminder?._id)) {
            clearTimeout(item.timeout)
        }
    })
    if (ReminderManager.exists(reminder.running_key))
        ReminderManager.deleteJob(reminder.running_key)
    if (ReminderManager.exists(reminder.refresh_key))
        ReminderManager.deleteJob(reminder.refresh_key)
    return res.status(200).json({ message: "reminder reset done" })
}

export const StopReminder = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct reminder id" })
    }
    let reminder = await Reminder.findById(id)
    if (!reminder)
        return res.status(400).json({ message: "not found" })
    await Reminder.findByIdAndUpdate(reminder._id, {
        is_active: false
    })

    reminder_timeouts.forEach((item) => {
        if (String(item.id) === String(reminder?._id)) {
            clearTimeout(item.timeout)
        }
    })
    if (ReminderManager.exists(reminder.running_key))
        ReminderManager.deleteJob(reminder.running_key)
    if (ReminderManager.exists(reminder.refresh_key))
        ReminderManager.deleteJob(reminder.refresh_key)
    return res.status(200).json({ message: "reminder stopped" })
}

export const ToogleHideReminder = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct reminder id" })
    }
    let reminder = await Reminder.findById(id)
    if (!reminder)
        return res.status(400).json({ message: "not found" })
    await Reminder.findByIdAndUpdate(reminder._id, {
        is_hidden: !reminder.is_hidden
    })
    return res.status(200).json({ message: "reminder hidden" })
}

export const StopSingleContactReport = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct reminder report id" })
    }
    let report = await ContactReport.findById(id)
    if (!report)
        return res.status(400).json({ message: "not found" })
    report.reminder_status = "stopped"
    await report.save()
    return res.status(200).json({ message: "reminder stopped for this contact" })
}


export const DownloadContactReports = async (req: Request, res: Response, next: NextFunction) => {
    const id = String(req.query.id)
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct reminder id" })
    }
    let reminder = await Reminder.findById(id)
    let reports = await ContactReport.find({ reminder: reminder }).populate('contact').populate('created_by').populate('updated_by').sort("created_at")
    let newreports = reports.map((report) => {
        return {
            customer_name: report.contact.name,
            mobile: report.contact.mobile.replace("91", "").replace("@c.us", ""),
            whatsapp_status: report.whatsapp_status,
            reminder_status: report.reminder_status,
            created_at: new Date(report.created_at),
            updated_at: new Date(report.updated_at),
            created_by: report.created_by && report.created_by.username
        }
    })
    let fileName = "blank.xlsx"
    if (newreports.length > 0) {
        fileName = "reminder_report.xlsx"
        ExportToExcel(newreports)
        return res.download("./file", fileName)
    }
    res.status(200).json({ message: "no reports found" })
}

