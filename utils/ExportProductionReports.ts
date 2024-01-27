import PdfPrinter from "pdfmake"
import path from "path"
import { Content } from "pdfmake/interfaces"
import fs from "fs"
import { User } from "../models/users/user.model"
import { ReportManager } from "../app"
import { IProduction } from "../types/production.types"
import { Production } from "../models/production/production.model"

export async function handleProductionReport(client: any) {
    let cronString1 = `1-59/1 * * * *`
    console.log("running production trigger")
    if (!ReportManager.exists("production_reports1"))
        ReportManager.add("production_reports1", cronString1, async () => {
            await ExportThekdarWiseProductions(client)
        })

    if (ReportManager.exists("production_reports1")) {
        ReportManager.start("production_reports1")
    }
}

export async function ExportThekdarWiseProductions(client: any) {
    console.log("generating pdf")

    var printer = new PdfPrinter({
        Roboto: {
            normal: path.resolve('fonts', 'Roboto-Regular.ttf'),
            bold: path.resolve('fonts', 'Roboto-Bold.ttf'),
        }
    })
    let Content: Content[] = []
    let productions: IProduction[] = []
    let users = await User.find().sort("username")
    users = users.filter((u) => {
        if (!u.productions_access_fields.is_hidden) {
            return u
        }
    })
    let TableOutPut: any[] = []
    for (let i = 0; i < 31; i++) {
        let dt1 = new Date()
        let dt2 = new Date()
        dt1.setDate(i + 1)
        dt2.setDate(i + 2)
        dt1.setHours(0)
        dt1.setMinutes(0)
        dt2.setHours(0)
        dt2.setMinutes(0)
        let PsArray: number[][] = []
        for (let j = 0; j < users.length; j++) {
            let user = users[j]
            productions = await Production.find({ date: { $gte: dt1, $lt: dt2 }, thekedar: user._id })
            let result = productions.reduce((a, b) => { return Number(a) + Number(b.production) }, 0)
            PsArray[i][j] = result
        }
        TableOutPut.push(PsArray)
    }

    Content.push({
        table: {
            widths: ['*'],
            body: [TableOutPut]
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
        await ExportProductions(client)
    }, 10000)
}


async function ExportProductions(client: any) {
    if (client) {
        console.log("sending pdf from", process.env.WAGREETING_PHONE)
        await client.sendMessage(String(process.env.WAGREETING_PHONE), {
            document: fs.readFileSync(`./pdfs/production/productions.pdf`)
        })
    }
}