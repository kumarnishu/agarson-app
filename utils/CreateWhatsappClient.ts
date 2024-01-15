import makeWASocket, { makeInMemoryStore, useMultiFileAuthState } from "@whiskeysockets/baileys"
import { Server } from "socket.io";
import fs from "fs"
import { User } from "../models/users/user.model";

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
        console.log(update)
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
                else if (msg === "Stream Errored (conflict)") {
                    io.to(client_id).emit("disconnected_whatsapp");
                    clients = clients.filter((client) => { return client.client_id === client_id })
                    let user = await User.findOne({ client_id: client_id })
                    if (user) {
                        await User.findByIdAndUpdate(user._id, {
                            connected_number: undefined
                        })
                    }
                }
                else if (msg === "Stream Errored (restart required)") {
                    io.to(client_id).emit("loading");
                    if (clients.find((c) => c.client_id === client_id))
                        createWhatsappClient(client_id, io)
                    createWhatsappClient(client_id, io)
                }
                else {
                    console.log("retrying connection")
                }
            }
            if (!clients.find((c) => c.client_id === client_id))
                createWhatsappClient(client_id, io)
        }
        if (qr) {
            io.to(client_id).emit("qr", qr);
            clients = clients.filter((client) => { return client.client_id === client_id })
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
            clients.push({ client_id: client_id, client: socket.sock })
        }
    })

    // save creds
    socket.sock.ev.on("creds.update", async () => {
        socket.saveCreds()
    })
}


async function DeleteLocalSession(client_id: string) {
    try {
        if (fs.existsSync(`./sessions/${client_id}`)) {
            fs.rmdirSync(`./sessions/${client_id}`, { recursive: true })
        }
        clients = clients.filter((client) => { return client.client_id === client_id })
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


