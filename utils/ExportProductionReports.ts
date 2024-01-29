import PdfPrinter from "pdfmake"
import path from "path"
import { Content } from "pdfmake/interfaces"
import fs from "fs"
import { User } from "../models/users/user.model"
import { ReportManager } from "../app"
import { IProduction } from "../types/production.types"
import { Production } from "../models/production/production.model"
import moment from "moment"

export async function ExportProductionsToPdf(client: any) {
    let cronString1 = `1-59/1 * * * *`
    console.log("running production trigger")
    if (!ReportManager.exists("production_reports1"))
        ReportManager.add("production_reports1", cronString1, async () => {
            await HandleProductionReports(client)
        })

    if (ReportManager.exists("production_reports1")) {
        ReportManager.start("production_reports1")
    }
}

export async function HandleProductionReports(client: any) {
    console.log("generating pdf")

    var printer = new PdfPrinter({
        Roboto: {
            normal: path.resolve('fonts', 'Roboto-Regular.ttf'),
            bold: path.resolve('fonts', 'Roboto-Bold.ttf'),
        }
    })
    let Content: Content[] = [
        { text: '', style: 'header' },
        {
            text: `TOTAL PRODUCTION BY THEKEDAR \n\n`,
            style: { 'alignment': 'center', fontSize: 14, bold: true },
        }
    ]
    let Table: string[][] = []

    // handle production by thekedar
    let productions: IProduction[] = []
    let users = await User.find().sort("username")
    users = users.filter((u) => {
        if (!u.productions_access_fields.is_hidden) {
            return u
        }
    })
    for (let i = 0; i < 1; i++) {
        let FirstlocArr = ["Date"]
        for (let k = 0; k < users.length; k++) {
            let user = users[k]
            FirstlocArr.push(String(user.username))
        }
        Table.push(FirstlocArr)
        for (let j = 0; j < 31; j++) {
            let locArr: string[] = []
            let dt1 = new Date()
            let dt2 = new Date()
            dt1.setDate(j + 1)
            dt2.setDate(j + 2)
            dt1.setHours(0)
            dt1.setMinutes(0)
            dt2.setHours(0)
            dt2.setMinutes(0)
            locArr.push(moment(dt1).format("DD/MM/YYYY"))
            for (let k = 0; k < users.length; k++) {
                let user = users[k]
                productions = await Production.find({ date: { $gte: dt1, $lt: dt2 }, thekedar: user._id })
                let result = productions.reduce((a, b) => { return Number(a) + Number(b.production) }, 0)
                locArr.push(String(result))
            }
            Table.push(locArr)
            locArr = []
        }
        let LastlocArr = ["Total"]
        for (let k = 0; k < users.length; k++) {
            let dt1 = new Date()
            let dt2 = new Date()
            dt1.setDate(1)
            dt2.setDate(31)
            dt1.setHours(0)
            dt1.setMinutes(0)
            dt2.setHours(0)
            dt2.setMinutes(0)
            let user = users[k]
            productions = await Production.find({ date: { $gte: dt1, $lt: dt2 }, thekedar: user._id })
            let result = productions.reduce((a, b) => { return Number(a) + Number(b.production) }, 0)
            LastlocArr.push(String(result))
        }
        Table.push(LastlocArr)
    }
    //hanlde production by machines
    //hanlde production by machine categories
    Content.push({
        table: {
            headerRows: 1,
            body: Table
        }
    })
    const doc = printer.createPdfKitDocument({
        info: {
            title: 'Production Reports',
            author: 'Agarson',
            subject: 'Production Reports',
        },
        content: Content,
        defaultStyle: {
            fontSize: 9,
            font: 'Roboto',
            lineHeight: 1,
        }
    })
    doc.pipe(fs.createWriteStream(`./pdfs/production/productions.pdf`))
    Content = []
    doc.end()

    setTimeout(async () => {
        await SendDocument(client)
    }, 30000)
}


async function SendDocument(client: any) {
    if (client) {
        console.log("sending pdf from", process.env.WAGREETING_PHONE)
        await client.sendMessage(String(process.env.WAGREETING_PHONE), {
            document: fs.readFileSync(`./pdfs/production/productions.pdf`)
        })
    }
}