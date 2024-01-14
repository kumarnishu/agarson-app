import makeWASocket, { makeInMemoryStore, useMultiFileAuthState } from "@whiskeysockets/baileys"
import { Server } from "socket.io";
import { KeywordTracker } from "../models/bot/KeywordTracker";
import { MenuTracker } from "../models/bot/MenuTracker";
import fs from "fs"
import cron from "cron";


export var clients: { client_id: string, client: any }[] = []
export let users: { id: string }[] = []

const store = makeInMemoryStore({})
store?.readFromFile('./baileys_store_multi.json')

setInterval(() => {
    store?.writeToFile('./baileys_store_multi.json')
}, 10_000)


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

async function createSocket(session_folder: string) {
    const { state, saveCreds } = await useMultiFileAuthState('sessions/' + session_folder)
    const sock = makeWASocket({ auth: state, printQRInTerminal: true })
    return { sock, saveCreds }
}

export async function createWhatsappClient(client_id: string, io: Server) {
    const socket = await createSocket(client_id)
    store?.bind(socket.sock.ev)

    let oldClient = clients.find((client) => client.client_id === client_id)
    if (oldClient) {
        await RefreshSession(client_id)
        clients = clients.filter(c => { return c.client_id !== client_id })
    }

    // connection  updates
    socket.sock.ev.on('connection.update', async (update) => {
        console.log(update)
        const { connection, qr,legacy} = update
        if (connection === 'close') {
            if (fs.existsSync(`./sessions/${client_id}`))
                await RefreshSession(client_id)
            console.log("logged out")
        }
        if (qr) {
            io.to(client_id).emit("qr", qr);
            clients = clients.filter((client) => { return client.client_id === client_id })
            console.log("logged out")
        }
        if (connection === "connecting") {
            console.log("connecting")
            io.to(client_id).emit("loading");
        }
        if (connection === 'open') {
            if (connection) {
                io.to(client_id).emit("ready", client.info.wid.user)
                console.log("ready", client_id)
                let user = await User.findOne({ client_id: client_id })
                if (user) {
                    await User.findByIdAndUpdate(user._id, {
                        is_whatsapp_active: true,
                        connected_number: client?.info.wid._serialized
                    })
                }
        }
    })

}


async function handleBot(from: string, to: string) {
    let trackers = await KeywordTracker.find({ phone_number: to, bot_number: from })
    let menuTrackers = await MenuTracker.find({ phone_number: to, bot_number: from })
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
    if (createCronJob) {
        let time = new Date(new Date().getTime() + 5 * 60 * 60 * 1000)
        new cron.CronJob(time, async () => {
            trackers.forEach(async (tracker) => {
                await KeywordTracker.findByIdAndUpdate(tracker._id, { is_active: true })
            })
            menuTrackers.forEach(async (tracker) => {
                await MenuTracker.findByIdAndUpdate(tracker._id, { is_active: true })
            })
        }).start()
    }
}

async function RefreshSession(client_id: string) {
    fs.rmdirSync(`./sessions/${client_id}`, { recursive: true })
    console.log("deleted directory")
}