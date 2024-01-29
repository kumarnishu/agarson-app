import PdfPrinter from "pdfmake"
import path from "path"
import { Content } from "pdfmake/interfaces"
import fs from "fs"
import { User } from "../models/users/user.model"
import { ReportManager } from "../app"
import { IProduction } from "../types/production.types"
import { Production } from "../models/production/production.model"
import moment from "moment"
import { Machine } from "../models/production/machine.model"

export async function ExportProductionsToPdf(client: any) {
    let cronString1 = `00 18 16 1/1 * *`
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
        {
            text: `TOTAL PRODUCTION BY THEKEDAR \n\n`,
            pageOrientation: 'landscape',
            style: { 'alignment': 'center', fontSize: 14, bold: true },
        }
    ]
    let Table: string[][] = []
    let TableRow: string[] = []


    // handle production by thekedar
    let productions: IProduction[] = []
    let users = await User.find().sort("username")
    users = users.filter((u) => {
        if (!u.productions_access_fields.is_hidden && !u.productions_access_fields.is_editable) {
            return u
        }
    })
    //header 
    TableRow.push("DATE")
    for (let k = 0; k < users.length; k++) {
        let user = users[k]
        TableRow.push(String(user.username).toUpperCase())
    }
    Table.push(TableRow)

    //body
    TableRow = []
    for (let j = 0; j < 31; j++) {
        let dt1 = new Date()
        let dt2 = new Date()
        dt1.setDate(j + 1)
        dt2.setDate(j + 2)
        dt1.setHours(0)
        dt1.setMinutes(0)
        dt2.setHours(0)
        dt2.setMinutes(0)
        TableRow.push(moment(dt1).format("DD/MM/YYYY"))
        for (let k = 0; k < users.length; k++) {
            let user = users[k]
            productions = await Production.find({ date: { $gte: dt1, $lt: dt2 }, thekedar: user._id })
            let result = productions.reduce((a, b) => { return Number(a) + Number(b.production) }, 0)
            if (result === 0)
                TableRow.push('')
            else
                TableRow.push(String(result))
        }
        Table.push(TableRow)
        TableRow = []
    }
    //footer
    TableRow = ["TOTAL"]
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
        if (result === 0)
            TableRow.push('')
        else
            TableRow.push(String(result))
    }
    Table.push(TableRow)
    Content.push({
        table: {
            headerRows: 1,
            body: Table,
           
        }
    })



    //hanlde production by machines
    Content.push({
        text: `MACHINE WISE PRODUCTION \n\n`,
        pageOrientation: 'landscape',
        style: { 'alignment': 'center', fontSize: 14, bold: true },
        pageBreak: 'before'
    })
    Table = []
    TableRow = []

    // header
    let machines = await Machine.find({ is_active: true }).sort('serial_no')
    TableRow = ["DATE"]
    for (let k = 0; k < machines.length; k++) {
        let machine = machines[k]
        TableRow.push(String(machine.name).toUpperCase())
    }
    Table.push(TableRow)

    //body
    TableRow = []
    for (let j = 0; j < 31; j++) {
        let dt1 = new Date()
        let dt2 = new Date()
        dt1.setDate(j + 1)
        dt2.setDate(j + 2)
        dt1.setHours(0)
        dt1.setMinutes(0)
        dt2.setHours(0)
        dt2.setMinutes(0)
        TableRow.push(moment(dt1).format("DD/MM/YYYY"))
        for (let k = 0; k < machines.length; k++) {
            let machine = machines[k]
            productions = await Production.find({ date: { $gte: dt1, $lt: dt2 }, machine: machine._id })
            let result = productions.reduce((a, b) => { return Number(a) + Number(b.production) }, 0)
            if (result === 0)
                TableRow.push('')
            else
                TableRow.push(String(result))
        }
        Table.push(TableRow)
        TableRow = []
    }
    //footer
    TableRow = ["Total"]
    for (let k = 0; k < machines.length; k++) {
        let dt1 = new Date()
        let dt2 = new Date()
        dt1.setDate(1)
        dt2.setDate(31)
        dt1.setHours(0)
        dt1.setMinutes(0)
        dt2.setHours(0)
        dt2.setMinutes(0)
        let machine = machines[k]
        productions = await Production.find({ date: { $gte: dt1, $lt: dt2 }, machine: machine._id })
        let result = productions.reduce((a, b) => { return Number(a) + Number(b.production) }, 0)
        if (result === 0)
            TableRow.push('')
        else
            TableRow.push(String(result))
    }
    Table.push(TableRow)
    Content.push({
        table: {
            headerRows: 1,
            body: Table
        }
    })


    // hanlde production by machine categories
    Content.push({
        text: `MACHINE'S CATEGORY WISE PRODUCTION \n\n`,
        pageOrientation: 'portrait',
        style: { 'alignment': 'center', fontSize: 14, bold: true },
        pageBreak: 'before'
    })
    Table = []
    //header
    TableRow = ["DATE", "TOTAL", "VERTICAL+LYMPHA", "PU", "GUMBOOT"]
    Table.push(TableRow)
    TableRow = []

    //body
    let Ttotal1 = 0
    let Ttotal2 = 0
    let Ttotal3 = 0
    let Ttotal4 = 0
    for (let j = 0; j < 31; j++) {
        let dt1 = new Date()
        let dt2 = new Date()
        dt1.setDate(j + 1)
        dt2.setDate(j + 2)
        dt1.setHours(0)
        dt1.setMinutes(0)
        dt2.setHours(0)
        dt2.setMinutes(0)
        TableRow[0] = moment(dt1).format("DD/MM/YYYY")
        let total = 0
        TableRow[1] = ""
        //vertical production
        productions = await Production.find({ date: { $gte: dt1, $lt: dt2 } }).populate('machine')
        productions = productions.filter((prod) => { return prod.machine.category === "vertical" })
        let result = productions.reduce((a, b) => { return Number(a) + Number(b.production) }, 0)
        total += result
        productions = await Production.find({ date: { $gte: dt1, $lt: dt2 } }).populate('machine')
        productions = productions.filter((prod) => { return prod.machine.category === "lympha" })
        result = productions.reduce((a, b) => { return Number(a) + Number(b.production) }, 0)
        total += result
        Ttotal2 += total
        if (total === 0)
            TableRow[2] = ""
        else
            TableRow[2] = (String(total))

        productions = await Production.find({ date: { $gte: dt1, $lt: dt2 } }).populate('machine')
        productions = productions.filter((prod) => { return prod.machine.category === "pu" })
        result = productions.reduce((a, b) => { return Number(a) + Number(b.production) }, 0)
        total += result
        Ttotal3 += result
        if (result === 0)
            TableRow[3] = ""
        else
            TableRow[3] = (String(result))



        productions = await Production.find({ date: { $gte: dt1, $lt: dt2 } }).populate('machine')
        productions = productions.filter((prod) => { return prod.machine.category === "gumboot" })
        result = productions.reduce((a, b) => { return Number(a) + Number(b.production) }, 0)
        total += result
        Ttotal4 += result
        if (result === 0)
            TableRow[4] = ""
        else
            TableRow[4] = (String(result))
        if (total === 0)
            TableRow[1] = ""
        else
            TableRow[1] = (String(total))

        Ttotal1 += total
        Table.push(TableRow)
        TableRow = []
    }
    //footer
    TableRow[0] = "Total"
    TableRow[1] = String(Ttotal1)
    TableRow[2] = String(Ttotal2)
    TableRow[3] = String(Ttotal3)
    TableRow[4] = String(Ttotal4)
    Table.push(TableRow)

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
            fontSize: 7,
            font: 'Roboto',
            lineHeight: 1
        }
    })
    doc.pipe(fs.createWriteStream(`./pdfs/production/productions.pdf`))
    Content = []
    doc.end()

    setTimeout(async () => {
        await SendDocument(client)
    }, 20000)
}


async function SendDocument(client: any) {
    if (client) {
        console.log("sending pdf from", process.env.WAGREETING_PHONE)
        await client.sendMessage(String(process.env.WAGREETING_PHONE), {
            document: fs.readFileSync(`./pdfs/production/productions.pdf`),
            fileName: `Production_report.pdf`,
        })
    }
}