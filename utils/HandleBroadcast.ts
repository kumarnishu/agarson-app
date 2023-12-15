import { Client } from "whatsapp-web.js";
import { Broadcast } from "../models/broadcast/broadcast.model";
import { BroadcastReport } from "../models/broadcast/broadcast.report.model";
import { BroadcastManager } from "../app";
import cron from "cron"
import { sendMessage, sendTemplates } from "./SendMessage";
import { IBroadcast } from "../types/broadcast.types";
import { IUser } from "../types/user.types";

export var timeouts: { id: string, timeout: NodeJS.Timeout }[] = []

export async function BroadCastWithTemplates(broadcast: IBroadcast, client: Client, user: IUser, start_by_server?: boolean) {
    if (broadcast && client) {
        let daily_limit = broadcast.daily_limit
        if (start_by_server && daily_limit > 0) {
            let latest_broadcast = await Broadcast.findById(broadcast._id).populate('templates')
            if (latest_broadcast && latest_broadcast.is_active && !latest_broadcast.is_paused) {
                latest_broadcast.is_paused = false
                await latest_broadcast.save()
                let is_random = latest_broadcast?.is_random_template
                let templates = latest_broadcast?.templates
                let timegap = Number(latest_broadcast?.time_gap) * 1000 || 10000
                let timeinsec = 5000
                let reports = await BroadcastReport.find({ broadcast: latest_broadcast, status: "pending" }).sort('-created_at').limit(latest_broadcast.daily_limit - latest_broadcast.daily_count)
                if (reports.length > 0) {
                    for (let i = 0; i < reports.length; i++) {
                        let report = reports[i]
                        if (report?.status === "pending") {
                            const timeout = setTimeout(async () => {
                                if (latest_broadcast) {
                                    let mobile = report.mobile
                                    let customer_name = report.customer_name
                                    let is_buisness = report.is_buisness
                                    let response = await sendTemplates(client, mobile, timegap, templates, is_random)

                                    latest_broadcast.daily_count = latest_broadcast.daily_count + 1
                                    await latest_broadcast.save()
                                    if (response === "notwhatsapp") {
                                        report.status = "notwhatsapp"
                                        report.updated_at = new Date()
                                        await report.save()
                                    }
                                    if (response === "sent") {
                                        report.status = "sent"
                                        report.customer_name = customer_name
                                        report.is_buisness = Boolean(is_buisness)
                                        report.updated_at = new Date()

                                        await report.save()
                                    }
                                    if (response === "error") {
                                        report.status = "error"
                                        report.customer_name = customer_name
                                        report.is_buisness = Boolean(is_buisness)
                                        report.updated_at = new Date()
                                        await report.save()
                                    }
                                }

                            }, Number(timeinsec));
                            timeouts.push({ id: broadcast._id, timeout: timeout })
                            timeinsec = timeinsec + Number(broadcast.time_gap) * 1000 + Math.ceil(Math.random() * 3) * 1000
                            console.log(timeinsec)
                        }
                    }
                    const timeout = setTimeout(async () => {
                        if (latest_broadcast) {
                            latest_broadcast.is_paused = true
                            latest_broadcast.daily_count = 0
                            await latest_broadcast.save()
                        }
                    }, timeinsec)
                    timeouts.push({ id: broadcast._id, timeout: timeout })
                }
            }
            BroadCastWithTemplates(broadcast, client, user)
        }
        if (!start_by_server && daily_limit > 0) {
            BroadcastManager.add(broadcast.cron_key
                , broadcast.cron_string, async () => {
                    let latest_broadcast = await Broadcast.findById(broadcast._id).populate('templates')
                    if (latest_broadcast && latest_broadcast.is_active) {
                        latest_broadcast.is_paused = false
                        latest_broadcast.daily_count = 0
                        latest_broadcast.next_run_date = new Date(cron.sendAt(latest_broadcast.cron_string))
                        await latest_broadcast.save()
                        let is_random = latest_broadcast?.is_random_template
                        let templates = latest_broadcast?.templates
                        let timegap = Number(latest_broadcast?.time_gap) * 1000 || 10000
                        let timeinsec = 5000
                        let reports = await BroadcastReport.find({ broadcast: latest_broadcast, status: "pending" }).sort('-created_at').limit(daily_limit)
                        if (reports.length === 0 && latest_broadcast.autoRefresh) {
                            let dbreports = await BroadcastReport.find({ broadcast: latest_broadcast })
                            for (let i = 0; i < dbreports.length; i++) {
                                let report = dbreports[i]
                                if (user)
                                    if (report) {
                                        report.status = "pending"
                                        report.updated_at = new Date()
                                        report.updated_by = user
                                        await report.save()
                                    }
                            }
                            latest_broadcast.daily_count = 0
                            latest_broadcast.next_run_date = new Date(cron.sendAt(latest_broadcast.cron_string))
                            await latest_broadcast.save()
                            reports = await BroadcastReport.find({ broadcast: latest_broadcast, status: "pending" }).sort('-created_at').limit(daily_limit)
                        }
                        for (let i = 0; i < reports.length; i++) {
                            let report = reports[i]
                            if (report?.status === "pending") {
                                const timeout = setTimeout(async () => {
                                    if (latest_broadcast) {
                                        let mobile = report.mobile
                                        let customer_name = report.customer_name
                                        let is_buisness = report.is_buisness
                                        let response = await sendTemplates(client, mobile, timegap, templates, is_random)

                                        latest_broadcast.daily_count = latest_broadcast.daily_count + 1
                                        if (response === "notwhatsapp") {
                                            report.status = "notwhatsapp"
                                            report.updated_at = new Date()
                                            await report.save()
                                        }
                                        if (response === "sent") {
                                            report.status = "sent"
                                            report.customer_name = customer_name
                                            report.is_buisness = Boolean(is_buisness)
                                            report.updated_at = new Date()
                                            await report.save()
                                        }
                                        if (response === "error") {
                                            report.status = "error"
                                            report.customer_name = customer_name
                                            report.is_buisness = Boolean(is_buisness)
                                            report.updated_at = new Date()
                                            await report.save()
                                        }
                                        await latest_broadcast.save()
                                    }

                                }, Number(timeinsec));
                                timeouts.push({ id: broadcast._id, timeout: timeout })
                                timeinsec = timeinsec + Number(broadcast.time_gap) * 1000 + Math.ceil(Math.random() * 3) * 1000
                                console.log(timeinsec)
                            }
                        }
                        const timeout = setTimeout(async () => {
                            if (latest_broadcast) {
                                latest_broadcast.is_paused = true
                                await latest_broadcast.save()
                            }
                        }, timeinsec)
                        timeouts.push({ id: broadcast._id, timeout: timeout })
                    }
                })
            BroadcastManager.start(broadcast.cron_key)
        }
        if (!daily_limit || daily_limit <= 0) {
            let latest_broadcast = await Broadcast.findById(broadcast._id).populate('templates')
            if (latest_broadcast && latest_broadcast.is_active) {
                let is_random = latest_broadcast?.is_random_template
                let templates = latest_broadcast?.templates
                let timegap = Number(latest_broadcast?.time_gap) * 1000 || 10000
                let timeinsec = 5000
                let reports = await BroadcastReport.find({ broadcast: latest_broadcast, status: "pending" }).sort('-created_at')
                for (let i = 0; i < reports.length; i++) {
                    let report = reports[i]
                    if (report?.status === "pending") {
                        const timeout = setTimeout(async () => {
                            let mobile = report.mobile
                            let customer_name = report.customer_name
                            let is_buisness = report.is_buisness
                            let response = await sendTemplates(client, mobile, timegap, templates, is_random)

                            if (response === "notwhatsapp") {
                                report.status = "notwhatsapp"
                                report.updated_at = new Date()
                                await report.save()
                            }
                            if (response === "sent") {
                                report.status = "sent"
                                report.customer_name = customer_name
                                report.is_buisness = Boolean(is_buisness)
                                report.updated_at = new Date()
                                await report.save()
                            }
                            if (response === "error") {
                                report.status = "error"
                                report.customer_name = customer_name
                                report.is_buisness = Boolean(is_buisness)
                                report.updated_at = new Date()
                                await report.save()
                            }
                        }, Number(timeinsec));
                        timeouts.push({ id: broadcast._id, timeout: timeout })
                        timeinsec = timeinsec + Number(broadcast.time_gap) * 1000 + Math.ceil(Math.random() * 3) * 1000
                        console.log(timeinsec)
                    }
                }
                const timeout = setTimeout(async () => {
                    let next_reports = await BroadcastReport.find({ broadcast: latest_broadcast, status: "pending" }).sort('-created_at')
                    if (next_reports.length === 0 && latest_broadcast?.autoRefresh) {
                        let reports = await BroadcastReport.find({ broadcast: broadcast }).sort('-created_at')
                        reports.forEach(async (report) => {
                            if (user)
                                if (report) {
                                    report.status = "pending"
                                    report.updated_at = new Date()
                                    report.updated_by = user
                                    await report.save()
                                }
                        })

                        await BroadCastWithTemplates(latest_broadcast, client, user)
                    }
                    if (next_reports.length === 0 && !latest_broadcast?.autoRefresh)
                        await Broadcast.findByIdAndUpdate(latest_broadcast?._id, { is_active: false }).sort('-created_at')
                }, timeinsec)
                timeouts.push({ id: broadcast._id, timeout: timeout })
            }
        }
    }
}

