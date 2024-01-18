import makeWASocket, { makeInMemoryStore, useMultiFileAuthState } from "@whiskeysockets/baileys"
import { Server } from "socket.io";
import fs from "fs"
import { User } from "../models/users/user.model";
import { handleVisitReport } from "./ExportVisitsToPdf";
import Lead from "../models/leads/lead.model";

export var clients: { client_id: string, client: any }[] = []

const store = makeInMemoryStore({})
store?.readFromFile('./baileys_store_multi.json')

setInterval(() => {
    store?.writeToFile('./baileys_store_multi.json')
}, 10_000)


async function createSocket(session_folder: string) {
    const { state, saveCreds } = await useMultiFileAuthState('sessions/' + session_folder)
    const sock = makeWASocket({ auth: state })
    return { sock, saveCreds }
}

export async function createWhatsappClient(client_id: string, io: Server) {
    const socket = await createSocket(client_id)
    store?.bind(socket.sock.ev)


    // connection  updates
    socket.sock.ev.on('connection.update', async (update) => {
        const { connection, qr, lastDisconnect } = update
        if (connection === 'close') {
            if (lastDisconnect?.error) {
                let msg = lastDisconnect.error.message
                console.log(msg)
                if (msg === "Connection Failure") {
                    io.to(client_id).emit("disconnected_whatsapp");
                    await DeleteLocalSession(client_id)
                    await DeleteLocalSession(client_id)
                    createWhatsappClient(client_id, io)
                }
                else if (msg === "Connection Closed") {
                    io.to(client_id).emit("loading");
                    createWhatsappClient(client_id, io)
                }
                else if (msg === "Stream Errored (conflict)") {
                    io.to(client_id).emit("disconnected_whatsapp");
                    if (clients.find((c) => c.client_id === client_id)) {
                        clients = clients.filter((client) => { return client.client_id !== client_id })
                        let user = await User.findOne({ client_id: client_id })
                        if (user) {
                            await User.findByIdAndUpdate(user._id, {
                                connected_number: undefined
                            })
                        }
                    }
                }
                else if (msg === "Stream Errored (restart required)") {
                    io.to(client_id).emit("loading")
                    createWhatsappClient(client_id, io)
                }

            }
        }
        if (qr) {
            io.to(client_id).emit("qr", qr);
            clients = clients.filter((client) => { return client.client_id !== client_id })
            let user = await User.findOne({ client_id: client_id })
            if (user) {
                await User.findByIdAndUpdate(user._id, {
                    connected_number: undefined
                })
            }
        }
        if (connection === "connecting") {
            console.log("loading", client_id)
            io.to(client_id).emit("loading");
        }
        if (connection === 'open') {
            io.to(client_id).emit("ready", socket.sock.user?.id);
            console.log("ready", client_id)
            let user = await User.findOne({ client_id: client_id })
            if (user) {
                await User.findByIdAndUpdate(user._id, {
                    connected_number: socket.sock.user?.id
                })
            }
            clients = clients.filter((client) => { return client.client_id !== client_id })
            clients.push({ client_id: client_id, client: socket.sock })
            let client = clients.find((client) => client.client_id === process.env.WACLIENT_ID)
            if (client)
                handleVisitReport(client.client)
        }
    })

    // save creds
    socket.sock.ev.on("creds.update", async () => {
        socket.saveCreds()
    })

    socket.sock.ev.on('messages.upsert', (data) => {
        data.messages.map(async (msg) => {
            if (msg.message && msg.message.conversation) {
                if (String(msg.message?.conversation).toLowerCase() === "stop") {
                    if (msg.key.remoteJid) {
                        let id = String(msg.key.remoteJid).replace("91", "").replace("@s.whatsapp.net", "")
                        await Lead.findOneAndUpdate({ mobile: id }, { stage: 'useless' })
                        socket.sock.sendMessage(msg.key.remoteJid, { text: "you successfully stopped" })
                    }
                }
            }
        })
        socket.sock.ev.flush()
    })
}


async function DeleteLocalSession(client_id: string) {
    try {
        if (fs.existsSync(`./sessions/${client_id}`)) {
            fs.rmdirSync(`./sessions/${client_id}`, { recursive: true })
        }
        clients = clients.filter((client) => { return client.client_id !== client_id })
        let user = await User.findOne({ client_id: client_id })
        if (user) {
            await User.findByIdAndUpdate(user._id, {
                connected_number: undefined
            })
        }
        console.log("deleted directory")
    }
    catch (err) {
        console.log(err)
    }
}


