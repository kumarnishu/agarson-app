import PdfPrinter from "pdfmake"
import path from "path"
import { Content } from "pdfmake/interfaces"
import fs from "fs"
import { User } from "../models/users/user.model"
import { ReportManager, io } from "../app"
import { IProduction } from "../types/production.types"
import { Production } from "../models/production/production.model"
import moment from "moment"
import { Machine } from "../models/production/machine.model"
import { createWhatsappClient } from "./CreateWhatsappClient"

export async function ExportProductionsToPdf(client: {
    client_id: string;
    client: any;
}) {
    let cronString1 = `52 16 1/1 * *`
    console.log("running production trigger")
    if (!ReportManager.exists("production_reports1"))
        ReportManager.add("production_reports1", cronString1, async () => {
            await HandleProductionReports(client)
        })

    if (ReportManager.exists("production_reports1")) {
        ReportManager.start("production_reports1")
    }
}

export async function HandleProductionReports(client: {
    client_id: string;
    client: any;
}) {
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
            style: { 'alignment': 'left', fontSize: 14, bold: true },
        }
    ]
    let Table: Content[][] = []
    let TableRow: Content[] = []


    /* handle production by thekedar ************************
    ************************************/
    let productions: IProduction[] = []
    let users = await User.find().sort("username")
    users = users.filter((u) => {
        if (!u.productions_access_fields.is_hidden && !u.productions_access_fields.is_editable) {
            return u
        }
    })
    //header 
    TableRow.push({ text: 'DATE', style: { bold: true } })
    for (let k = 0; k < users.length; k++) {
        let user = users[k]
        TableRow.push({ text: String(user.username).toUpperCase(), style: { bold: true } })
    }
    TableRow.push({ text: "TOTAL", style: { bold: true } })
    Table.push(TableRow)

    //body
    TableRow = []
    for (let j = 0; j < 31; j++) {
        let total = 0
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
            total += result
        }
        TableRow.push({ text: String(total), style: { bold: true } })
        Table.push(TableRow)
        TableRow = []
    }
    //footer
    TableRow = [{ text: 'TOTAL', style: { bold: true } }]
    let total = 0
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
        total += result
        if (result === 0)
            TableRow.push('')
        else
            TableRow.push({ text: String(result).toUpperCase(), style: { bold: true } })
    }
    TableRow.push({ text: String(total), style: { bold: true } })
    Table.push(TableRow)
    Content.push({
        table: {
            headerRows: 1,
            body: Table,

        }
    })



    /*hanlde production by machines ************************
    ************************************/

    Content.push({
        text: `MACHINE WISE PRODUCTION \n\n`,
        style: { 'alignment': 'center', fontSize: 14, bold: true },
        pageBreak: 'before'
    })
    Table = []
    TableRow = []

    // header
    let machines = await Machine.find({ active: true }).sort('serial_no')
    TableRow = [{ text: 'DATE', style: { bold: true } }]
    for (let k = 0; k < machines.length; k++) {
        let machine = machines[k]
        TableRow.push({ text: String(machine.name).toUpperCase(), style: { bold: true } })
    }
    TableRow.push({ text: 'TOTAL', style: { bold: true } })
    Table.push(TableRow)

    //body
    TableRow = []
    for (let j = 0; j < 31; j++) {
        let total = 0
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
            total += result
            if (result === 0)
                TableRow.push('')
            else
                TableRow.push(String(result))
        }
        TableRow.push({ text: String(total), style: { bold: true } })
        Table.push(TableRow)
        TableRow = []
    }
    //footer
    TableRow = [{ text: 'TOTAL', style: { bold: true } }]
    total = 0
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
        total += result
        if (result === 0)
            TableRow.push('')
        else
            TableRow.push({ text: String(result).toUpperCase(), style: { bold: true } })
    }
    TableRow.push({ text: String(total), style: { bold: true } })
    Table.push(TableRow)
    Content.push({
        table: {
            headerRows: 1,
            body: Table
        }
    })


    /* hanlde production by machine categories************************
    ***********************************/

    Content.push({
        text: `MACHINE'S CATEGORY WISE PRODUCTION \n\n`,
        style: { 'alignment': 'left', fontSize: 14, bold: true },
        pageBreak: 'before'
    })
    Table = []

    //header
    TableRow = ["DATE", "TOTAL", "VERTICAL+LYMPHA", "PU", "GUMBOOT"].map((row) => {
        return { text: String(row).toUpperCase(), style: { bold: true } }
    })

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
            TableRow[2] = String(total)

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
            TableRow[1] = { text: String(total), style: { bold: true } }

        Ttotal1 += total
        Table.push(TableRow)
        TableRow = []
    }
    //footer
    TableRow[0] = { text: "TOTAL", style: { bold: true } }
    TableRow[1] = { text: String(Ttotal1), style: { bold: true } }
    TableRow[2] = { text: String(Ttotal2), style: { bold: true } }
    TableRow[3] = { text: String(Ttotal3), style: { bold: true } }
    TableRow[4] = { text: String(Ttotal4), style: { bold: true } }
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
        pageOrientation: 'landscape',
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
        try { await SendDocument(client.client) }
        catch (err) {
            if (io) {
                await createWhatsappClient(client.client_id, io)
                SendDocument(client.client)
            }
        }
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