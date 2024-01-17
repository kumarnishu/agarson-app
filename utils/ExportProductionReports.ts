import PdfPrinter from "pdfmake"
import path from "path"
import { Content } from "pdfmake/interfaces"
import { imageUrlToBase64 } from "./UrlToBase64"
import fs from "fs"
import { User } from "../models/users/user.model"
import { ReportManager } from "../app"
import { IProduction } from "../types/production.types"
import { Production } from "../models/production/production.model"


export async function handleProductionReport(client: { client_id: string, client: any }) {
    let cronString1 = `10 18 1/1 * *`
    let cronString2 = `55 8 1/1 * *`
    console.log("running trigger")
    if (!ReportManager.exists("production_reports1"))
        ReportManager.add("production_reports1", cronString1, async () => {
            let dt1 = new Date()
            let dt2 = new Date()
            dt2.setDate(new Date(dt1).getDate() + 1)
            dt1.setHours(0)
            dt1.setMinutes(0)
            dt2.setHours(0)
            dt2.setMinutes(0)
            await ExportProductionsToPdf(client, dt1, dt2)
        })
    if (!ReportManager.exists("production_reports2"))
        ReportManager.add("production_reports2", cronString2, async () => {
            let dt1 = new Date()
            let dt2 = new Date()
            dt1.setDate(new Date(dt1).getDate() - 1)
            dt1.setHours(0)
            dt1.setMinutes(0)
            dt2.setHours(0)
            dt2.setMinutes(0)
            await ExportProductionsToPdf(client, dt1, dt2)
        })
    if (ReportManager.exists("production_reports1")) {
        ReportManager.start("production_reports1")
    }
    if (ReportManager.exists("production_reports2")) {
        ReportManager.start("production_reports2")
    }
}
export async function ExportProductionsToPdf(client: any, dt1: Date, dt2: Date) {
    let productions: IProduction[] = []
    console.log("generating pdf")
    productions = await Production.find({ created_at: { $gte: dt1, $lt: dt2 } }).populate("production_reports").populate('created_by')
    var printer = new PdfPrinter({
        Roboto: {
            normal: path.resolve('fonts', 'Roboto-Regular.ttf'),
            bold: path.resolve('fonts', 'Roboto-Bold.ttf'),
        }
    })
    let Content: Content[] = []

    let username = ""
    // for (let i = 0; i < productions.length; i++) {
    //     if (productions[i] && productions[i].production_reports.length > 0) {
    //         username = productions[i].created_by.username
    //         Content.push({ text: `Daily Production Reports : ${new Date(dt1).toLocaleDateString()}`, style: { 'alignment': 'center', fontSize: 24 } });

    //         if (productions[i].start_day_credientials) {
    //             let startday_photo = await imageUrlToBase64(productions[i].start_day_photo?.public_url || "").then((response) => {
    //                 return response
    //             })
    //             if (startday_photo) {
    //                 Content.push(
    //                     {
    //                         text: `${productions[i].created_by.username}\n\n`,
    //                         style: { 'alignment': 'center', fontSize: 22 },

    //                     }
    //                 ),
    //                     Content.push(
    //                         {
    //                             alignment: 'center',
    //                             stack: [
    //                                 {
    //                                     image: startday_photo,
    //                                     width: 500,
    //                                     height: 500,
    //                                 },
    //                                 "\n",
    //                                 { text: `Start Day\n`, style: { 'alignment': 'center', fontSize: 20 } },
    //                                 {
    //                                     text: `${new Date(productions[i].start_day_credientials.timestamp).toLocaleTimeString()}`,
    //                                     style: { 'alignment': 'center', fontSize: 20 },

    //                                 },

    //                                 {
    //                                     text: `${productions[i].start_day_credientials.address}\n`,
    //                                     style: { 'alignment': 'center', fontSize: 20 },

    //                                 },
    //                             ]
    //                         }
    //                     )
    //             }
    //         }
    //         for (let j = 0; j < productions[i].production_reports.length; j++) {
    //             let report = productions[i].production_reports[j]
    //             let productionInPhoto = await imageUrlToBase64(report.production_in_photo?.public_url || "").then((response) => {
    //                 return response
    //             })
    //             let uploadsamplesPhoto = await imageUrlToBase64(report.production_samples_photo?.public_url || "").then((response) => {
    //                 return response
    //             })

    //             if (productionInPhoto) {
    //                 Content.push(
    //                     {
    //                         alignment: 'center',
    //                         stack: [
    //                             {
    //                                 image: productionInPhoto,
    //                                 width: 500,
    //                                 height: 500,
    //                             },
    //                             "\n\n",
    //                             { text: `${report.party_name}\n`, style: { 'alignment': 'center', fontSize: 22, bold: true } },
    //                             {
    //                                 text: `In : ${new Date(report.production_in_credientials.timestamp).toLocaleTimeString()} ,  Out : ${new Date(report.production_out_credentials.timestamp).toLocaleTimeString()}`,
    //                                 style: { 'alignment': 'center', fontSize: 20 },

    //                             },

    //                             {
    //                                 text: ` ${report.production_in_credientials.address}`,
    //                                 style: { 'alignment': 'center', fontSize: 20 },

    //                             }
    //                         ]
    //                     }
    //                 )

    //             }

    //             if (uploadsamplesPhoto) {
    //                 Content.push(
    //                     {
    //                         alignment: 'center',
    //                         stack: [
    //                             {
    //                                 image: uploadsamplesPhoto,
    //                                 width: 500,
    //                                 height: 500,
    //                             },
    //                             "\n\n",
    //                             { text: `Work Summary\n\n`, style: { 'alignment': 'center', fontSize: 20 } }
    //                             ,

    //                             {
    //                                 text: `${report.production_in_credientials.address}`,
    //                                 style: { 'alignment': 'center', fontSize: 20 },

    //                             },
    //                             "\n",
    //                             {
    //                                 text: `${report.summary || ""}`,
    //                                 style: { 'alignment': 'center', fontSize: 20 },

    //                             }
    //                         ]
    //                     }
    //                 )


    //             }
    //         }
    //         if (productions[i].end_day_credentials) {
    //             let enddayPhoto = await imageUrlToBase64(productions[i].end_day_photo?.public_url || "").then((response) => {
    //                 return response
    //             })

    //             if (enddayPhoto) {
    //                 Content.push(
    //                     {
    //                         alignment: 'center',
    //                         stack: [
    //                             {
    //                                 image: enddayPhoto,
    //                                 width: 500,
    //                                 height: 500,
    //                             },

    //                             { text: `\nEnd Day\n\n`, style: { 'alignment': 'center', fontSize: 22 } },
    //                             {
    //                                 text: `${new Date(productions[i].end_day_credentials.timestamp).toLocaleTimeString()}`,
    //                                 style: { 'alignment': 'center', fontSize: 20 },

    //                             },

    //                             {
    //                                 text: `${productions[i].end_day_credentials.address}`,
    //                                 style: { 'alignment': 'center', fontSize: 20 },

    //                             },
    //                         ]
    //                     }
    //                 )
    //             }
    //         }
    //         const doc = printer.createPdfKitDocument({
    //             info: {
    //                 title: 'Production Reports',
    //                 author: 'Agarson',
    //                 subject: 'Production Reports',
    //             },
    //             content: Content,
    //             defaultStyle: {
    //                 fontSize: 20,
    //                 font: 'Roboto',
    //                 lineHeight: 1.2,
    //             }
    //         })
    //         doc.pipe(fs.createWriteStream(`./pdfs/production/${username}_productions.pdf`))
    //         Content = []
    //         doc.end()
    //     }
    // }
    setTimeout(async () => {
        await ExportProductions(client)
    }, 300000)
}


async function ExportProductions(client: any) {
    if (client) {
        console.log("sending pdf from", process.env.WAGREETING_PHONE)
        let users = await User.find()
        users.forEach(async (user) => {
            // if (!user.production_access_fields.is_hidden && fs.existsSync(`./pdfs/production/${user.username}_productions.pdf`)) {
            //     await client.sendMessage(String(process.env.WAGREETING_PHONE), {
            //         document: fs.readFileSync(`./pdfs/production/${user.username}_productions.pdf`),
            //         fileName: `${user.username}_productions.pdf`,
            //     })
            // }
        })
    }
}