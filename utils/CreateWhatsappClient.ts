import { Server } from "socket.io";
import { Client, LocalAuth, Message } from "whatsapp-web.js";
import { ControlMessage } from "./ControlMessage";
import { KeywordTracker } from "../models/bot/KeywordTracker";
import { MenuTracker } from "../models/bot/MenuTracker";
const fs = require("fs")
import cron from "cron";
import { User } from "../models/users/user.model";
import Lead from "../models/leads/lead.model";
import { BroadcastReport } from "../models/broadcast/broadcast.report.model";
import { BroadCastWithMessage, BroadCastWithTemplates } from "./HandleBroadcast";
import { Broadcast } from "../models/broadcast/broadcast.model";
import { ReminderWithMessage, ReminderWithTemplates } from "./HandleReminder";
import { Reminder } from "../models/reminder/reminder.model";
import { ContactReport } from "../models/contact/contact.report.model";
import { Contact } from "../models/contact/contact.model";
import { ReminderManager } from "../app";
import { Chat } from "../models/bot/chat.model";
import { Greeting } from "../models/greetings/greeting.model";
import { SendGreetingTemplates } from "./sendGreetingMessage";

export var clients: { client_id: string, client: Client }[] = []
export let users: { id: string }[] = []

export function userJoin(id: string) {
    let user = { id }
    users.push(user)
    return user
}

export function getCurrentUser(id: string) {
    return users.find(user => user.id === id)
}

export function userLeave(id: string) {
    const index = users.findIndex(user => user.id === id)
    if (index !== -1)
        return users.splice(index, 1)[0]
}


