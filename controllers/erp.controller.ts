import { NextFunction, Request, Response } from "express"
import xlsx from "xlsx";
import { BillsAgingReport, IBillsAgingReport } from "../models/erp_reports/bills_aging_model";
import { IState, State } from "../models/erp_reports/state.model";
import { IPendingOrdersReport, PendingOrdersReport } from "../models/erp_reports/pending_orders.model";
import { IUser, User } from "../models/users/user.model";
import { ClientSaleLastYearReport, ClientSaleReport } from "../models/erp_reports/client_sale.model";
import { IPartyTargetReport, PartyTargetReport } from "../models/erp_reports/partytarget.model";
import { ClientSaleReportTemplate, IErpStateTemplate, ISaleAnalysisReportTemplate } from "../types/template.type";
import isMongoId from "validator/lib/isMongoId";
import mongoose from "mongoose";
import { GetLastYearlyachievementBystate, GetMonthlyachievementBystate, GetMonthlytargetBystate, GetYearlyachievementBystate } from "../utils/ErpUtils";

//get


export const GetAllStates = async (req: Request, res: Response, next: NextFunction) => {
    let result: { state: IState, users: IUser[] }[] = []
    let states = await State.find()
    for (let i = 0; i < states.length; i++) {
        let users = await User.find({ assigned_states: states[i]._id })
        result.push({ state: states[i], users: users })
    }
    return res.status(200).json(result)
}



export const CreateState = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body as IErpStateTemplate;
    if (!body.state) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    if (await State.findOne({ state: body.state }))
        return res.status(400).json({ message: "already exists this state" })
    let result = await new State({
        ...body,
        _id: new mongoose.Types.ObjectId(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()
    return res.status(201).json(result)

}

export const UpdateState = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body as IErpStateTemplate;
    if (!body.state) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    const id = req.params.id
    let oldstate = await State.findById(id)
    if (!oldstate)
        return res.status(404).json({ message: "state not found" })
    if (body.state !== oldstate.state)
        if (await State.findOne({ state: body.state }))
            return res.status(400).json({ message: "already exists this state" })
    await State.findByIdAndUpdate(oldstate._id, { ...body, updated_by: req.user, updated_at: new Date() })
    return res.status(200).json(oldstate)

}

export const DeleteErpState = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "state id not valid" })
    let state = await State.findById(id);
    if (!state) {
        return res.status(404).json({ message: "state not found" })
    }
    await state.remove();
    return res.status(200).json({ message: "state deleted successfully" })
}

export const BulkCreateAndUpdateErpStatesFromExcel = async (req: Request, res: Response, next: NextFunction) => {
    let result: IErpStateTemplate[] = []
    let statusText: string = ""
    if (!req.file)
        return res.status(400).json({
            message: "please provide an Excel file",
        });
    if (req.file) {
        const allowedFiles = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only excel and csv are allowed to upload` })
        if (req.file.size > 100 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :100mb` })
        const workbook = xlsx.read(req.file.buffer);
        let workbook_sheet = workbook.SheetNames;
        let workbook_response: IErpStateTemplate[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        console.log(workbook_response.length)
        if (workbook_response.length > 3000) {
            return res.status(400).json({ message: "Maximum 3000 records allowed at one time" })
        }

        for (let i = 0; i < workbook_response.length; i++) {
            let item = workbook_response[i]
            let state: string | null = String(item.state)
            let apr: number | null = Number(item.apr)
            let may: number | null = Number(item.may)
            let jun: number | null = Number(item.jun)
            let jul: number | null = Number(item.jul)
            let aug: number | null = Number(item.aug)
            let sep: number | null = Number(item.sep)
            let oct: number | null = Number(item.oct)
            let nov: number | null = Number(item.nov)
            let dec: number | null = Number(item.dec)
            let jan: number | null = Number(item.jan)
            let feb: number | null = Number(item.feb)
            let mar: number | null = Number(item.mar)

            if (state) {
                if (item._id && isMongoId(String(item._id))) {
                    await State.findByIdAndUpdate(item._id, {
                        state: state,
                        apr: apr || 0,
                        may: may || 0,
                        jun: jun || 0,
                        jul: jul || 0,
                        aug: aug || 0,
                        sep: sep || 0,
                        oct: oct || 0,
                        nov: nov || 0,
                        dec: dec || 0,
                        jan: jan || 0,
                        feb: feb || 0,
                        mar: mar || 0,
                        created_by: req.user,
                        updated_by: req.user,
                        created_at: new Date(),
                        updated_at: new Date()
                    })
                    statusText = "updated"
                }

                if (!item._id || !isMongoId(String(item._id))) {
                    let oldstate = await State.findOne({ state: state })
                    if (!oldstate) {
                        await new State({
                            ...item,
                            _id: new mongoose.Types.ObjectId(),
                            created_by: req.user,
                            updated_by: req.user,
                            created_at: new Date(),
                            updated_at: new Date()
                        }).save()
                        statusText = "created"
                    }
                    else
                        statusText = "duplicate"
                }

            }
            else
                statusText = "required state"

            result.push({
                ...item,
                status: statusText
            })
        }


    }
    return res.status(200).json(result);
}


