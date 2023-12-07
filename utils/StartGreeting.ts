import { Client } from "whatsapp-web.js"
import { GreetingManager } from "../app"
import { IGreeting } from "../types/greeting.types"
import { IUser } from "../types/user.types"
import { MessageTemplate } from "../models/watemplates/watemplate.model"
import { IMessageTemplate } from "../types/template.types"
import { SendGreetingMessage } from "./SendMessage"
import cron from "cron"
import { Greeting } from "../models/greetings/greeting.model"

export async function StartGreetingWithTemplates(greeting: IGreeting, client: Client, user: IUser) {
    if (greeting && client) {
        GreetingManager.add(greeting.anniversary_key
            , greeting.anniversary_cronstring, async () => {
                let templates = await MessageTemplate.find({ category: 'anniversary' })
                let anniversary_template = getRandomTemplate(templates)
                let url = anniversary_template?.template.media?.public_url || ""
                let message = `Dear ${greeting.name}\n` + anniversary_template?.template.message || ""
                let response = await SendGreetingMessage(client, greeting.mobile, user, message, "", url)
                await Greeting.findByIdAndUpdate(greeting._id, {
                    anniversary_whatsapp_status: response,
                    next_run_anniversary_time: new Date(cron.sendAt(greeting.anniversary_time)),
                    is_paused: true
                })
            })
        GreetingManager.add(greeting.dob_key
            , greeting.dob_cronstring, async () => {
                let templates = await MessageTemplate.find({ category: 'happy birthday' })
                let dob_template = getRandomTemplate(templates)
                let url = dob_template?.template.media?.public_url || ""
                let message = `Dear ${greeting.name}\n` + dob_template?.template.message || ""
                let response = await SendGreetingMessage(client, greeting.mobile, user, message, "", url)
                await Greeting.findByIdAndUpdate(greeting._id, {
                    dob_whatsapp_status: response,
                    next_run_dob_time: new Date(cron.sendAt(greeting.dob_time)),
                    is_paused: true
                })
            })
        GreetingManager.start(greeting.anniversary_key)
        GreetingManager.start(greeting.dob_key)
    }
}

function getRandomTemplate(templates: IMessageTemplate[]) {
    let new_templates: { id: number, template: IMessageTemplate }[] = templates.map((t, index) => {
        return { id: index + 1, template: t }
    })
    let template_length = new_templates.length
    let random_id = Math.floor(Math.random() * template_length) + 1
    let template = new_templates.find((t) => t.id === random_id)
    return template
}