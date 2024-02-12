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
import WaTemplateRoutes from "./routes/watemplate.routes";
import CheckListkRoutes from "./routes/checklist.routes";
import VisitRoutes from "./routes/visit.routes";
import ErpRoutes from "./routes/erp.routes";
import ProductionRoutes from "./routes/production.routes";
import TodoRoutes from "./routes/todo.routes";
import CronJobManager from "cron-job-manager";
import path from 'path';
import { Server } from "socket.io";
import { getCurrentUser, userJoin, userLeave } from "./utils/handleSocketUsers";
import { Storage } from '@google-cloud/storage';
import morgan from 'morgan';
import { clients, createWhatsappClient } from './utils/CreateWhatsappClient';
import { ReConnectWhatsapp } from './utils/RestartServices';
import { Broadcast } from './models/leads/broadcast.model';
import { handleBroadcast } from './utils/handleBroadcast';
import { CronJob } from 'cron';

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
app.use(morgan('common'))


//mongodb database
connectDatabase();

let origin = ""
if (ENV === "development") {
    origin = "http://localhost:3000"
    let origin2 = "http://localhost:8081"
    app.use(cors({
        origin: [origin, origin2],
        credentials: true
    }))
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
    socket.on('JoinRoom', async (id: string) => {
        console.log("running in room", id)
        const user = userJoin(id)
        socket.join(user.id)
        if (io)
            createWhatsappClient(id, io)
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


export const GreetingManager = new CronJobManager()
export const BroadcastManager = new CronJobManager()
export const ReportManager = new CronJobManager()

//server routes
app.use("/api/v1", UserRoutes)
app.use("/api/v1", LeadRoutes)
app.use("/api/v1", WaTemplateRoutes)
app.use("/api/v1", CheckListkRoutes)
app.use("/api/v1", VisitRoutes)
app.use("/api/v1", ErpRoutes)
app.use("/api/v1", ProductionRoutes)
app.use("/api/v1", TodoRoutes)


ReConnectWhatsapp()
setTimeout(async () => {
    console.log("handling broadcast retrying....")
    let broadcast = await Broadcast.findOne().populate('connected_users')
    if (broadcast && broadcast.is_active) {
        let clientids: string[] = broadcast.connected_users.map((user) => { return user.client_id })
        let newclients = clients.filter((client) => {
            if (clientids.includes(client.client_id))
                return client
        })
        if (new Date().getHours() > 9 && new Date().getHours() < 18)
            handleBroadcast(broadcast, newclients)
        new CronJob("30 9 1/1 * *", async () => {
            let broadcast = await Broadcast.findOne()
            if (broadcast)
                handleBroadcast(broadcast, newclients)
        }).start()
    }
}, 30000)

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