export async function createWhatsappClient(client_id: string, client_data_path: string, io: Server) {
    console.log("getting session")
    let oldClient = clients.find((client) => client.client_id === client_id)
    if (oldClient) {
        oldClient.client.destroy()
        clients = clients.filter(c => { return c.client_id !== client_id })
    }

    let client = new Client({
        authStrategy: new LocalAuth({
            clientId: client_id,
            dataPath: `./.browsers/${client_data_path}`
        }),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        },
        qrMaxRetries: 1
    });

    client.on("ready", async () => {
        if (client.info.wid.user) {
            io.to(client_id).emit("ready", client.info.wid.user)
            let user = await User.findOne({ client_id: client_id })
            if (user) {
                await User.findByIdAndUpdate(user._id, {
                    is_whatsapp_active: true,
                    connected_number: client?.info.wid._serialized
                })
            }

            if (!clients.find((client) => client.client_id === client_id))
                clients.push({ client_id: client_id, client: client })

            // /retry functions
            if (client.info && client.info.wid) {
                if (user && client?.info.wid._serialized === process.env.WAGREETING_PHONE)
                    await SendGreetingTemplates(client, user)

                let broadcasts = await Broadcast.find({ connected_number: client?.info.wid._serialized })
                broadcasts.forEach(async (br) => {
                    let sentMessage = false
                    if (br.message)
                        sentMessage = true
                    if (br.templates && br.templates.length > 0)
                        sentMessage = false
                    if (sentMessage) {
                        if (user && br.is_active)
                            await BroadCastWithMessage(br, client, user, true)
                    }
                    else {
                        if (user && br.is_active)
                            await BroadCastWithTemplates(br, client, user, true)
                    }
                })
                let todos = await Reminder.find({ connected_number: client?.info.wid._serialized })
                todos.forEach(async (td) => {
                    let sentMessage = false
                    if (td.message)
                        sentMessage = true
                    if (td.templates && td.templates.length > 0)
                        sentMessage = false
                    if (sentMessage) {
                        if (user && td.is_active)
                            await ReminderWithMessage(td, client, user)
                    }
                    else {
                        if (user && td.is_active)
                            await ReminderWithTemplates(td, client, user)
                    }
                })
                let reminders = await Reminder.find({ connected_number: client?.info.wid._serialized })
                reminders.forEach(async (rs) => {
                    let sentMessage = false
                    if (rs.message)
                        sentMessage = true
                    if (rs.templates && rs.templates.length > 0)
                        sentMessage = false
                    if (sentMessage) {
                        if (user && rs.is_active)
                            await ReminderWithMessage(rs, client, user)
                    }
                    else {
                        if (user && rs.is_active)
                            await ReminderWithTemplates(rs, client, user)
                    }
                })
            }
        }
        console.log("session revived for", client.info)
    })
    try {
        client.on('disconnected', async (reason) => {
            console.log("reason", reason)
            io.to(client_id).emit("disconnected_whatsapp", client_id)
            let user = await User.findOne({ client_id: client_id })
            if (user) {
                await User.findByIdAndUpdate(user._id, {
                    is_whatsapp_active: false,
                    connected_number: null
                })
            }
            clients = clients.filter((client) => { return client.client_id === client_id })
            fs.rmSync(`.browsers/${client_id}`, { recursive: true, force: true })
            console.log("disconnected", client.info)
        })
    }
    catch (err) {
        console.log(err)
    }
    client.on('qr', async (qr) => {
        io.to(client_id).emit("qr", qr);
        clients = clients.filter((client) => { return client.client_id === client_id })
        console.log("logged out", qr, client_id)
    });

    client.on('loading_screen', async (qr) => {
        io.to(client_id).emit("loading");
        console.log("loading", client_id)
    });
    client.on('message', async (msg: Message) => {
        if (msg.to === process.env.WAPHONE) {
            let contact = await client.getContactById(msg.from)
            let authorName = ""
            if (msg.author) {
                let authorContact = await client.getContactById(msg.author)
                authorName = authorContact.verifiedName || authorContact.name || ""
            }
            await new Chat({
                name: contact.verifiedName || contact.name,
                isGroup: Boolean(msg.author),
                connected_number: msg.to,
                from: msg.from.replace("@g.us", "").replace("@c.us", ""),
                author: msg.author && String(msg.author).replace("@g.us", "").replace("@c.us", ""),
                body: msg.body,
                authorName: authorName,
                hasMedia: Boolean(msg.hasMedia),
                timestamp: new Date(Number(msg.timestamp) * 1000),
                created_at: new Date()
            }).save()
        }
        let messages = msg.body.split("-")
        if (messages.length === 2) {
            if (messages[0] === "STOP") {
                let reminder = await Reminder.findOne({ serial_number: messages[1] })
                let contact = await Contact.findOne({ mobile: msg.from })
                let report = await ContactReport.findOne({ contact: contact, reminder: reminder })
                if (reminder && report) {
                    report.reminder_status = "done"
                    await report.save()
                    if (msg.from !== msg.to)
                        client.sendMessage(msg.from, "successfully stopped this todo for you")
                    let reports = await ContactReport.find({ reminder: reminder })
                    let done = false
                    reports.forEach((report) => {
                        if (report.reminder_status === "done")
                            done = true
                        else
                            done = false
                    })
                    if (done) {
                        reminder.is_active = false
                        await reminder.save()
                        if (ReminderManager.exists(reminder.refresh_key))
                            ReminderManager.deleteJob(reminder.refresh_key)
                        if (ReminderManager.exists(reminder.running_key))
                            ReminderManager.deleteJob(reminder.running_key)
                    }

                }
            }
        }

        if (String(msg.body).toLowerCase() === "stop") {
            let lead = await Lead.findOne({ $or: [{ mobile: msg.from.replace("91", "").replace("@c.us", "") }, { alternate_mobile1: msg.from.replace("91", "").replace("@c.us", "") }] })
            if (!lead)
                lead = await Lead.findOne({ alternate_mobile2: msg.from.replace("91", "").replace("@c.us", "") })
            if (lead) {
                lead.stage = "useless"
                await lead.save()
            }
            let broadcasts = await Broadcast.find({ leads_selected: true })
            broadcasts.forEach(async (b) => {
                if (msg.from) {
                    let reports = await BroadcastReport.find({ broadcast: b, mobile: msg.from })
                    reports.forEach(async (r) => {
                        await r.remove()
                    })
                }
            })
            client.sendMessage(msg.from, "successfully stopped this broadcast")
        }
        else if (client) {
            await ControlMessage(client, msg)
        }
    });

    client.on("message_create", async (msg) => {
        let messages = msg.body.split("-")
        if (messages.length === 2) {
            if (messages[0] === "STOP") {
                let reminder = await Reminder.findOne({ serial_number: messages[1] })
                let contact = await Contact.findOne({ mobile: msg.from })
                let report = await ContactReport.findOne({ contact: contact, reminder: reminder })
                if (reminder && report) {
                    report.reminder_status = "done"
                    await report.save()
                    if (msg.from === msg.to)
                        client.sendMessage(msg.from, "successfully stopped this todo for you")


                    let reports = await ContactReport.find({ reminder: reminder })
                    let done = false
                    reports.forEach((report) => {
                        if (report.reminder_status === "done")
                            done = true
                        else
                            done = false
                    })
                    if (done) {
                        reminder.is_active = false
                        await reminder.save()
                        if (ReminderManager.exists(reminder.refresh_key))
                            ReminderManager.deleteJob(reminder.refresh_key)
                        if (ReminderManager.exists(reminder.running_key))
                            ReminderManager.deleteJob(reminder.running_key)
                    }

                }
            }
        }
    })

    client.on('message_ack', async (data) => {
        //@ts-ignore
        if (data.ack === 2 && data._data.self === "in") {
            await handleBot(data)
        }
    })
    await client.initialize();
}


async function handleBot(data: Message) {
    let trackers = await KeywordTracker.find({ phone_number: data.to, bot_number: data.from })
    let menuTrackers = await MenuTracker.find({ phone_number: data.to, bot_number: data.from })
    let createCronJob = false
    trackers.forEach(async (tracker) => {
        if (tracker.is_active) {
            createCronJob = true
            await KeywordTracker.findByIdAndUpdate(tracker._id, { is_active: false })
        }
    })
    menuTrackers.forEach(async (tracker) => {
        if (tracker.is_active) {
            createCronJob = true
            await MenuTracker.findByIdAndUpdate(tracker._id, { is_active: false })
        }
    })
    //cron job to restart
    if (createCronJob) {
        let time = new Date(new Date().getTime() + 5 * 60 * 60 * 1000)
        // let time = new Date(new Date().getTime() + 60 * 1000)
        new cron.CronJob(time, async () => {
            console.log('running cron job')
            trackers.forEach(async (tracker) => {
                await KeywordTracker.findByIdAndUpdate(tracker._id, { is_active: true })
            })
            menuTrackers.forEach(async (tracker) => {
                await MenuTracker.findByIdAndUpdate(tracker._id, { is_active: true })
            })
        }).start()
    }
}