export const GetBillsAgingReports = async (req: Request, res: Response, next: NextFunction) => {
    let state_ids = req.user?.assigned_states.map((state: IState) => { return state }) || []
    let reports = (await BillsAgingReport.find({ report_owner: { $in: state_ids } }).populate('report_owner')).map((i) => { return { ...i, report_owner: i.report_owner.state } })
    return res.status(200).json(reports);
}

export const BulkCreateBillsAgingReportFromExcel = async (req: Request, res: Response, next: NextFunction) => {
    let result: IBillsAgingReport[] = []
    if (!req.file)
        return res.status(400).json({
            message: "please provide an Excel file",
        });
    await BillsAgingReport.deleteMany({})
    if (req.file) {
        const allowedFiles = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only excel and csv are allowed to upload` })
        if (req.file.size > 100 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :100mb` })
        const workbook = xlsx.read(req.file.buffer);
        let workbook_sheet = workbook.SheetNames;
        let workbook_response: IBillsAgingReport[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        let statusText = ""

        for (let i = 0; i < workbook_response.length; i++) {
            let report = workbook_response[i]
            let report_owner: string | null = String(report.report_owner)
            let account: string | null = String(report.account)
            let plu70: number | null = Number(report.plu70)
            let in70to90: number | null = Number(report.in70to90)
            let in90to120: number | null = Number(report.in90to120)
            let plus120: number | null = Number(report.plus120)

            let validated = true

            if (!report_owner) {
                validated = false
                statusText = "report owner required"
            }
            if (!validated) {
                result.push({
                    ...report,
                    status: statusText
                })
            }

            if (validated) {
                let owner = await State.findOne({ state: report.report_owner })
                if (owner) {
                    await new BillsAgingReport({
                        report_owner: owner,
                        plu70: plu70,
                        in70to90: in70to90,
                        in90to120: in90to120,
                        account: account,
                        plus120: plus120,
                        created_by: req.user,
                        updated_by: req.user,
                        created_at: new Date(),
                        updated_at: new Date()
                    }).save()
                }
            }
        }
    }
    return res.status(200).json(result);
}

export const GetPendingOrderReports = async (req: Request, res: Response, next: NextFunction) => {
    let state_ids = req.user?.assigned_states.map((state: IState) => { return state }) || []
    let reports = (await PendingOrdersReport.find({ report_owner: { $in: state_ids } }).populate("report_owner")).map((i) => { return { ...i, report_owner: i.report_owner.state } })
    return res.status(200).json(reports);
}

