import PdfPrinter from "pdfmake"
import path from "path"
import { Content } from "pdfmake/interfaces"
import fs from "fs"
import { User } from "../models/users/user.model"
import { ReportManager } from "../app"
import { IProduction } from "../types/production.types"
import { Production } from "../models/production/production.model"
import { IUser } from "../types/user.types"

export async function handleProductionReport(client: { client_id: string, client: any }) {
    let cronString1 = `10 18 1/1 * *`
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

    if (ReportManager.exists("production_reports1")) {
        ReportManager.start("production_reports1")
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
    let productionByThekedar:{thekadar:IUser,date:Date,production:number}[]=[]
    
    const doc = printer.createPdfKitDocument({
        info: {
            title: 'Production Reports',
            author: 'Agarson',
            subject: 'Production Reports',
        },
        content: Content,
        defaultStyle: {
            fontSize: 20,
            font: 'Roboto',
            lineHeight: 1.2,
        }
    })
    doc.pipe(fs.createWriteStream(`./pdfs/production/productions.pdf`))
    Content = []
    doc.end()
}


async function ExportProductions(client: any) {
    if (client) {
        console.log("sending pdf from", process.env.WAGREETING_PHONE)
        let users = await User.find()
        users.forEach(async (user) => {
            if (!user.productions_access_fields.is_hidden && fs.existsSync(`./pdfs/production/productions.pdf`)) {
                await client.sendMessage(String(process.env.WAGREETING_PHONE), {
                    document: fs.readFileSync(`./pdfs/production/productions.pdf`),
                })
            }
        })
    }
}