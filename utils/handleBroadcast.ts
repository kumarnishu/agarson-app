import { Client, MessageMedia } from "whatsapp-web.js";
import { Broadcast } from "../models/leads/broadcast.model";
import Lead from "../models/leads/lead.model";
import { IBroadcast } from "../types/crm.types";
import { IMessageTemplate } from "../types/template.types";
import { getRandomTemplate } from "./getRandomTemplate";
export var timeouts: { id: string, timeout: NodeJS.Timeout }[] = []

export async function handleBroadcast(broadcast: IBroadcast, clients: {
    client_id: string;
    client: Client;
}[]) {
    let latest_broadcast = await Broadcast.findById(broadcast._id).populate('templates').populate('connected_users')
    if (latest_broadcast && latest_broadcast.is_active && latest_broadcast.connected_users) {
        console.log("no of clients", clients.length)
        let count = await Lead.find({ stage: { $ne: 'useless' }, is_sent: false }).limit(70 - latest_broadcast.counter).countDocuments()
        if (count === 0 && latest_broadcast.autoRefresh) {
            await Lead.updateMany({ is_sent: true }, { is_sent: false })
        }
        let limit = (70 * clients.length - latest_broadcast.counter) / clients.length
        for (let i = 0; i < clients.length; i++) {
            let client = clients[i]
            await handleReports(i, client, limit, latest_broadcast, clients)
        }
    }
}

export async function handleReports(i: number, client: {
    client_id: string;
    client: Client;
}, limit: number, broadcast: IBroadcast, clients: {
    client_id: string;
    client: Client;
}[]) {
    let is_random = broadcast.is_random_template
    let templates = broadcast.templates
    let timeinsec = 5000
    let tmpreports = await Lead.find({ stage: { $ne: 'useless' }, is_sent: false }).sort('-created_at').skip((i + 1 - 1) * limit).limit(limit)

    for (let j = 0; j < tmpreports.length; j++) {
        let timeout = setTimeout(async () => {
            let latest_broadcast = await Broadcast.findById(broadcast._id).populate('templates').populate('connected_users')
            console.log("sending broadcast leads", tmpreports[j].mobile)
            if (latest_broadcast && latest_broadcast?.is_active) {
                //@ts-ignore
                tmpreports[j].last_whatsapp = undefined
                //report1
                let mobile = "91" + String(tmpreports[j].mobile) + "@c.us"
                if (await client.client.getNumberId(mobile)) {
                    console.log("Sending to", mobile, "from", client.client_id)
                    await sendTemplates(client.client, mobile, templates, is_random, broadcast)
                    tmpreports[j].last_whatsapp = new Date()
                }


                if (tmpreports[j].alternate_mobile1) {
                    let altmob1 = "91" + String(tmpreports[j].alternate_mobile1) + "@c.us"
                    if (await client.client.getNumberId(altmob1)) {
                        await sendTemplates(client.client, altmob1, templates, is_random, broadcast)
                        tmpreports[j].last_whatsapp = new Date()
                    }
                }

                if (tmpreports[j].alternate_mobile2) {
                    let altmob2 = "91" + String(tmpreports[j].alternate_mobile2) + "@c.us"
                    if (await client.client.getNumberId(altmob2)) {
                        await sendTemplates(client.client, altmob2, templates, is_random, broadcast)
                        tmpreports[j].last_whatsapp = new Date()
                    }
                }
                tmpreports[j].is_sent = true
                await tmpreports[j].save()
                latest_broadcast.updated_at = new Date()
                await latest_broadcast.save()
            }
        }, Number(timeinsec));
        timeouts.push({ id: broadcast._id, timeout: timeout })
        timeinsec = timeinsec + Number(broadcast.time_gap) * 1000 + Math.ceil(Math.random() * 4) * 1000
        console.log(timeinsec)
    }
    timeinsec = timeinsec + (1000 * 60 * 40)
    if (new Date().getHours() > 18 && new Date().getHours() < 9) {
        console.log("clearing timeouts")
        timeouts.forEach((item) => {
            if (String(item.id) === String(broadcast?._id)) {
                clearTimeout(item.timeout)
            }
        })
    }
    else {
        console.log("handling broadcast next time")
        let timeout2 = setTimeout(async () => {
            await handleBroadcast(broadcast, clients);
        }, timeinsec);
        timeouts.push({ id: broadcast._id, timeout: timeout2 })
    }
    console.log(timeinsec)
}

export async function sendTemplates(client: Client, mobile: string, templates: IMessageTemplate[], is_random: boolean, broadcast: IBroadcast) {
    console.log("sending templates")
    let latest_broadcast = await Broadcast.findById(broadcast._id)
    let template = templates[0]
    let template1 = getRandomTemplate(templates)
    if (is_random && template1)
        template = template1?.template
    let url = template.media && template.media?.public_url
    let caption = template.caption
    let message = template.message
    let filename = template.media && template.media?.filename
    if (message) {
        await client.sendMessage(mobile, message)
    }
    if (url && !caption) {
        if (url && !caption) {
            await client.sendMessage(mobile, await MessageMedia.fromUrl(url, { filename: filename, unsafeMime: true }), { caption: "\n\ntype stop to unsubscribe" })
        }
    }
    if (url && caption) {
        await client.sendMessage(mobile, (await MessageMedia.fromUrl(url, { filename: filename, unsafeMime: true })), { caption: caption + "\n\ntype stop to unsubscribe" })
    }
    if (latest_broadcast) {
        latest_broadcast.counter = latest_broadcast.counter + 1
        await latest_broadcast.save()
    }
}