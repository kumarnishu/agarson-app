import { NextFunction, Request, Response } from "express"
import { IGreetingBody } from "../types/greeting.types"
import { isvalidDate } from "../utils/isValidDate"
import { Greeting } from "../models/greetings/greeting.model"
import { clients } from "../utils/CreateWhatsappClient"
import { GreetingManager } from "../app"
import { SendGreetingTemplates } from "../utils/sendGreetingMessage"
import xlsx from "xlsx"

export const FetchGreetings = async (req: Request, res: Response, next: NextFunction) => {
    let greetings = await Greeting.find().populate('created_by').populate('updated_at').populate('updated_by').sort("-created_at")
    return res.status(200).json(greetings)
}

export const CreateGreeting = async (req: Request, res: Response, next: NextFunction) => {
    let { name, party, category, mobile, dob_time, anniversary_time } = req.body as IGreetingBody
    if (!name || !party || !category || !mobile || !dob_time)
        return res.status(400).json({ message: "fill all required fields" })

    if (!isvalidDate(new Date(dob_time)))
        return res.status(400).json({ message: "provide valid D.O.B date" })

    if (anniversary_time && !isvalidDate(new Date(anniversary_time)))
        return res.status(400).json({ message: "provide valid Anniversary  date" })

    let newmobile = mobile
    if (await Greeting.findOne({ mobile: mobile }))
        return res.status(400).json({ message: `${mobile} already exists` });

    let greeting = new Greeting({
        name, party, category, mobile: newmobile,
        dob_time: new Date(dob_time),
        anniversary_time: anniversary_time ? new Date(anniversary_time) : null,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user,
    })
    await greeting.save()
    return res.status(201).json({ "message": "greeting created" })
}

export const UpdateGreeting = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let { name, party, category, mobile, dob_time, anniversary_time } = req.body as IGreetingBody
    if (!name || !party || !category || !mobile || !dob_time)
        return res.status(400).json({ message: "fill all required fields" })

    if (!isvalidDate(new Date(dob_time)))
        return res.status(400).json({ message: "provide valid D.O.B date" })

    if (anniversary_time && !isvalidDate(new Date(anniversary_time)))
        return res.status(400).json({ message: "provide valid Anniversary  date" })

    let greeting = await Greeting.findById(id)
    if (!greeting)
        return res.status(400).json({ message: `greeting not found` });
    let newmobile = mobile
    if (greeting?.mobile !== mobile)
        if (await Greeting.findOne({ mobile: mobile }))
            return res.status(400).json({ message: `${mobile} already exists` });

    await Greeting.findByIdAndUpdate(greeting._id, {
        name, party, category, mobile: newmobile,
        dob_time: new Date(dob_time),
        anniversary_time: anniversary_time ? new Date(anniversary_time) : null,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user,
    })
    return res.status(200).json({ "message": "greeting updated" })
}
export const DeleteGreeting = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let greeting = await Greeting.findById(id)
    if (!greeting)
        return res.status(400).json({ message: `greeting not found` });
    else
        await greeting.remove()
    return res.status(200).json({ "message": "greeting removed" })
}


export const StartAllGreetings = async (req: Request, res: Response, next: NextFunction) => {
    const CLIENT_ID = process.env.WACLIENT_ID

    if (!CLIENT_ID) {
        return res.status(400).json({ message: `inavlid whatsapp client id` });
    }
    let client = clients.find((c) => {
        return c.client_id === CLIENT_ID
    })

    if (!client)
        return res.status(500).json({ message: "whatsapp not connected" })
    SendGreetingTemplates(client.client, req.user)
    return res.status(200).json({ message: "greetings started" })
}

export const StopAllGreetings = async (req: Request, res: Response, next: NextFunction) => {
    if (GreetingManager.exists("greetings"))
        GreetingManager.deleteJob("greetings")
    let greetings = await Greeting.find()
    greetings.forEach(async (greeting) => {
        greeting.is_active = false
        await greeting.save()
    })
    return res.status(200).json({ message: "stopped greetings" })
}



export const BulkGreeetingUpdateFromExcel = async (req: Request, res: Response, next: NextFunction) => {
    let result: {
        mobile: string,
        name: string,
        party: string,
        category: string,
        date_of_birth: string,
        anniversary: string,
        status?: string
    }[] = []
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
        let workbook_response: {
            mobile: string,
            name: string,
            party: string,
            category: string,
            date_of_birth: string,
            anniversary: string
        }[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        for (let i = 0; i < workbook_response.length; i++) {
            let valid = true
            let lead = workbook_response[i]
            let mobile: number | null = Number(lead.mobile)
            let name: string | null = lead.name
            let party: string | null = lead.party
            let category: string | null = lead.category
            let dob_time: string | null = lead.date_of_birth
            let anniversary_time: string | null = lead.anniversary
            let status = ""

            if (!name || !mobile || !dob_time) {
                valid = false
                status = 'insufficient data'
            }
            if (mobile && Number.isNaN(mobile)) {
                valid = false
                status = "invalid mobile "
            }
            if (dob_time && !isvalidDate(new Date(dob_time))) {
                valid = false
                status = 'invalid dob date'
            }

            if (anniversary_time && !isvalidDate(new Date(anniversary_time))) {
                valid = false
                status = 'invalid anniversary date'
            }
            let newmobile = mobile
            if (await Greeting.findOne({ mobile: mobile })) {
                valid = false
                status = 'duplicate mobile'
            }
            if (!valid) {
                result.push({
                    ...lead,
                    status: status
                })
            }
            if (valid) {
                await new Greeting({
                    name, party, category, mobile: newmobile,
                    dob_time: new Date(dob_time),
                    anniversary_time: anniversary_time ? new Date(anniversary_time) : null,
                    created_at: new Date(),
                    updated_at: new Date(),
                    created_by: req.user,
                    updated_by: req.user,
                }).save()
            }
        }

    }
    return res.status(200).json(result);
}