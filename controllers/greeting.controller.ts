import { NextFunction, Request, Response } from "express"
import { IGreetingBody } from "../types/greeting.types"
import { isvalidDate } from "../utils/isValidDate"
import { Greeting } from "../models/greetings/greeting.model"
import { clients } from "../utils/CreateWhatsappClient"
import { GreetingManager } from "../app"
import { User } from "../models/users/user.model"
import xlsx from "xlsx"
import { SendGreetingTemplates } from "../utils/sendGreetingMessage"

export const FetchGreetings = async (req: Request, res: Response, next: NextFunction) => {
    let greetings = await Greeting.find().populate('created_by').populate('updated_at').populate('updated_by').sort("-created_at")
    return res.status(200).json(greetings)
}

export const CreateGreeting = async (req: Request, res: Response, next: NextFunction) => {
    let { name, party, category, mobile, dob_time, anniversary_time } = req.body as IGreetingBody
    if (!name || !party || !category || !mobile || !dob_time || !anniversary_time)
        return res.status(400).json({ message: "fill all required fields" })
    if (!isvalidDate(new Date(dob_time)) || !isvalidDate(new Date(anniversary_time)))
        return res.status(400).json({ message: "provide valid dates" })

    let newmobile = "91" + mobile + "@c.us"
    if (await Greeting.findOne({ mobile: mobile }))
        return res.status(400).json({ message: `${mobile} already exists` });

    let greeting = new Greeting({
        name, party, category, mobile: newmobile,
        dob_time: new Date(dob_time),
        anniversary_time: new Date(anniversary_time),
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
    if (!name || !party || !category || !mobile || !dob_time || !anniversary_time)
        return res.status(400).json({ message: "fill all required fields" })

    if (!isvalidDate(new Date(dob_time)) || !isvalidDate(new Date(anniversary_time)))
        return res.status(400).json({ message: "provide valid dates" })
    let greeting = await Greeting.findById(id)
    if (!greeting)
        return res.status(400).json({ message: `greeting not found` });
    let newmobile = mobile
    if (mobile !== "91" + mobile + "@c.us")
        greeting.mobile = "91" + mobile + "@c.us"
    if (greeting?.mobile !== mobile)
        if (await Greeting.findOne({ mobile: mobile }))
            return res.status(400).json({ message: `${mobile} already exists` });

    await Greeting.findByIdAndUpdate(greeting._id, {
        name, party, category, mobile: newmobile,
        dob_time: new Date(dob_time),
        anniversary_time: new Date(anniversary_time),
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
export const StopGreeting = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let greeting = await Greeting.findById(id)
    if (!greeting)
        return res.status(400).json({ message: `greeting not found` });
    else {
        greeting.is_active = false
        await greeting.save()
    }
    return res.status(200).json({ "message": "greeting stopped" })
}

export const ActivateGreeting = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let greeting = await Greeting.findById(id)
    if (!greeting)
        return res.status(400).json({ message: `greeting not found` });
    else {
        greeting.is_active = true
        await greeting.save()
    }
    return res.status(200).json({ message: "greeting started" })
}

export const StartAllGreetings = async (req: Request, res: Response, next: NextFunction) => {
    const { client_id } = req.body as { client_id: string }

    if (!client_id) {
        return res.status(400).json({ message: `select whatsapp number` });
    }

    let client = clients.find((c) => {
        return c.client_id === client_id
    })
    if (!client)
        return res.status(500).json({ message: "whatsapp not connected" })

    let user = await User.findOne({ client_id: client_id })
    SendGreetingTemplates(client.client, req.user)

    let greetings = await Greeting.find()
    greetings.forEach(async (greeting) => {
        greeting.is_active = true
        if (user)
            greeting.connected_number = user.connected_number
        await greeting.save()
    })
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



export const BulkGreetingsUpdateFromExcel = async (req: Request, res: Response, next: NextFunction) => {
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
            name: string, party: string, category: string, mobile: string, date_of_birth: string, anniversary
            : string
        }[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        console.log(workbook_response)
        let newGreetings: {
            name: string, party: string, category: string, mobile: string, date_of_birth: string, anniversary
            : string
        }[] = []
        workbook_response.forEach(async (lead) => {
            let mobile: string | null = lead.mobile
            let name: string | null = lead.name
            let party: string | null = lead.party
            let date_of_birth: string | null = lead.date_of_birth
            let anniversary: string | null = lead.anniversary
            let category: string | null = lead.category
            console.log(mobile, name)

            newGreetings.push({ name: name, party: party, category: category, date_of_birth: date_of_birth, anniversary: anniversary, mobile: "91" + mobile + "@c.us" })
        })
        console.log(newGreetings)
        // newGreetings.forEach(async (ct) => {
        //     let greeting = await Greeting.findOne({ mobile: ct.mobile })
        //     if (!greeting)
        //         await new Greeting({
        //             name: ct.name, party: ct.party, category: ct.category, date_of_birth: ct.date_of_birth, anniversary: ct.anniversary, mobile: ct.mobile, created_by: req.user, updated_by: req.user, created_at: new Date(),
        //             updated_at: new Date(),
        //         }).save()
        // })
    }
    return res.status(200).json({ message: "greetings updated" });
}