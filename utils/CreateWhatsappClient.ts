import { Server } from "socket.io";
import fs from "fs"
import { User } from "../models/users/user.model";
import { HandleVisitsReport } from "./ExportVisitsToPdf";
import Lead from "../models/leads/lead.model";
import { Todo } from "../models/todos/todo.model";
import { HandleDailyTodoTrigger, SendTodoMessage } from "./SendTodoMessage";
import { HandleProductionReports } from "./ExportProductionReports";
import { Client, LocalAuth, Message } from "whatsapp-web.js";

export var clients: { client_id: string, client: Client }[] = []


export async function createWhatsappClient(client_id: string, io: Server) {
    let oldClient = clients.find((client) => client.client_id === client_id)
    if (oldClient) {
        oldClient.client.destroy()
        clients = clients.filter(c => { return c.client_id !== client_id })
    }

    let client = new Client({
        authStrategy: new LocalAuth({
            clientId: client_id,
            dataPath: `./sessions/${client_id}`
        }),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ],
            executablePath: process.env.CHROME_PATH
        },
        qrMaxRetries: 2,
    });

    client.on("ready", async () => {
        if (client.info.wid.user) {
            io.to(client_id).emit("ready", client.info.wid.user)
            let user = await User.findOne({ client_id: client_id })
            if (user) {
                await User.findByIdAndUpdate(user._id, {
                    connected_number: client?.info.wid._serialized
                })
                await HandleDailyTodoTrigger(user)
            }

            if (!clients.find((client) => client.client_id === client_id))
                clients.push({ client_id: client_id, client: client })

            // /retry functions
            if (client.info && client.info.wid) {
                console.log("session revived for", client.info)
            }
        }
    })
    client.on('disconnected', async (reason) => {
        console.log("reason", reason)
        if (reason === "NAVIGATION") {
            io.to(client_id).emit("disconnected_whatsapp", client_id)
            let user = await User.findOne({ client_id: client_id })
            if (user) {
                await User.findByIdAndUpdate(user._id, {
                    connected_number: null
                })
            }
            clients = clients.filter((client) => { return client.client_id === client_id })
            if (fs.existsSync('./sessions/${client_id}'))
                fs.rmSync(`./sessions/${client_id}`, { recursive: true, force: true })
        }
        console.log("disconnected", client.info)
    })

    client.on('qr', async (qr) => {
        io.to(client_id).emit("qr", qr);
        clients = clients.filter((client) => { return client.client_id === client_id })
        let user = await User.findOne({ client_id: client_id })
        if (user) {
            await User.findByIdAndUpdate(user._id, {
                connected_number: undefined
            })
        }
        console.log("logged out", qr, client_id)
    });

    client.on('loading_screen', async (qr) => {
        io.to(client_id).emit("loading");
        console.log("loading", client_id)
    });
    client.on('message_create', async (msg) => {
        let dt1 = new Date()
        let dt2 = new Date()
        if (msg.body.toLowerCase() === "send boreports") {
            if (new Date().getHours() <= 11) {
                dt2.setDate(new Date(dt1).getDate())
                dt1.setDate(new Date(dt1).getDate() - 1)
                dt1.setHours(0)
                dt1.setMinutes(0)
                dt2.setHours(0)
                dt2.setMinutes(0)
                await client.sendMessage(String(process.env.WAGREETING_PHONE), "processing your morning reports..")
                await HandleVisitsReport(client, dt1, dt2)
                    .then(async () => {
                        await HandleProductionReports(client)
                    })
                    .then(async () => {
                        await client.sendMessage(String(process.env.WAGREETING_PHONE), "processed successfully")
                    }).catch(async () => await client.sendMessage(String(process.env.WAGREETING_PHONE), "error while processing morning reports "))

            }
            if (new Date().getHours() > 11) {
                dt1.setDate(new Date(dt1).getDate())
                dt2.setDate(new Date(dt1).getDate() + 1)
                dt1.setHours(0)
                dt1.setMinutes(0)
                dt2.setHours(0)
                dt2.setMinutes(0)
                await client.sendMessage(String(process.env.WAGREETING_PHONE), "processing your evening reports..")
                await HandleVisitsReport(client, dt1, dt2)
                    .then(async () => {
                        await HandleProductionReports(client)
                    })
                    .then(async () => {
                        await client.sendMessage(String(process.env.WAGREETING_PHONE), "processed successfully")
                    }).catch(async () => await client.sendMessage(String(process.env.WAGREETING_PHONE), "error while processing evening reports "))
            }
        }
    })

    client.on('message', async (msg: Message) => {
        if (String(msg.body).toLowerCase() === "stop") {
            let lead = await Lead.findOne({ $or: [{ mobile: msg.from.replace("91", "").replace("@c.us", "") }, { alternate_mobile1: msg.from.replace("91", "").replace("@c.us", "") }, { alternate_mobile2: msg.from.replace("91", "").replace("@c.us", "") }] })
            if (lead) {
                lead.stage = "useless"
                await lead.save()
                await client.sendMessage(msg.from, "successfully stopped this broadcast")
            }
        }
    });

    client.initialize();
}



