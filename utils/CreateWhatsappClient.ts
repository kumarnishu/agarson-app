import { Server } from "socket.io";
import fs from "fs"
import { User } from "../models/users/user.model";
import { ExportVisitsToPdf } from "./ExportVisitsToPdf";
import Lead from "../models/leads/lead.model";
import { Todo } from "../models/todos/todo.model";
import { HandleTodoMessage } from "./handleTodo";
import { ExportProductionsToPdf } from "./ExportProductionReports";
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
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ],
            // browserURL:'C:/Program Files/Google/Chrome/Application'
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
            }

            if (!clients.find((client) => client.client_id === client_id))
                clients.push({ client_id: client_id, client: client })

            // /retry functions
            if (client.info && client.info.wid) {
                if (user && client?.info.wid._serialized === process.env.WAGREETING_PHONE) {
                    if (client) {
                        ExportVisitsToPdf(client)
                        ExportProductionsToPdf(client)
                    }

                    let todos = await Todo.find().populate('connected_user')

                    todos.forEach(async (todo) => {
                        if (todo.connected_user) {
                            let reminderClient = clients.find((client) => client.client_id === todo.connected_user.client_id)
                            if (reminderClient) {
                                console.log(clients.length)
                                if (todo.is_active) {
                                    await HandleTodoMessage(todo, reminderClient.client)
                                }
                            }
                        }
                    })
                }
            }
        }
        console.log("session revived for", client.info)
    })
    client.on('disconnected', async (reason) => {
        console.log("reason", reason)
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



