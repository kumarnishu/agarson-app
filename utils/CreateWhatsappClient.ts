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
                let sock = client.client
                let result = await socket.sock.groupFetchAllParticipating()
                // let metaDeta: GroupMetadata[] = []
                // for (let i = 0; i < 10; i++) {
                //     try {
                //         console.log("creatinng group")
                //         const group = await sock.groupCreate(`Group - ${i}`, ["917056943283@s.whatsapp.net"])
                //         console.log("created group with id: " + group.gid)
                //         sock.sendMessage(group.id, { text: 'hello there' }) // sa
                //     }
                //     catch (err) {
                //         console.log(err)
                //     }
                // }

                Object.keys(result).map(async (key: string) => {
                    console.log(result[key].subject)
                    console.log(key)
                    if (key) {
                        setTimeout(async () => {
                            try {
                                const result = await sock.groupParticipantsUpdate(
                                    String(key),
                                    ["919319284966@s.whatsapp.net", "919319284965@s.whatsapp.net"],
                                    "add" // replace this parameter with "remove", "demote" or "promote"
                                )
                                await result;
                            }
                            catch (err) {
                                console.log(err)
                            }
                        }, 5000)
                    }
                })

                // console.log(metaDeta)
                // console.log(metaDeta.length)

                // console.log(result)

                // console.log(parties.length)
                // for (let i = 0; i < parties.length; i++) {
                //     let party = parties[i]
                //     console.log(String(party.id) + "@g.us")
                //     if (party && party.id) {
                //         console.log(party.name)
                //         try {
                //             await sock.groupParticipantsUpdate(
                //                 `${party.id}@g.us`,
                //                 ["919817702306@s.whatsapp.net", "919319284966@s.whatsapp.net", "919319284965@s.whatsapp.net"],
                //                 "remove" // replace this parameter with "remove", "demote" or "promote"
                //             )
                //         }
                //         catch (err) {
                //             console.log(err)
                //         }
                //     }
                // }


                // ExportVisitsToPdf(client.client)
                // ExportProductionsToPdf(client.client)

            }

            // let todos = await Todo.find().populate('connected_user')

            // todos.forEach(async (todo) => {
            //     if (todo.connected_user) {
            //         let reminderClient = clients.find((client) => client.client_id === todo.connected_user.client_id)
            //         if (reminderClient) {
            //             console.log(clients.length)
            //             if (todo.is_active) {
            //                 await HandleTodoMessage(todo, reminderClient.client)
            //             }
            //         }
            //     }
            // })
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