export const BulkPendingOrderReportFromExcel = async (req: Request, res: Response, next: NextFunction) => {
    let result: IPendingOrdersReport[] = []
    if (!req.file)
        return res.status(400).json({
            message: "please provide an Excel file",
        });
    await PendingOrdersReport.deleteMany({})
    if (req.file) {
        const allowedFiles = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only excel and csv are allowed to upload` })
        if (req.file.size > 100 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :100mb` })
        const workbook = xlsx.read(req.file.buffer);
        let workbook_sheet = workbook.SheetNames;
        let workbook_response: IPendingOrdersReport[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        let statusText = ""

        for (let i = 0; i < workbook_response.length; i++) {
            let report = workbook_response[i]
            let report_owner: string | null = String(report.report_owner)
            let account: string | null = String(report.account)
            let article: string | null = String(report.article)
            let product_family: string | null = String(report.product_family)
            let state: string | null = String(report.report_owner)
            let size5: number | null = Number(report.size5)
            let size6: number | null = Number(report.size6)
            let size7: number | null = Number(report.size7)
            let size8: number | null = Number(report.size8)
            let size9: number | null = Number(report.size9)
            let size10: number | null = Number(report.size10)
            let size11: number | null = Number(report.size11)
            let size12_24pairs: number | null = Number(report.size12_24pairs)
            let size13: number | null = Number(report.size13)
            let size11x12: number | null = Number(report.size11x12)
            let size3: number | null = Number(report.size3)
            let size4: number | null = Number(report.size4)
            let size6to10: number | null = Number(report.size6to10)
            let size7to10: number | null = Number(report.size7to10)
            let size8to10: number | null = Number(report.size8to10)
            let size4to8: number | null = Number(report.size4to8)
            let size6to9: number | null = Number(report.size6to9)
            let size5to8: number | null = Number(report.size5to8)
            let size6to10A: number | null = Number(report.size6to10A)
            let size7to10B: number | null = Number(report.size7to10B)
            let size6to9A: number | null = Number(report.size6to9A)
            let size11close: number | null = Number(report.size11close)
            let size11to13: number | null = Number(report.size11to13)
            let size3to8: number | null = Number(report.size3to8)

            let validated = true

            if (!report_owner) {
                validated = false
                statusText = "report owner required"
            }
            if (!validated) {
                result.push({
                    ...report,
                    status: statusText
                })
            }

            if (validated) {
                let owner = await State.findOne({ state: report.report_owner })
                if (owner) {
                    await new PendingOrdersReport({
                        report_owner: owner,
                        account: account,
                        article: article,
                        product_family: product_family,
                        state: state,
                        size5: size5 || 0,
                        size6: size6 || 0,
                        size7: size7 || 0,
                        size8: size8 || 0,
                        size9: size9 || 0,
                        size10: size10 || 0,
                        size11: size11 || 0,
                        size12_24pairs: size12_24pairs || 0,
                        size13: size13 || 0,
                        size11x12: size11x12 || 0,
                        size3: size3 || 0,
                        size4: size4 || 0,
                        size6to10: size6to10 || 0,
                        size7to10: size7to10 || 0,
                        size8to10: size8to10 || 0,
                        size4to8: size4to8 || 0,
                        size6to9: size6to9 || 0,
                        size5to8: size5to8 || 0,
                        size6to10A: size6to10A || 0,
                        size7to10B: size7to10B || 0,
                        size6to9A: size6to9A || 0,
                        size11close: size11close || 0,
                        size11to13: size11to13 || 0,
                        size3to8: size3to8 || 0,
                        created_by: req.user,
                        updated_by: req.user,
                        created_at: new Date(),
                        updated_at: new Date()
                    }).save()
                }
            }
        }
    }
    return res.status(200).json(result);
}


export const AssignErpStatesToUsers = async (req: Request, res: Response, next: NextFunction) => {
    const { state_ids, user_ids, flag } = req.body as {
        user_ids: string[],
        state_ids: string[],
        flag: number
    }
    if (state_ids && state_ids.length === 0)
        return res.status(400).json({ message: "please select one state " })
    if (user_ids && user_ids.length === 0)
        return res.status(400).json({ message: "please select one state owner" })

    let owners = user_ids

    if (flag == 0) {
        for (let i = 0; i < owners.length; i++) {
            let owner = await User.findById(owners[i]).populate('assigned_states');
            if (owner) {
                let oldstates = owner.assigned_states.map((item) => { return item._id.valueOf() });
                oldstates = oldstates.filter((item) => { return !state_ids.includes(item) });
                console.log(oldstates)
                await User.findByIdAndUpdate(owner._id, {
                    assigned_states: oldstates
                })
            }
        }
    }
    else for (let k = 0; k < owners.length; k++) {
        const user = await User.findById(owners[k]).populate('assigned_states')
        if (user) {
            let assigned_states = user.assigned_states;
            for (let i = 0; i <= state_ids.length; i++) {
                if (!assigned_states.map(i => { return i._id.valueOf() }).includes(state_ids[i])) {
                    let state = await State.findById(state_ids[i]);
                    if (state)
                        assigned_states.push(state)
                }
            }

            user.assigned_crm_states = assigned_states
            await user.save();
        }

    }

    return res.status(200).json({ message: "successfull" })
}

export const GetClientSaleReports = async (req: Request, res: Response, next: NextFunction) => {
    let state_ids = req.user?.assigned_states.map((state: IState) => { return state }) || []
    let data = (await ClientSaleReport.find({ report_owner: { $in: state_ids } }).populate('report_owner')).map((i) => {
        console.log(i)
        return {
            ...i,
            report_owner: i.report_owner.state,
        }
    });
    return res.status(200).json(data)
}

