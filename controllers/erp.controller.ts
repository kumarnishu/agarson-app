import { NextFunction, Request, Response } from "express"
import xlsx from "xlsx";
import { IState, IUser } from "../types/user.types";
import { IBillsAgingReport, IPendingOrdersReport } from "../types/erp_report.types";
import { BillsAgingReport } from "../models/erp_reports/bills_aging_model";
import { State } from "../models/users/state.model";
import { PendingOrdersReport } from "../models/erp_reports/pending_orders.model";
import { User } from "../models/users/user.model";

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
    const { state } = req.body as {
        state: string
    }
    if (!state) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    if (await State.findOne({ state: state }))
        return res.status(400).json({ message: "already exists this state" })
    let result = await new State({
        state: state,
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()
    return res.status(201).json(result)

}

export const UpdateState = async (req: Request, res: Response, next: NextFunction) => {
    const { state } = req.body as {
        state: string
    }
    if (!state) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    const id = req.params.id
    let oldstate = await State.findById(id)
    if (!oldstate)
        return res.status(404).json({ message: "state not found" })
    if (state !== oldstate.state)
        if (await State.findOne({ state: state }))
            return res.status(400).json({ message: "already exists this state" })
    oldstate.state = state
    oldstate.updated_at = new Date()
    if (req.user)
        oldstate.updated_by = req.user
    await oldstate.save()
    return res.status(200).json(oldstate)

}
export const BulkCreateStateFromExcel = async (req: Request, res: Response, next: NextFunction) => {
    let result: IBillsAgingReport[] = []
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
        let workbook_response: IState[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );

        for (let i = 0; i < workbook_response.length; i++) {
            let item = workbook_response[i]
            let state: string | null = String(item.state)
            if (state) {
                let oldstate = await State.findOne({ state: state })
                if (!oldstate) {
                    await new State({
                        state: state,
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

export const GetBillsAgingReports = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let reports: IBillsAgingReport[] = []
    let count = 0
    let state_ids = req.user?.assigned_states.map((state: IState) => { return state }) || []

    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        if (req.user?.is_admin) {
            reports = await BillsAgingReport.find().populate('report_owner').populate('updated_by').populate('created_by').sort('account').skip((page - 1) * limit).limit(limit)
            count = await BillsAgingReport.find().countDocuments()
        }

        else {
            reports = await BillsAgingReport.find({ report_owner: { $in: state_ids } }).populate('report_owner').populate('updated_by').populate('created_by').sort('account').skip((page - 1) * limit).limit(limit)
            count = await BillsAgingReport.find({ report_owner: { $in: state_ids } }).countDocuments()
        }

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
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let reports: IPendingOrdersReport[] = []
    let count = 0
    let state_ids = req.user?.assigned_states.map((state: IState) => { return state }) || []

    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        if (req.user?.is_admin) {
            reports = await PendingOrdersReport.find().populate("report_owner").populate('updated_by').populate('created_by').sort('account').skip((page - 1) * limit).limit(limit)
            count = await PendingOrdersReport.find().countDocuments()
        }

        else {
            reports = await PendingOrdersReport.find({ report_owner: { $in: state_ids } }).populate('updated_by').populate("report_owner").populate('created_by').sort('account').skip((page - 1) * limit).limit(limit)
            count = await PendingOrdersReport.find({ report_owner: { $in: state_ids } }).countDocuments()
        }

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

export const BulkAssignStates = async (req: Request, res: Response, next: NextFunction) => {
    const { states, ids } = req.body as { states: string[], ids: string[] }
    if (states && states.length === 0)
        return res.status(403).json({ message: "please select one state " })
    if (ids && ids.length === 0)
        return res.status(403).json({ message: "please select one state owner" })

    let owners = ids
    for (let i = 0; i < owners.length; i++) {
        await User.findByIdAndUpdate(owners[i], {
            assigned_states: states
        })
    }
    return res.status(200).json({ message: "assigned successfully" })
}


