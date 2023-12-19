import { Client, MessageMedia } from "whatsapp-web.js"
import { IUser } from "../types/user.types"
import { GreetingManager } from "../app"
import { Greeting } from "../models/greetings/greeting.model"
import { MessageTemplate } from "../models/watemplates/watemplate.model"
import { getRandomTemplate } from "./getRandomTemplate"



export async function SendGreetingTemplates(client: Client, user: IUser) {
    if (client) {
        let cronString = "5 0 1/1 * *"
        GreetingManager.add("greetings"
            , cronString, async () => {
                let greetings = await Greeting.find()
                greetings.forEach(async (greeting) => {
                    if (greeting.is_active) {
                        let dob_date = new Date(greeting.dob_time)
                        let anv_date = greeting.anniversary_time && new Date(greeting.anniversary_time)
                        let date = new Date()
                        if (dob_date && dob_date.getDate() === date.getDate() && dob_date.getMonth() === date.getMonth()) {
                            let templates = await MessageTemplate.find({ category: 'happy birthday' })
                            let dob_template = await getRandomTemplate(templates)
                            let url = dob_template?.template.media?.public_url || ""
                            let message = `Dear ${greeting.name}\n` + dob_template?.template.message || ""
                            let caption = `Dear ${greeting.name}\n` + dob_template?.template.caption || ""
                            let mobile = "91" + greeting.mobile + "@c.us"
                            await SendGreetingMessage(client, mobile, user, message, caption, url)
                            greeting.last_run_date = new Date()
                            await greeting.save()
                        }
                        if (anv_date && anv_date.getDate() === date.getDate() && anv_date.getMonth() === date.getMonth()) {
                            let templates = await MessageTemplate.find({ category: 'anniversary' })
                            let anniversary_template = await getRandomTemplate(templates)
                            let url = anniversary_template?.template.media?.public_url || ""
                            let message = `Dear ${greeting.name}\n` + anniversary_template?.template.message || ""
                            let caption = `Dear ${greeting.name}\n` + anniversary_template?.template.caption || ""
                            let mobile = "91" + greeting.mobile + "@c.us"
                            await SendGreetingMessage(client, mobile, user, message, caption, url)
                            greeting.last_run_date = new Date()
                            await greeting.save()
                        }
                    }
                })

            })
        GreetingManager.start("greetings")
    }
}

export async function SendGreetingMessage(client: Client, mobile: string, user: IUser, message: string, caption: string, media_url: string) {
    let isWhatsapp = await client.getContactById(mobile)
    let response = "pending"
    let sent = false
    if (isWhatsapp) {
        if (message && !caption) {
            await client.sendMessage(mobile, message)
            sent = true
        }
        if (caption && media_url) {
            client.sendMessage(mobile, await MessageMedia.fromUrl(media_url, { unsafeMime: true }), { caption: caption })
            sent = true
        }
        if (!caption && media_url) {
            await client.sendMessage(mobile, await MessageMedia.fromUrl(media_url, { unsafeMime: true }), { caption: caption })
            sent = true
        }
    }

    if (!isWhatsapp)
        response = "notwhatsapp"

    if (sent)
        response = "sent"
    return response
}
