import { Broadcast } from "../models/leads/broadcast.model";
import Lead from "../models/leads/lead.model";
import { IBroadcast } from "../types/crm.types";
import { IMessageTemplate } from "../types/template.types";
import { getRandomTemplate } from "./getRandomTemplate";

export var timeouts: { id: string, timeout: NodeJS.Timeout }[] = []

export async function handleBroadcast(broadcast: IBroadcast, clients: {
    client_id: string;
    client: any;
}[]) {
    let latest_broadcast = await Broadcast.findById(broadcast._id).populate('templates').populate('connected_users')
    if (latest_broadcast && latest_broadcast.connected_users) {
        let is_random = latest_broadcast?.is_random_template
        let templates = latest_broadcast?.templates
        let clientids: string[] = latest_broadcast.connected_users.map((id) => { return id.client_id })
        let timeinsec = 5000

        let newclients = clients.filter((client) => {
            if (clientids.includes(client.client_id))
                return client
        })
        console.log("no of clients", newclients.length)
        let count = await Lead.find({ stage: { $ne: 'useless' }, is_sent: false }).limit(latest_broadcast.daily_limit - latest_broadcast.counter).countDocuments()
        if (count === 0 && latest_broadcast.autoRefresh) {
            await Lead.updateMany({ is_sent: true }, { is_sent: false })
        }
        let limit = (latest_broadcast.daily_limit - latest_broadcast.counter) / newclients.length
        for (let i = 0; i < newclients.length; i++) {
            let client = newclients[i]
            let tmpreports = await Lead.find({ stage: { $ne: 'useless' }, is_sent: false }).sort('-created_at').skip((i + 1 - 1) * limit).limit(limit)
            for (let j = 0; j < tmpreports.length; j++) {
                let report = tmpreports[j]
                let timeout = setTimeout(async () => {
                    let latest_broadcast = await Broadcast.findById(broadcast._id).populate('templates').populate('connected_users')
                    if (latest_broadcast && latest_broadcast?.is_active && !latest_broadcast?.is_paused) {
                        let mobile = "91" + String(report.mobile) + "@s.whatsapp.net"
                        console.log("Sending to", mobile)
                        await sendTemplates(client.client, mobile, templates, is_random)
                        report.last_whatsapp = new Date()
                        report.is_sent = true
                        await report.save()
                        latest_broadcast.counter = latest_broadcast.counter + 1
                        latest_broadcast.updated_at = new Date()
                        await latest_broadcast.save()
                    }
                }, Number(timeinsec));
                timeouts.push({ id: broadcast._id, timeout: timeout })
                timeinsec = timeinsec + Number(broadcast.time_gap) * 1000 + Math.ceil(Math.random() * 4) * 1000
                console.log(timeinsec)
            }
        }
        const timeout = setTimeout(async () => {
            if (latest_broadcast) {
                latest_broadcast.is_active = false
                latest_broadcast.counter = 0
                await latest_broadcast.save()
            }
        }, timeinsec)
        timeouts.push({ id: broadcast._id, timeout: timeout })

    }
}


export async function sendTemplates(client: any, mobile: string, templates: IMessageTemplate[], is_random: boolean) {
    const template = getRandomTemplate(templates)
    let url = template?.template.media && template?.template.media?.public_url
    let caption = template?.template.caption
    let message = template?.template.message
    let mimetype = template?.template.media && template?.template.media?.content_type
    let filename = template?.template.media && template?.template.media?.filename
    if (message) {
        await client.sendMessage(mobile, {
            text: message
        })
    }

    if (url) {
        if (mimetype && mimetype.split("/")[0] === "image") {
            await client.sendMessage(mobile, {
                image: { url: url },
                fileName: String(Number(new Date())) + filename,
                caption: caption,
            })
        }
        if (mimetype && mimetype.split("/")[0] === "video") {
            await client.sendMessage(mobile, {
                video: { url: url },
                fileName: String(Number(new Date())) + filename,
                caption: caption,
            })
        }
        if (mimetype === "application/pdf") {
            await client.sendMessage(mobile, {
                document: { url: url },
                fileName: String(Number(new Date())) + filename,
                caption: caption,
            })
        }
    }
}