export const BulkCreateClientSaleReportFromExcel = async (req: Request, res: Response, next: NextFunction) => {
    let result: ClientSaleReportTemplate[] = []
    if (!req.file)
        return res.status(400).json({
            message: "please provide an Excel file",
        });
    await ClientSaleReport.deleteMany({})
    if (req.file) {
        const allowedFiles = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only excel and csv are allowed to upload` })
        if (req.file.size > 100 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :100mb` })
        const workbook = xlsx.read(req.file.buffer);
        let workbook_sheet = workbook.SheetNames;
        let workbook_response: ClientSaleReportTemplate[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        let statusText = ""

        for (let i = 0; i < workbook_response.length; i++) {
            let report = workbook_response[i]
            let report_owner: string | null = String(report.report_owner)
            let article: string | null = report.article
            let account: string | null = report.account
            let oldqty: number | null = report.oldqty
            let newqty: number | null = report.newqty
            let apr: number | null = report.apr
            let may: number | null = report.may
            let jun: number | null = report.jun
            let jul: number | null = report.jul
            let aug: number | null = report.aug
            let sep: number | null = report.sep
            let oct: number | null = report.oct
            let nov: number | null = report.nov
            let dec: number | null = report.dec
            let jan: number | null = report.jan
            let feb: number | null = report.feb
            let mar: number | null = report.mar
            let validated = true

            if (!report_owner) {
                validated = false
                statusText = "report owner required"
            }
            if (!validated) {
                result.push({
                    ...report,
                    status: statusText
                })
            }

            if (validated) {
                let owner = await State.findOne({ state: report.report_owner })
                console.log("state", owner?.state, i)
                if (owner) {
                    await new ClientSaleReport({
                        report_owner: owner,
                        article: article,
                        account: account,
                        oldqty: oldqty,
                        newqty: newqty,
                        apr: apr,
                        may: may,
                        jun: jun,
                        jul: jul,
                        aug: aug,
                        sep: sep,
                        oct: oct,
                        nov: nov,
                        dec: dec,
                        jan: jan,
                        feb: feb,
                        mar: mar,
                        created_by: req.user,
                        updated_by: req.user,
                        created_at: new Date(),
                        updated_at: new Date()
                    }).save()
                }
            }
        }
    }
    return res.status(200).json(result);
}
export const GetClientSaleReportsForLastYear = async (req: Request, res: Response, next: NextFunction) => {
    let state_ids = req.user?.assigned_states.map((state: IState) => { return state }) || []
    let data = await ClientSaleLastYearReport.find({ report_owner: { $in: state_ids } }).populate('report_owner');
    return res.status(200).json(data)
}

export const BulkCreateClientSaleReportFromExcelForLastYear = async (req: Request, res: Response, next: NextFunction) => {
    let result: ClientSaleReportTemplate[] = []
    if (!req.file)
        return res.status(400).json({
            message: "please provide an Excel file",
        });
    await ClientSaleReport.deleteMany({})
    if (req.file) {
        const allowedFiles = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only excel and csv are allowed to upload` })
        if (req.file.size > 100 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :100mb` })
        const workbook = xlsx.read(req.file.buffer);
        let workbook_sheet = workbook.SheetNames;
        let workbook_response: ClientSaleReportTemplate[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        let statusText = ""

        for (let i = 0; i < workbook_response.length; i++) {
            let report = workbook_response[i]
            let report_owner: string | null = String(report.report_owner)
            let article: string | null = report.article
            let account: string | null = report.account
            let oldqty: number | null = report.oldqty
            let newqty: number | null = report.newqty
            let apr: number | null = report.apr
            let may: number | null = report.may
            let jun: number | null = report.jun
            let jul: number | null = report.jul
            let aug: number | null = report.aug
            let sep: number | null = report.sep
            let oct: number | null = report.oct
            let nov: number | null = report.nov
            let dec: number | null = report.dec
            let jan: number | null = report.jan
            let feb: number | null = report.feb
            let mar: number | null = report.mar
            let validated = true

            if (!report_owner) {
                validated = false
                statusText = "report owner required"
            }
            if (!validated) {
                result.push({
                    ...report,
                    status: statusText
                })
            }

            if (validated) {
                let owner = await State.findOne({ state: report.report_owner })
                if (owner) {
                    await new ClientSaleReport({
                        report_owner: owner,
                        article: article,
                        account: account,
                        oldqty: oldqty,
                        newqty: newqty,
                        apr: apr,
                        may: may,
                        jun: jun,
                        jul: jul,
                        aug: aug,
                        sep: sep,
                        oct: oct,
                        nov: nov,
                        dec: dec,
                        jan: jan,
                        feb: feb,
                        mar: mar,
                        created_by: req.user,
                        updated_by: req.user,
                        created_at: new Date(),
                        updated_at: new Date()
                    }).save()
                }
            }
        }
    }
    return res.status(200).json(result);
}

