import { Client, MessageMedia } from "whatsapp-web.js"
import { IMessage, IMessageTemplate } from "../types/template.types"
import { IUser } from "../types/user.types"
import { GreetingManager } from "../app"
import { Greeting } from "../models/greetings/greeting.model"
import { getRandomTemplate } from "./getRandomTemplate"
import { MessageTemplate } from "../models/watemplates/watemplate.model"

export async function sendTemplates(client: Client, mobile: string, time_gap: number, templates: IMessageTemplate[], is_random: boolean, msg_id?: string, is_todo?: boolean) {
    let response = "error"
    if (is_random) {
        let new_templates: { id: number, template: IMessageTemplate }[] = templates.map((t, index) => {
            return { id: index + 1, template: t }
        })
        let template_length = new_templates.length
        let random_id = Math.floor(Math.random() * template_length) + 1
        let template = new_templates.find((t) => t.id === random_id)
        console.log(template)
        let message = template?.template.message
        let caption = template?.template.caption
        let media_url = template?.template.media?.public_url
        let filename = template?.template.media?.filename
        let isWhatsapp = await client.getContactById(mobile)
        let sent = false

        if (isWhatsapp) {
            console.log("sending whatsapp")
            if (message) {
                if (msg_id && is_todo)
                    await client.sendMessage(mobile, message + `\n\nType STOP-${msg_id} to complete this task\n`)
                else if (msg_id && !is_todo)
                    await client.sendMessage(mobile, message)
                else
                    await client.sendMessage(mobile, message + `\n\nType STOP to stop this message\n`)
                sent = true
            }
            if (caption && media_url) {
                if (msg_id && is_todo)
                    client.sendMessage(mobile, await MessageMedia.fromUrl(media_url, { filename: filename }), { caption: caption + `\n\nType STOP-${msg_id} to complete this task\n` })
                else if (msg_id && !is_todo)
                    client.sendMessage(mobile, await MessageMedia.fromUrl(media_url, { filename: filename }), { caption: caption })
                else
                    client.sendMessage(mobile, await MessageMedia.fromUrl(media_url, { filename: filename }), { caption: caption + `\n\nType STOP to stop this message\n` })
                sent = true
            }
            if (!caption && media_url) {
                if (msg_id && is_todo)
                    await client.sendMessage(mobile, await MessageMedia.fromUrl(media_url, { filename: filename }), { caption: `\n\nType STOP-${msg_id} to complete this task\n` })
                else if (msg_id && !is_todo)
                    client.sendMessage(mobile, await MessageMedia.fromUrl(media_url, { filename: filename }))
                else
                    await client.sendMessage(mobile, await MessageMedia.fromUrl(media_url, { filename: filename }), { caption: `\n\nType STOP to stop this message\n` })
                sent = true
            }
        }
        if (!isWhatsapp)
            response = "notwhatsapp"

        if (sent)
            response = "sent"
    }

    if (!is_random) {
        for (let i = 0; i < templates.length; i++) {
            let isWhatsapp = await client.getContactById(mobile)
            let sent = false
            let message = templates[i].message
            let caption = templates[i].caption
            let media_url = templates[i].media?.public_url
            let filename = templates[i].media?.filename
            if (isWhatsapp) {
                console.log("sending whatsapp")
                if (message) {
                    if (msg_id && is_todo)
                        await client.sendMessage(mobile, message + `\n\nType STOP-${msg_id} to complete this task\n`)
                    else if (msg_id && !is_todo)
                        await client.sendMessage(mobile, message)
                    else
                        await client.sendMessage(mobile, message + `\n\nType STOP to stop this message\n`)
                    sent = true
                }
                if (caption && media_url) {
                    if (msg_id && is_todo)
                        client.sendMessage(mobile, await MessageMedia.fromUrl(media_url, { filename: filename }), { caption: caption + `\n\nType STOP-${msg_id} to complete this task\n` })
                    else if (msg_id && !is_todo)
                        client.sendMessage(mobile, await MessageMedia.fromUrl(media_url, { filename: filename }), { caption: caption })
                    else
                        client.sendMessage(mobile, await MessageMedia.fromUrl(media_url, { filename: filename }), { caption: caption + `\n\nType STOP to stop this message\n` })
                    sent = true
                }
                if (!caption && media_url) {
                    if (msg_id && is_todo)
                        await client.sendMessage(mobile, await MessageMedia.fromUrl(media_url, { filename: filename }), { caption: `\n\nType STOP-${msg_id} to complete this task\n` })
                    else if (msg_id && !is_todo)
                        client.sendMessage(mobile, await MessageMedia.fromUrl(media_url, { filename: filename }))
                    else
                        await client.sendMessage(mobile, await MessageMedia.fromUrl(media_url, { filename: filename }), { caption: `\n\nType STOP to stop this message\n` })
                    sent = true
                }
            }

            if (!isWhatsapp)
                response = "notwhatsapp"

            if (sent)
                response = "sent"
        }
    }
    return response
}