export async function BroadCastWithMessage(broadcast: IBroadcast, client: Client, user: IUser, start_by_server?: boolean) {
    console.log("started broadcast with message")
    if (broadcast && client) {
        let daily_limit = Number(broadcast.daily_limit)
        if (start_by_server && daily_limit > 0) {
            let latest_broadcast = await Broadcast.findById(broadcast._id).populate('templates')
            if (latest_broadcast && latest_broadcast.is_active && !latest_broadcast.is_paused) {
                latest_broadcast.is_paused = false
                await latest_broadcast.save()

                let timegap = Number(latest_broadcast?.time_gap) * 1000 || 10000
                let timeinsec = 5000
                let reports = await BroadcastReport.find({ broadcast: latest_broadcast, status: "pending" }).sort('-created_at').limit(latest_broadcast.daily_limit - latest_broadcast.daily_count)
                if (reports.length > 0) {
                    for (let i = 0; i < reports.length; i++) {
                        let report = reports[i]
                        if (report?.status === "pending") {
                            const timeout = setTimeout(async () => {
                                if (latest_broadcast) {
                                    let mobile = report.mobile
                                    let message = latest_broadcast.message
                                    let customer_name = report.customer_name
                                    let is_buisness = report.is_buisness
                                    let response = await sendMessage(client, mobile, timegap, message)

                                    latest_broadcast.daily_count = latest_broadcast.daily_count + 1
                                    await latest_broadcast.save()
                                    if (response === "notwhatsapp") {
                                        report.status = "notwhatsapp"
                                        report.updated_at = new Date()
                                        await report.save()
                                    }
                                    if (response === "sent") {
                                        report.status = "sent"
                                        report.customer_name = customer_name
                                        report.is_buisness = Boolean(is_buisness)
                                        report.updated_at = new Date()

                                        await report.save()
                                    }
                                    if (response === "error") {
                                        report.status = "error"
                                        report.customer_name = customer_name
                                        report.is_buisness = Boolean(is_buisness)
                                        report.updated_at = new Date()
                                        await report.save()
                                    }
                                }

                            }, Number(timeinsec));
                            timeouts.push({ id: broadcast._id, timeout: timeout })
                            timeinsec = timeinsec + Number(broadcast.time_gap) * 1000 + Math.ceil(Math.random() * 3) * 1000
                            console.log(timeinsec)
                        }
                    }
                    const timeout = setTimeout(async () => {
                        if (latest_broadcast) {
                            latest_broadcast.is_paused = true
                            latest_broadcast.daily_count = 0
                            await latest_broadcast.save()
                        }
                    }, timeinsec)
                    timeouts.push({ id: broadcast._id, timeout: timeout })
                }
            }
            BroadCastWithMessage(broadcast, client, user)
        }
        if (!start_by_server && daily_limit > 0) {
            BroadcastManager.add(broadcast.cron_key
                , broadcast.cron_string, async () => {
                    let latest_broadcast = await Broadcast.findById(broadcast._id).populate('templates')
                    if (latest_broadcast && latest_broadcast.is_active) {
                        latest_broadcast.is_paused = false
                        latest_broadcast.next_run_date = new Date(cron.sendAt(latest_broadcast.cron_string))
                        await latest_broadcast.save()
                        let timegap = Number(latest_broadcast?.time_gap) * 1000 || 10000
                        let timeinsec = 5000
                        let reports = await BroadcastReport.find({ broadcast: latest_broadcast, status: "pending" }).sort('-created_at').limit(daily_limit)
                        if (reports.length === 0 && latest_broadcast.autoRefresh) {
                            let dbreports = await BroadcastReport.find({ broadcast: latest_broadcast })
                            for (let i = 0; i < dbreports.length; i++) {
                                let report = dbreports[i]
                                if (user)
                                    if (report) {
                                        report.status = "pending"
                                        report.updated_at = new Date()
                                        report.updated_by = user
                                        await report.save()
                                    }
                            }
                            latest_broadcast.daily_count = 0
                            latest_broadcast.next_run_date = new Date(cron.sendAt(latest_broadcast.cron_string))
                            await latest_broadcast.save()
                            reports = await BroadcastReport.find({ broadcast: latest_broadcast, status: "pending" }).sort('-created_at').limit(daily_limit)
                        }
                        for (let i = 0; i < reports.length; i++) {
                            let report = reports[i]
                            if (report?.status === "pending") {
                                const timeout = setTimeout(async () => {
                                    if (latest_broadcast) {
                                        let mobile = report.mobile
                                        let customer_name = report.customer_name
                                        let is_buisness = report.is_buisness
                                        let message = latest_broadcast.message
                                        let response = await sendMessage(client, mobile, timegap, message)

                                        latest_broadcast.daily_count = latest_broadcast.daily_count + 1
                                        if (response === "notwhatsapp") {
                                            report.status = "notwhatsapp"
                                            report.updated_at = new Date()
                                            await report.save()
                                        }
                                        if (response === "sent") {
                                            report.status = "sent"
                                            report.customer_name = customer_name
                                            report.is_buisness = Boolean(is_buisness)
                                            report.updated_at = new Date()
                                            await report.save()
                                        }
                                        if (response === "error") {
                                            report.status = "error"
                                            report.customer_name = customer_name
                                            report.is_buisness = Boolean(is_buisness)
                                            report.updated_at = new Date()
                                            await report.save()
                                        }
                                        await latest_broadcast.save()
                                    }

                                }, Number(timeinsec));
                                timeouts.push({ id: broadcast._id, timeout: timeout })
                                timeinsec = timeinsec + Number(broadcast.time_gap) * 1000 + Math.ceil(Math.random() * 3) * 1000
                                console.log(timeinsec)
                            }
                        }
                        const timeout = setTimeout(async () => {
                            if (latest_broadcast) {
                                latest_broadcast.is_paused = true
                                await latest_broadcast.save()
                            }
                        }, timeinsec)
                        timeouts.push({ id: broadcast._id, timeout: timeout })
                    }
                })
            BroadcastManager.start(broadcast.cron_key)
        }

        if (!daily_limit || daily_limit <= 0) {
            let latest_broadcast = await Broadcast.findById(broadcast._id).populate('templates')
            if (latest_broadcast && latest_broadcast.is_active) {
                let message = latest_broadcast.message
                let timegap = Number(latest_broadcast?.time_gap) * 1000 || 10000
                let timeinsec = 5000
                let reports = await BroadcastReport.find({ broadcast: latest_broadcast, status: "pending" }).sort('-created_at')
                for (let i = 0; i < reports.length; i++) {
                    let report = reports[i]
                    if (report?.status === "pending") {
                        const timeout = setTimeout(async () => {
                            let mobile = report.mobile
                            let customer_name = report.customer_name
                            let is_buisness = report.is_buisness
                            let response = await sendMessage(client, mobile, timegap, message)

                            if (response === "notwhatsapp") {
                                report.status = "notwhatsapp"
                                report.updated_at = new Date()
                                await report.save()
                            }
                            if (response === "sent") {
                                report.status = "sent"
                                report.customer_name = customer_name
                                report.is_buisness = Boolean(is_buisness)
                                report.updated_at = new Date()
                                await report.save()
                            }
                            if (response === "error") {
                                report.status = "error"
                                report.customer_name = customer_name
                                report.is_buisness = Boolean(is_buisness)
                                report.updated_at = new Date()
                                await report.save()
                            }
                        }, Number(timeinsec));
                        timeouts.push({ id: broadcast._id, timeout: timeout })
                        timeinsec = timeinsec + Number(broadcast.time_gap) * 1000 + Math.ceil(Math.random() * 3) * 1000
                        console.log(timeinsec)
                    }
                }
                const timeout = setTimeout(async () => {
                    let next_reports = await BroadcastReport.find({ broadcast: latest_broadcast, status: "pending" }).sort('-created_at')
                    if (next_reports.length === 0 && latest_broadcast?.autoRefresh) {
                        let reports = await BroadcastReport.find({ broadcast: broadcast }).sort('-created_at')
                        reports.forEach(async (report) => {
                            if (user)
                                if (report) {
                                    report.status = "pending"
                                    report.updated_at = new Date()
                                    report.updated_by = user
                                    await report.save()
                                }
                        })

                        await BroadCastWithMessage(latest_broadcast, client, user)
                    }
                    if (next_reports.length === 0 && !latest_broadcast?.autoRefresh)
                        await Broadcast.findByIdAndUpdate(latest_broadcast?._id, { is_active: false })
                }, timeinsec)
                timeouts.push({ id: broadcast._id, timeout: timeout })
            }
        }
    }
}



