import { Client, MessageMedia } from "whatsapp-web.js";
import { Broadcast } from "../models/leads/broadcast.model";
import Lead from "../models/leads/lead.model";
import { IBroadcast } from "../types/crm.types";
import { IMessageTemplate } from "../types/template.types";
import { getRandomTemplate } from "./getRandomTemplate";
import cron from "cron"
export var timeouts: { id: string, timeout: NodeJS.Timeout }[] = []

export async function handleBroadcast(broadcast: IBroadcast, clients: {
    client_id: string;
    client: Client;
}[]) {
    let latest_broadcast = await Broadcast.findById(broadcast._id).populate('templates').populate('connected_users')
    if (latest_broadcast && latest_broadcast.connected_users) {
        latest_broadcast.next_run_date = new Date(cron.sendAt(broadcast.cron_string))
        await latest_broadcast.save()
        console.log("no of clients", clients.length)
        let count = await Lead.find({ stage: { $ne: 'useless' }, is_sent: false }).limit(latest_broadcast.daily_limit - latest_broadcast.counter).countDocuments()
        if (count === 0 && latest_broadcast.autoRefresh) {
            await Lead.updateMany({ is_sent: true }, { is_sent: false })
        }
        let limit = (latest_broadcast.daily_limit - latest_broadcast.counter) / clients.length
        for (let i = 0; i < clients.length; i++) {
            let client = clients[i]
            await handleReports(i, client, limit, latest_broadcast)
        }
    }
}

export async function handleReports(i: number, client: {
    client_id: string;
    client: Client;
}, limit: number, broadcast: IBroadcast) {
    let is_random = broadcast.is_random_template
    let templates = broadcast.templates
    let timeinsec = 5000
    let tmpreports = await Lead.find({ stage: { $ne: 'useless' }, is_sent: false }).sort('-created_at').skip((i + 1 - 1) * limit).limit(limit)
    for (let j = 0; j < tmpreports.length; j++) {
        let timeout = setTimeout(async () => {
            let latest_broadcast = await Broadcast.findById(broadcast._id).populate('templates').populate('connected_users')
            if (latest_broadcast && latest_broadcast?.is_active && !latest_broadcast?.is_paused) {
                //report1
                let mobile = "91" + String(tmpreports[j].mobile) + "@c.us"
                console.log("Sending to", mobile, "from", client.client_id)
                await sendTemplates(client.client, mobile, templates, is_random, broadcast)
                tmpreports[j].last_whatsapp = new Date()
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
}

export async function sendTemplates(client: Client, mobile: string, templates: IMessageTemplate[], is_random: boolean, broadcast: IBroadcast) {
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
            await client.sendMessage(mobile, await MessageMedia.fromUrl(url, { filename: filename, unsafeMime: true }))
        }
    }
    if (url && caption) {
        await client.sendMessage(mobile, (await MessageMedia.fromUrl(url, { filename: filename, unsafeMime: true })), { caption: caption })
    }
    if (latest_broadcast) {
        latest_broadcast.counter = latest_broadcast.counter + 1
        await latest_broadcast.save()
    }
}