export async function sendMessage(client: Client, mobile: string, time_gap: number, message: IMessage, msg_id?: string, is_todo?: boolean) {
    let response = "error"
    let caption = message.caption
    let media_url = message.media?.public_url
    let filename = message.media?.filename
    let isWhatsapp = await client.getContactById(mobile)
    let sent = false
    let new_message = message.message
    if (isWhatsapp) {
        console.log("sending whatsapp")
        if (new_message) {
            if (msg_id && is_todo)
                await client.sendMessage(mobile, new_message + `\n\nType STOP-${msg_id} to complete this task\n`)
            else if (msg_id && !is_todo)
                await client.sendMessage(mobile, new_message)
            else
                await client.sendMessage(mobile, new_message + `\n\nType STOP to stop this message\n`)
            sent = true
        }
        if (caption && media_url) {
            if (msg_id && is_todo)
                client.sendMessage(mobile, await MessageMedia.fromUrl(media_url, { filename: filename }), { caption: caption + `\n\nType STOP-${msg_id} to complete this task\n` })
            else if (msg_id && !is_todo)
                client.sendMessage(mobile, await MessageMedia.fromUrl(media_url, { filename: filename }), { caption: caption })
            else
                client.sendMessage(mobile, await MessageMedia.fromUrl(media_url, { filename: filename }), { caption: caption + `\n\nType STOP to stop this message\n` })
            sent = true
        }
        if (!caption && media_url) {
            if (msg_id && is_todo)
                await client.sendMessage(mobile, await MessageMedia.fromUrl(media_url, { filename: filename }), { caption: `\n\nType STOP-${msg_id} to complete this task\n` })
            else if (msg_id && !is_todo)
                client.sendMessage(mobile, await MessageMedia.fromUrl(media_url, { filename: filename }))
            else
                await client.sendMessage(mobile, await MessageMedia.fromUrl(media_url, { filename: filename }), { caption: `\n\nType STOP to stop this message\n` })
            sent = true
        }
    }
    if (!isWhatsapp)
        response = "notwhatsapp"

    if (sent)
        response = "sent"
    return response
}

export async function SendGreetingMessage(client: Client, mobile: string, user: IUser, message: string, caption: string, media_url: string) {
    let isWhatsapp = await client.getContactById(mobile)
    let response = "pending"
    let sent = false
    if (isWhatsapp) {
        console.log("sending whatsapp")
        if (message && !caption) {
            await client.sendMessage(mobile, message)
            sent = true
        }
        if (caption && media_url) {
            client.sendMessage(mobile, await MessageMedia.fromUrl(media_url), { caption: caption })
            sent = true
        }
        if (!caption && media_url) {
            await client.sendMessage(mobile, await MessageMedia.fromUrl(media_url), { caption })
            sent = true
        }
    }

    if (!isWhatsapp)
        response = "notwhatsapp"

    if (sent)
        response = "sent"
    return response
}


export async function SendGreetingTemplates(client: Client, user: IUser) {
    if (client) {
        // let cronString = "1/5 * * * *"
        let cronString = "0 0 1/1 * *"
        GreetingManager.add("greetings"
            , cronString, async () => {
                let greetings = await Greeting.find()
                greetings.forEach(async (greeting) => {
                    if (greeting.is_active) {
                        let dob_date = new Date(greeting.dob_time)
                        let anv_date = new Date(greeting.anniversary_time)
                        let date = new Date()
                        if (dob_date.getDate() === date.getDate() && dob_date.getMonth() === date.getMonth()) {
                            let dob_template = getRandomTemplate(await MessageTemplate.find({ category: 'happy birthday' }))
                            let url = dob_template?.template.media?.public_url || ""
                            let message = `Dear ${greeting.name}\n` + dob_template?.template.message || ""
                            let caption = `Dear ${greeting.name}\n` + dob_template?.template.caption || ""
                            await SendGreetingMessage(client, greeting.mobile, user, message, caption, url)

                        }
                        if (anv_date.getDate() === date.getDate() && anv_date.getMonth() === date.getMonth()) {
                            let anniversary_template = getRandomTemplate(await MessageTemplate.find({ category: 'anniversary' }))
                            let url = anniversary_template?.template.media?.public_url || ""
                            let message = `Dear ${greeting.name}\n` + anniversary_template?.template.message || ""
                            let caption = `Dear ${greeting.name}\n` + anniversary_template?.template.caption || ""
                            await SendGreetingMessage(client, greeting.mobile, user, message, caption, url)
                        }
                    }
                })
            })
        GreetingManager.start("greetings")
    }
}