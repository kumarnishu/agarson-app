import { NextFunction, Request, Response } from "express"
import { IGreetingBody } from "../types/greeting.types"
import { isvalidDate } from "../utils/isValidDate"
import { Greeting } from "../models/greetings/greeting.model"
import { GetYearlyCronSTring } from "../utils/GetYearlyCronString"
import { StartGreetingWithTemplates } from "../utils/StartGreeting"
import { clients } from "../utils/CreateWhatsappClient"
import cron from "cron"


export const FetchGreetings = async (req: Request, res: Response, next: NextFunction) => {
    let greetings = await Greeting.find().populate('created_by').populate('updated_at').populate('updated_by').sort("-created_at")
    return res.status(200).json(greetings)
}

export const CreateGreeting = async (req: Request, res: Response, next: NextFunction) => {
    let { name, party, category, mobile, dob_time, anniversary_time } = req.body as IGreetingBody
    if (!name || !party || !category || !mobile || !dob_time || !anniversary_time)
        return res.status(400).json({ message: "fill all required fields" })
    if (await Greeting.findOne({ mobile: mobile }))
        return res.status(400).json({ message: `${mobile} already exists` });
    if (!isvalidDate(dob_time) || !isvalidDate(anniversary_time))
        return res.status(400).json({ message: "provide valid dates" })

    let greeting = new Greeting({
        name, party, category, mobile,
        dob_time: new Date(dob_time),
        anniversary_time: new Date(anniversary_time),
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user,
    })
    greeting.dob_key = greeting._id + "dob"
    greeting.anniversary_key = greeting._id + "anniversary"
    greeting.dob_cronstring = GetYearlyCronSTring(dob_time)
    greeting.anniversary_cronstring = GetYearlyCronSTring(anniversary_time)
    await greeting.save()
    return res.status(201).json({ "message": "greeting created" })
}

export const UpdateGreeting = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let { name, party, category, mobile, dob_time, anniversary_time } = req.body as IGreetingBody
    if (!name || !party || !category || !mobile || !dob_time || !anniversary_time)
        return res.status(400).json({ message: "fill all required fields" })

    if (!isvalidDate(dob_time) || !isvalidDate(anniversary_time))
        return res.status(400).json({ message: "provide valid dates" })
    let greeting = await Greeting.findById(id)
    if (!greeting)
        return res.status(400).json({ message: `greeting not found` });
    if (greeting?.mobile !== mobile)
        if (await Greeting.findOne({ mobile: mobile }))
            return res.status(400).json({ message: `${mobile} already exists` });

    await Greeting.findByIdAndUpdate(greeting._id, {
        name, party, category, mobile,
        dob_time: new Date(dob_time),
        anniversary_time: new Date(anniversary_time),
        dob_cronstring: GetYearlyCronSTring(dob_time),
        anniversary_cronstring: GetYearlyCronSTring(anniversary_time),
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

export const StartGreeting = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const client_id = req.query.client_id
    let greeting = await Greeting.findById(id)
    if (!client_id) {
        return res.status(400).json({ message: `select whatsapp number` });
    }
    if (!greeting)
        return res.status(400).json({ message: `greeting not found` });
    let client = clients.find((c) => {
        return c.client_id === client_id
    })
    if (!client)
        return res.status(500).json({ message: "whatsapp not connected" })

    StartGreetingWithTemplates(greeting, client.client, req.user)
    greeting.is_active = true
    greeting.next_run_anniversary_time = new Date(cron.sendAt(greeting.anniversary_cronstring))
    greeting.next_run_dob_time = new Date(cron.sendAt(greeting.dob_cronstring))
    await greeting.save()
    return res.status(200).json({ message: "greeting started" })
}
