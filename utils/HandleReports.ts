import { Client } from "whatsapp-web.js"
import { HandleProductionReports } from "./ExportProductionReports"
import { HandleVisitsReport } from "./ExportVisitsToPdf"


export async function handleAllReports(client: Client) {
    let dt1 = new Date()
    let dt2 = new Date()
    if (client) {
        if (new Date().getHours() <= 11) {
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
        if (new Date().getHours() > 11) {
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
}