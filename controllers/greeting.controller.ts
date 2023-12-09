import { NextFunction, Request, Response } from "express"
import { IGreetingBody } from "../types/greeting.types"
import { isvalidDate } from "../utils/isValidDate"
import { Greeting } from "../models/greetings/greeting.model"
import { clients } from "../utils/CreateWhatsappClient"
import { GreetingManager } from "../app"
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

    let newmobile = mobile
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