export const GetPartyTargetReports = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let reports: IPartyTargetReport[] = []
    let count = 0
    let state_ids = req.user?.assigned_states.map((state: IState) => { return state }) || []

    if (!Number.isNaN(limit) && !Number.isNaN(page)) {

        reports = await PartyTargetReport.find({ report_owner: { $in: state_ids } }).populate('report_owner').populate('updated_by').populate('created_by').sort('account').skip((page - 1) * limit).limit(limit)
        count = await PartyTargetReport.find({ report_owner: { $in: state_ids } }).countDocuments()

        return res.status(200).json({
            reports,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })
}

export const BulkCreatePartyTargetReportFromExcel = async (req: Request, res: Response, next: NextFunction) => {
    let result: IPartyTargetReport[] = []
    if (!req.file)
        return res.status(400).json({
            message: "please provide an Excel file",
        });
    await PartyTargetReport.deleteMany({})
    if (req.file) {
        const allowedFiles = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only excel and csv are allowed to upload` })
        if (req.file.size > 100 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :100mb` })
        const workbook = xlsx.read(req.file.buffer, { raw: true });
        let workbook_sheet = workbook.SheetNames;
        let workbook_response: IPartyTargetReport[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        let statusText = ""

        for (let i = 0; i < workbook_response.length; i++) {
            let report = workbook_response[i]
            console.log(report)
            let slno: string | null = String(report.slno)
            let PARTY: string | null = String(report.PARTY)
            let Create_Date: string | null = report.Create_Date
            let STATION: string | null = String(report.STATION)
            let SALES_OWNER: string | null = String(report.SALES_OWNER)
            let report_owner: string | null = String(report.report_owner)
            let All_TARGET: string | null = report.All_TARGET
            let TARGET: number | null = Number(report.TARGET)
            let PROJECTION: number | null = Number(report.PROJECTION)
            let GROWTH: number | null = Number(report.GROWTH)
            let TARGET_ACHIEVE: number | null = Number(report.TARGET_ACHIEVE)
            let TOTAL_SALE_OLD: number | null = Number(report.TOTAL_SALE_OLD) || null
            let TOTAL_SALE_NEW: number | null = Number(report.TOTAL_SALE_NEW) || null
            let Last_Apr: number | null = Number(report.Last_Apr) || null
            let Cur_Apr: number | null = Number(report.Cur_Apr) || null
            let Last_May: number | null = Number(report.Last_May) || null
            let Cur_May: number | null = Number(report.Cur_May) || null
            let Last_Jun: number | null = Number(report.Last_Jun) || null
            let Cur_Jun: number | null = Number(report.Cur_Jun) || null
            let Last_Jul: number | null = Number(report.Last_Jul) || null
            let Cur_Jul: number | null = Number(report.Cur_Jul) || null
            let Last_Aug: number | null = Number(report.Last_Aug) || null
            let Cur_Aug: number | null = Number(report.Cur_Aug) || null
            let Last_Sep: number | null = Number(report.Last_Sep) || null
            let Cur_Sep: number | null = Number(report.Cur_Sep) || null
            let Last_Oct: number | null = Number(report.Last_Oct) || null
            let Cur_Oct: number | null = Number(report.Cur_Oct) || null
            let Last_Nov: number | null = Number(report.Last_Nov) || null
            let Cur_Nov: number | null = Number(report.Cur_Nov) || null
            let Last_Dec: number | null = Number(report.Last_Dec) || null
            let Cur_Dec: number | null = Number(report.Cur_Dec) || null
            let Last_Jan: number | null = Number(report.Last_Jan) || null
            let Cur_Jan: number | null = Number(report.Cur_Jan) || null
            let Last_Feb: number | null = Number(report.Last_Feb) || null
            let Cur_Feb: number | null = Number(report.Cur_Feb) || null
            let Last_Mar: number | null = Number(report.Last_Mar) || null
            let Cur_Mar: number | null = Number(report.Cur_Mar) || null
            let validated = true

            if (!report_owner) {
                validated = false
                statusText = "report owner required"
            }
            if (!validated) {
                result.push({
                    ...report,
                    status: statusText
                })
            }

            if (validated) {
                let owner = await State.findOne({ state: report.report_owner })
                console.log("state", owner?.state, i)
                if (owner) {
                    await new PartyTargetReport({
                        report_owner: owner,
                        slno: slno,
                        PARTY: PARTY,
                        Create_Date: Create_Date,
                        STATION: STATION,
                        SALES_OWNER: SALES_OWNER,
                        All_TARGET: All_TARGET || "",
                        TARGET: TARGET || 0,
                        PROJECTION: PROJECTION || 0,
                        GROWTH: GROWTH || 0,
                        TARGET_ACHIEVE: TARGET_ACHIEVE || 0,
                        TOTAL_SALE_OLD: TOTAL_SALE_OLD || 0,
                        TOTAL_SALE_NEW: TOTAL_SALE_NEW || 0,
                        Last_Apr: Last_Apr || 0,
                        Cur_Apr: Cur_Apr || 0,
                        Last_May: Last_May || 0,
                        Cur_May: Cur_May || 0,
                        Last_Jun: Last_Jun || 0,
                        Cur_Jun: Cur_Jun || 0,
                        Last_Jul: Last_Jul || 0,
                        Cur_Jul: Cur_Jul || 0,
                        Last_Aug: Last_Aug || 0,
                        Cur_Aug: Cur_Aug || 0,
                        Last_Sep: Last_Sep || 0,
                        Cur_Sep: Cur_Sep || 0,
                        Last_Oct: Last_Oct || 0,
                        Cur_Oct: Cur_Oct || 0,
                        Last_Nov: Last_Nov || 0,
                        Cur_Nov: Cur_Nov || 0,
                        Last_Dec: Last_Dec || 0,
                        Cur_Dec: Cur_Dec || 0,
                        Last_Jan: Last_Jan || 0,
                        Cur_Jan: Cur_Jan || 0,
                        Last_Feb: Last_Feb || 0,
                        Cur_Feb: Cur_Feb || 0,
                        Last_Mar: Last_Mar || 0,
                        Cur_Mar: Cur_Mar || 0,
                        created_by: req.user,
                        updated_by: req.user,
                        created_at: new Date(),
                        updated_at: new Date()
                    }).save()
                }
            }
        }
    }
    return res.status(200).json(result);
}

