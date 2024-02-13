import { Server } from "socket.io";
import fs from "fs"
import { User } from "../models/users/user.model";
import { HandleVisitsReport } from "./ExportVisitsToPdf";
import Lead from "../models/leads/lead.model";
import { HandleDailyTodoTrigger } from "./SendTodoMessage";
import { HandleProductionReports } from "./ExportProductionReports";
import { Client, LocalAuth, Message } from "whatsapp-web.js";
import { CronJob } from "cron";
import { handleAllReports } from "./HandleReports";
import { Broadcast } from "../models/leads/broadcast.model";
import { handleBroadcast } from "./handleBroadcast";

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
            // /retry functions
            if (client.info && client.info.wid) {
                console.log("session revived for", client.info)
                let user = await User.findOne({ client_id: client_id })
                if (!clients.find((client) => client.client_id === client_id))
                    clients.push({ client_id: client_id, client: client })
                if (user) {
                    await User.findByIdAndUpdate(user._id, {
                        connected_number: client?.info.wid._serialized
                    })
                    await HandleDailyTodoTrigger(user)
                    new CronJob("0 0 1/1 * *", async () => {
                        if (user)
                            await HandleDailyTodoTrigger(user)
                    }).start()
                }
                if (client_id === process.env.WACLIENT_ID) {
                    console.log("running reports id")
                    //handle reports
                    new CronJob("8 18 1/1 * *", async () => {
                        await handleAllReports(client)
                    }).start()
                    new CronJob("0 9 1/1 * *", async () => {
                        await handleAllReports(client)
                    }).start()

                }
            }

            let broadcast = await Broadcast.findOne().populate('connected_users')
            if (broadcast && broadcast.is_active) {
                let clientids: string[] = broadcast.connected_users.map((user) => { return user.client_id })

                let newclients = clients.filter((client) => {
                    if (clientids.includes(client.client_id))
                        return client
                })
                if (clientids.length === newclients.length) {
                    if (new Date().getHours() > 9 && new Date().getHours() < 18)
                        await handleBroadcast(broadcast, newclients)
                    new CronJob("30 9 1/1 * *", async () => {
                        let broadcast = await Broadcast.findOne()
                        if (broadcast)
                            await handleBroadcast(broadcast, newclients)
                    }).start()
                }
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
        if (client && msg.body.toLowerCase() === "send boreports" && client_id === process.env.WACLIENT_ID) {
            if (new Date().getHours() <= 12) {
                dt2.setDate(new Date(dt1).getDate())
                dt1.setDate(new Date(dt1).getDate() - 1)
                dt1.setHours(0)
                dt1.setMinutes(0)
                dt2.setHours(0)
                dt2.setMinutes(0)
                await client.sendMessage(String(process.env.WAPHONE), "processing your morning reports..")
                await HandleVisitsReport(client, dt1, dt2)
                    .then(async () => {
                        await HandleProductionReports(client)
                    })
                    .then(async () => {
                        await client.sendMessage(String(process.env.WAPHONE), "processed successfully")
                    }).catch(async () => await client.sendMessage(String(process.env.WAPHONE), "error while processing morning reports "))

            }
            if (new Date().getHours() > 12) {
                dt1.setDate(new Date(dt1).getDate())
                dt2.setDate(new Date(dt1).getDate() + 1)
                dt1.setHours(0)
                dt1.setMinutes(0)
                dt2.setHours(0)
                dt2.setMinutes(0)
                await client.sendMessage(String(process.env.WAPHONE), "processing your evening reports..")
                await HandleVisitsReport(client, dt1, dt2)
                    .then(async () => {
                        await HandleProductionReports(client)
                    })
                    .then(async () => {
                        await client.sendMessage(String(process.env.WAPHONE), "processed successfully")
                    }).catch(async () => await client.sendMessage(String(process.env.WAPHONE), "error while processing evening reports "))
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



