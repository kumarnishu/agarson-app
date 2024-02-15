import makeWASocket, { GroupMetadata, fetchLatestBaileysVersion, makeInMemoryStore, useMultiFileAuthState } from "@whiskeysockets/baileys"
import { Server } from "socket.io";
import fs from "fs"
import { User } from "../models/users/user.model";
import { ExportVisitsToPdf } from "./ExportVisitsToPdf";
import Lead from "../models/leads/lead.model";
import { Todo } from "../models/todos/todo.model";
import { HandleTodoMessage } from "./handleTodo";
import { ExportProductionsToPdf } from "./ExportProductionReports";
import NodeCache from 'node-cache'
// import { parties } from "./db2"

export var clients: { client_id: string, client: any }[] = []

const msgRetryCounterCache = new NodeCache()
const store = makeInMemoryStore({})
store?.readFromFile('./baileys_store_multi.json')

setInterval(() => {
    store?.writeToFile('./baileys_store_multi.json')
}, 10_000)


async function createSocket(session_folder: string) {
    const { version, isLatest } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState('sockets/' + session_folder)
    const sock = makeWASocket({ version, auth: state, msgRetryCounterCache, generateHighQualityLinkPreview: true, })
    console.log("version", version, isLatest)
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
            if (client) {
                console.log("handling groups")
                let sock = client.client
                let result = await socket.sock.groupFetchAllParticipating()
                let metaDeta: GroupMetadata[] = []
                let keys: string[] = []
                Object.keys(result).map(async (key: string) => {
                    metaDeta.push(result[key])
                })
                console.log("total groups", metaDeta.length)
                let groups: string[] = []
                metaDeta = metaDeta.filter((group) => {
                    if (group.participants.find((part) => part.id === "919817702307@s.whatsapp.net"))
                    // if (group.owner !== "919313940410@s.whatsapp.net")
                    {

                        return group
                    }
                    else {
                        groups.push(group.subject)
                    }
                })
                console.log(metaDeta.length)
                fs.writeFileSync("./notaddedInGroupName.txt", JSON.stringify(groups, null, 2), 'utf8')
                console.log(metaDeta[2])
                console.log("already added in groups 919319284966@s.whatsapp.net", metaDeta.length)
                // const res = await Add(metaDeta, socket.sock)
                console.log("added in groups 919319284966@s.whatsapp.net", metaDeta.length)
            }
        }
    })

    // save creds
    socket.sock.ev.on("creds.update", async () => {
        socket.saveCreds()
    })

    socket.sock.ev.on('messages.upsert', (data) => {
        data.messages.map(async (msg) => {
            // console.log(msg)
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
        if (fs.existsSync(`./sockets/${client_id}`)) {
            fs.rmdirSync(`./sockets/${client_id}`, { recursive: true })
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


async function Add(metaDeta: GroupMetadata[], sock: any) {
    for (let i = 0; i < metaDeta.length; i++) {
        try {
            const result = await sock.groupParticipantsUpdate(
                metaDeta[i].id,
                [`919319284966@s.whatsapp.net`],
                "add")
            await result;
            console.log("index", i)
        }
        catch (err) {
            // console.log(key)
            // result[key].subject
            console.log(err)
        }
    }
}