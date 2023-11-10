import express, { NextFunction, Request, Response } from 'express';
import compression from "compression"
import { createServer } from "http"
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { MulterError } from 'multer';
import { connectDatabase } from './config/db';
import UserRoutes from "./routes/user.routes";
import LeadRoutes from "./routes/lead.routes";
import BotRoutes from "./routes/bot.routes";
import BroadCastRoutes from "./routes/brodcast.route";
import ContactRoutes from "./routes/contact.routes";
import ReminderRoutes from "./routes/reminder.route";
import WaTemplateRoutes from "./routes/watemplate.routes";
import AlpsRoutes from "./routes/alps.route";
import TaskRoutes from "./routes/task.routes";
import CronJobManager from "cron-job-manager";


import path from 'path';
import morgan from "morgan";
import { Server } from "socket.io";
import { createWhatsappClient, getCurrentUser, userJoin, userLeave } from "./utils/CreateWhatsappClient";
import { ReConnectWhatsapp } from './utils/RestartServices';
import { Storage } from '@google-cloud/storage';


const app = express()
const server = createServer(app)


//env setup
dotenv.config();
const PORT = Number(process.env.PORT) || 5000
const HOST = process.env.HOST || "http://localhost"
const ENV = process.env.NODE_ENV || "development"

app.use(express.json({ limit: '30mb' }))
app.use(cookieParser());
app.use(compression())

//logger
app.use(morgan('tiny'))



//mongodb database
connectDatabase();

let origin = ""
if (ENV === "development") {
    origin = "http://localhost:3000"
    let origin2 = "http://localhost:3001"
    app.use(cors({
        origin: [origin, origin2],
        credentials: true
    }))
}

if (ENV === "production") {
    if (process.env.ALPS_URL) {
        origin = process.env.ALPS_URL
        app.use(cors({
            origin: [origin],
            credentials: true
        }))
    }
}
let io: Server | undefined = undefined
io = new Server(server, {
    cors: {
        origin: origin,
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log("socket connected")
    socket.on('JoinRoom', async (id: string, path: string) => {
        console.log("running in room", id, path)
        const user = userJoin(id)
        socket.join(user.id)
        if (io)
            createWhatsappClient(id, path, io)
        socket.on("disconnect", (reason) => {
            let user = getCurrentUser(id)
            if (user)
                userLeave(user.id)
            console.log(`socket ${socket.id} disconnected due to ${reason}`);
        });
    })

});



//cloud storage setupu config

const storage = new Storage({
    projectId: process.env.projectId,
    credentials: {
        type: process.env.type,
        private_key: process.env.private_key,
        client_email: process.env.client_email,
        client_id: process.env.client_id,
        universe_domain: process.env.universe_domainv
    }
})

export const bucketName = String(process.env.bucketName)
export const bucket = storage.bucket(bucketName)


// restart jobs when restart server
if (ENV !== "development") {
    ReConnectWhatsapp()
}
else {
    ReConnectWhatsapp()
}

export const ReminderManager = new CronJobManager()
export const TODOManager = new CronJobManager()
export const BroadcastManager = new CronJobManager()

if (!BroadcastManager.exists('check_status')) {
    BroadcastManager.add("check_status", "15 * * * *", () => console.log("checked status of all jobs "))
    console.log("restarted all task cron jobs")
    // RestartTaskJobs()
}

//server routes
app.use("/api/v1", UserRoutes)
app.use("/api/v1", LeadRoutes)
app.use("/api/v1", BotRoutes)
app.use("/api/v1", WaTemplateRoutes)
app.use("/api/v1", BroadCastRoutes)
app.use("/api/v1", ReminderRoutes)
app.use("/api/v1", ContactRoutes)
app.use("/api/v1", AlpsRoutes)
app.use("/api/v1", TaskRoutes)



//react app handler
if (ENV === "production") {
    app.use(express.static(path.join(__dirname, "build")))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, "build/", "index.html"));
    })
}
else {
    app.use("*", (_req: Request, res: Response, _next: NextFunction) => {
        res.status(404).json({ message: "resource not found" })
    })
}
//error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    if (err instanceof MulterError)
        return res.status(400).json({ message: "please select required no of files and field names" })
    res.status(500).json({
        message: err.message || "unknown  error occured"
    })
})

//server setup
if (!PORT) {
    console.log("Server Port not specified in the environment")
    process.exit(1)
}
server.listen(PORT, () => {
    console.log(`running on ${HOST}:${PORT}`)
});

export {
    io
}
