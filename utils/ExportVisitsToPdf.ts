import { IVisit } from "../types/visit.types"
import { Visit } from "../models/visit/visit.model"
import PdfPrinter from "pdfmake"
import path from "path"
import { Content } from "pdfmake/interfaces"
import { imageUrlToBase64 } from "./UrlToBase64"
import fs from "fs"
import { User } from "../models/users/user.model"
import { Client, MessageMedia } from "whatsapp-web.js"

export async function HandleVisitsReport(client: Client, dt1: Date, dt2: Date) {
    let visits: IVisit[] = []
    console.log("generating pdf")
    visits = await Visit.find({ created_at: { $gte: dt1, $lt: dt2 } }).populate("visit_reports").populate('created_by')
    var printer = new PdfPrinter({
        Roboto: {
            normal: path.resolve('fonts', 'Roboto-Regular.ttf'),
            bold: path.resolve('fonts', 'Roboto-Bold.ttf'),
        }
    })
    let Content: Content[] = []

    let username = ""
    for (let i = 0; i < visits.length; i++) {
        if (visits[i] && visits[i].visit_reports.length > 0) {
            username = visits[i].created_by.username
            Content.push({ text: `Daily Visit Reports : ${new Date(dt1).toLocaleDateString()}`, style: { 'alignment': 'center', fontSize: 24 } });

            if (visits[i].start_day_credientials) {
                let startday_photo = await imageUrlToBase64(visits[i].start_day_photo?.public_url || "").then((response) => {
                    return response
                })
                if (startday_photo) {
                    Content.push(
                        {
                            text: `${visits[i].created_by.username}\n\n`,
                            style: { 'alignment': 'center', fontSize: 22 },

                        }
                    ),
                        Content.push(
                            {
                                alignment: 'center',
                                stack: [
                                    {
                                        image: startday_photo,
                                        width: 500,
                                        height: 500,
                                    },
                                    "\n",
                                    { text: `Start Day\n`, style: { 'alignment': 'center', fontSize: 20 } },
                                    {
                                        text: `${new Date(visits[i].start_day_credientials.timestamp).toLocaleTimeString()}`,
                                        style: { 'alignment': 'center', fontSize: 20 },

                                    },

                                    {
                                        text: `${visits[i].start_day_credientials.address}\n`,
                                        style: { 'alignment': 'center', fontSize: 20 },

                                    },
                                ]
                            }
                        )
                }
            }
            for (let j = 0; j < visits[i].visit_reports.length; j++) {
                let report = visits[i].visit_reports[j]
                let visitInPhoto = await imageUrlToBase64(report.visit_in_photo?.public_url || "").then((response) => {
                    return response
                })
                let uploadsamplesPhoto = await imageUrlToBase64(report.visit_samples_photo?.public_url || "").then((response) => {
                    return response
                })

                if (visitInPhoto) {
                    Content.push(
                        {
                            alignment: 'center',
                            stack: [
                                {
                                    image: visitInPhoto,
                                    width: 500,
                                    height: 500,
                                },
                                "\n\n",
                                { text: `${report.party_name}\n`, style: { 'alignment': 'center', fontSize: 22, bold: true } },
                                {
                                    text: `In : ${new Date(report.visit_in_credientials.timestamp).toLocaleTimeString()} ,  Out : ${new Date(report.visit_out_credentials.timestamp).toLocaleTimeString()}`,
                                    style: { 'alignment': 'center', fontSize: 20 },

                                },

                                {
                                    text: ` ${report.visit_in_credientials.address}`,
                                    style: { 'alignment': 'center', fontSize: 20 },

                                }
                            ]
                        }
                    )

                }

                if (uploadsamplesPhoto) {
                    Content.push(
                        {
                            alignment: 'center',
                            stack: [
                                {
                                    image: uploadsamplesPhoto,
                                    width: 500,
                                    height: 500,
                                },
                                "\n\n",
                                { text: `Work Summary\n\n`, style: { 'alignment': 'center', fontSize: 20 } }
                                ,

                                {
                                    text: `${report.visit_in_credientials.address}`,
                                    style: { 'alignment': 'center', fontSize: 20 },

                                },
                                "\n",
                                {
                                    text: `${report.summary || ""}`,
                                    style: { 'alignment': 'center', fontSize: 20 },

                                }
                            ]
                        }
                    )


                }
            }
            if (visits[i].end_day_credentials) {
                let enddayPhoto = await imageUrlToBase64(visits[i].end_day_photo?.public_url || "").then((response) => {
                    return response
                })

                if (enddayPhoto) {
                    Content.push(
                        {
                            alignment: 'center',
                            stack: [
                                {
                                    image: enddayPhoto,
                                    width: 500,
                                    height: 500,
                                },

                                { text: `\nEnd Day\n\n`, style: { 'alignment': 'center', fontSize: 22 } },
                                {
                                    text: `${new Date(visits[i].end_day_credentials.timestamp).toLocaleTimeString()}`,
                                    style: { 'alignment': 'center', fontSize: 20 },

                                },

                                {
                                    text: `${visits[i].end_day_credentials.address}`,
                                    style: { 'alignment': 'center', fontSize: 20 },

                                },
                            ]
                        }
                    )
                }
            }
            const doc = printer.createPdfKitDocument({
                info: {
                    title: 'Visit Reports',
                    author: 'Agarson',
                    subject: 'Visit Reports',
                },
                content: Content,
                defaultStyle: {
                    fontSize: 20,
                    font: 'Roboto',
                    lineHeight: 1.2,
                }
            })
            doc.pipe(fs.createWriteStream(`./pdfs/visit/${username}_visits.pdf`))
            Content = []
            doc.end()
        }
    } ''
    setTimeout(async () => {
        try { await SendDocument(client) }
        catch (err) {
            console.log(err)
        }
    }, 30000)

    setTimeout(async () => {
        await DeleteDocument()
    }, 600000)
}

async function SendDocument(client: Client) {
    if (client) {
        console.log("sending pdf from", process.env.WAGREETING_PHONE)
        let users = await User.find()
        users.forEach(async (user) => {
            if (!user.visit_access_fields.is_hidden && fs.existsSync(`./pdfs/visit/${user.username}_visits.pdf`)) {
                await client.sendMessage(String(process.env.WAGREETING_PHONE), MessageMedia.fromFilePath(`./pdfs/visit/${user.username}_visits.pdf`), { caption: "" })
            }
        })
    }
}

async function DeleteDocument() {
    let users = await User.find()
    users.forEach(async (user) => {
        if (!user.visit_access_fields.is_hidden && fs.existsSync(`./pdfs/visit/${user.username}_visits.pdf`)) {
            console.log(`deleting pdf from${`./pdfs/visit/${user.username}_visits.pdf`}`)
            if (fs.existsSync(`./pdfs/visit/${user.username}_visits.pdf`)) {
                fs.rmSync(`./pdfs/visit/${user.username}_visits.pdf`)
            }
        }
    })
}