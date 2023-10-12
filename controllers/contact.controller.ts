import { NextFunction, Request, Response } from "express"
import { Contact } from "../models/contact/contact.model"
import isMongoId from "validator/lib/isMongoId"
import { ContactReport } from "../models/contact/contact.report.model"
import xlsx from "xlsx"
import { IContactBody } from "../types/contact.types"

export const CreateContact = async (req: Request, res: Response, next: NextFunction) => {
    const { mobile, name } = req.body as IContactBody
    if (!mobile)
        return res.status(400).json({ message: "please provide all required fields" })
    if (await Contact.findOne({ mobile: mobile }))
        return res.status(400).json({ message: `${mobile} already exists` });
    if (req.user) {
        await new Contact({ name: name, mobile: "91" + mobile + "@c.us", created_by: req.user, updated_by: req.user }).save()
    }
    return res.status(201).json({ message: `new contact added` });
}

export const UpdateContact = async (req: Request, res: Response, next: NextFunction) => {

    const { mobile, name } = req.body as IContactBody
    if (!mobile)
        return res.status(400).json({ message: "please provide all required fields" })
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: " id not valid" })

    if (await Contact.findOne({ mobile: mobile }))
        return res.status(400).json({ message: `${mobile} already exists` });
    let contact = await Contact.findById(id)
    if (!contact) {
        return res.status(404).json({ message: "contact not found" })
    }
    if (req.user) {
        await Contact.findByIdAndUpdate(contact._id, { name: name, mobile: "91" + mobile + "@c.us", updated_at: new Date(), updated_by: req.user })
    }
    return res.status(200).json({ message: `contact updated` });
}

export const DeleteContact = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: " id not valid" })

    let contact = await Contact.findById(id)
    if (!contact) {
        return res.status(404).json({ message: "contact not found" })
    }
    await contact.remove()
    let reports = await ContactReport.find({ contact: contact })
    reports.forEach(async (report) => {
        await report.remove()
    })
    return res.status(200).json({ message: `contact deleted` });
}

export const GetContacts = async (req: Request, res: Response, next: NextFunction) => {
    let contacts = await Contact.find().populate('updated_by').populate('created_by')
    return res.status(200).json(contacts);
}


export const BulkContactUpdateFromExcel = async (req: Request, res: Response, next: NextFunction) => {
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
        let workbook_response: { name: string, mobile: string }[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        console.log(workbook_response)
        let newContacts: { name: string, mobile: string }[] = []
        workbook_response.forEach(async (lead) => {
            let mobile: string | null = lead.mobile
            let name: string | null = lead.name
            console.log(mobile, name)
            newContacts.push({ name: name, mobile: "91" + mobile + "@c.us" })
        })
        console.log(newContacts)
        newContacts.forEach(async (ct) => {
            let contact = await Contact.findOne({ mobile: ct.mobile })
            if (!contact)
                await new Contact({ name: ct.name, mobile: ct.mobile, created_by: req.user, updated_by: req.user }).save()
        })
    }
    return res.status(200).json({ message: "contacts updated" });
}