export const GetSaleAnalysisReport = async (req: Request, res: Response, next: NextFunction) => {
    let month = Number(req.params.month)
    if (req.user) {
        let result: ISaleAnalysisReportTemplate[] = []
        let user = await User.findById(req.user._id).populate('assigned_states');
        if (user) {
            let states = user.assigned_states;
            for (let i = 0; i < states.length; i++) {
                let reports = await PartyTargetReport.find({ report_owner: states[i]._id })
                let antarget = states[i].apr + states[i].may + states[i].jun + states[i].jul + states[i].aug + states[i].sep + states[i].oct + states[i].nov + states[i].dec + states[i].jan + states[i].feb + states[i].mar;

                if (reports && reports.length > 0)
                    result.push({
                        state: states[i].toString(),
                        monthly_target: GetMonthlytargetBystate(states[i], month).toString(),
                        monthly_achivement: GetMonthlyachievementBystate(reports, month).toString(),
                        monthly_percentage: (Math.round((GetMonthlyachievementBystate(reports, 6) / GetMonthlytargetBystate(states[i], month)) * 10000) / 100).toString(),
                        annual_target: antarget.toString(),
                        annual_achivement: GetYearlyachievementBystate(reports).toString(),
                        annual_percentage: (Math.round((GetYearlyachievementBystate(reports) / antarget) * 10000) / 100).toString(),
                        last_year_sale: GetLastYearlyachievementBystate(reports).toString(),
                        last_year_sale_percentage_comparison: (Math.round((GetLastYearlyachievementBystate(reports) / antarget) * 10000) / 100).toString()
                    })
            }
        }
        return res.status(200).json(result)
    }
    else
        return res.status(403).json({ message: "not authorized" })

}
