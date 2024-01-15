import { NextFunction, Request, Response, response } from "express"
import { uploadFileToCloud } from "../utils/uploadFile.util"
import { IVisit, IVisitBody, IVisitReport, IVisitReportBody } from "../types/visit.types"
import { Visit } from "../models/visit/visit.model"
import { VisitReport } from "../models/visit/visit.report.model"
import { IUser } from "../types/user.types"

// get attendence reports
export const GetVisitsAttendence = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let id = req.query.id
    let start_date = req.query.start_date
    let end_date = req.query.end_date
    let visits: IVisit[] = []
    let count = 0
    let dt1 = new Date(String(start_date))
    let dt2 = new Date(String(end_date))
    let user_ids: string[] = []
    user_ids = req.user.assigned_users.map((user: IUser) => { return user._id })
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        if (!id) {
            if (user_ids.length > 0) {
                visits = await Visit.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: { $in: user_ids } }).populate("visit_reports").populate('created_by').populate('updated_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
                count = await Visit.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: { $in: user_ids } }).countDocuments()
            }

            else {
                visits = await Visit.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: req.user._id }).populate("visit_reports").populate('created_by').populate('updated_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
                count = await Visit.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: req.user._id }).countDocuments()
            }
        }

        if (id) {
            visits = await Visit.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: id }).populate("visit_reports").populate('created_by').populate('updated_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
            count = await Visit.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: id }).countDocuments()
        }
        return res.status(200).json({
            visits,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })
}

export const getVisits = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let id = req.query.id
    let start_date = req.query.start_date
    let end_date = req.query.end_date
    let visits: IVisitReport[] = []
    let count = 0
    let dt1 = new Date(String(start_date))
    let dt2 = new Date(String(end_date))
    let user_ids: string[] = []
    user_ids = req.user.assigned_users.map((user: IUser) => { return user._id })

    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        if (!id) {
            if (user_ids.length > 0) {
                visits = await VisitReport.find({ created_at: { $gte: dt1, $lt: dt2 }, person: { $in: user_ids } }).populate('person').populate('visit').populate('created_by').populate('updated_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
                count = await VisitReport.find({ created_at: { $gte: dt1, $lt: dt2 }, person: { $in: user_ids } }).countDocuments()
            }

            else {
                visits = await VisitReport.find({ created_at: { $gte: dt1, $lt: dt2 }, person: req.user._id }).populate('person').populate('visit').populate('created_by').populate('updated_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
                count = await VisitReport.find({ created_at: { $gte: dt1, $lt: dt2 } }).countDocuments()
            }
        }


        if (id) {
            visits = await VisitReport.find({ created_at: { $gte: dt1, $lt: dt2 }, person: id }).populate('person').populate('visit').populate('created_by').populate('updated_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
            count = await VisitReport.find({ created_at: { $gte: dt1, $lt: dt2 }, person: id }).countDocuments()
        }

        return res.status(200).json({
            visits,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })
}

export const getMyTodayVisit = async (req: Request, res: Response, next: NextFunction) => {
    let dt1 = new Date()
    let dt2 = new Date()
    dt2.setDate(new Date(dt2).getDate() + 1)
    dt1.setHours(8)
    dt1.setMinutes(0)

    let visit = await Visit.findOne({ created_at: { $gte: dt1, $lt: dt2 }, created_by: req.user._id }).populate('visit_reports').populate('created_by').populate('updated_by')
    return res.status(200).json(visit)
}

//post/put/delte/patch
export const StartMyDay = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    console.log(body)
    console.log(req.file)
    let { start_day_credientials } = body as IVisitBody
    if (!start_day_credientials) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    let dt1 = new Date()
    let dt2 = new Date()
    dt2.setDate(new Date(dt2).getDate() + 1)
    dt1.setHours(8)
    dt1.setMinutes(0)

    let visit = await Visit.findOne({ created_at: { $gte: dt1, $lt: dt2 }, person: req.user._id })

    if (visit)
        return res.status(403).json({ message: "day has already started" })
    let address = await (await fetch(`https://geocode.maps.co/reverse?lat=${start_day_credientials.latitude}&lon=${start_day_credientials.longitude}&&api_key=${process.env.GECODE_API_KEY}`)).json()


    visit = new Visit({
        start_day_credientials: {
            latitude: start_day_credientials.latitude,
            longitude: start_day_credientials.longitude,
            timestamp: start_day_credientials.timestamp,
            address: String(address.display_name)
        },
    })
    visit.real_city = address.address.suburb || address.address.city || address.address.county || address.address.state_district || address.address.postcode
    if (!req.file) {
        return res.status(400).json({ message: "please upload your selfie" })
    }

    if (req.file) {
        console.log(req.file.mimetype)
        const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
        const storageLocation = `visits/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 10 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc)
            visit.start_day_photo = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }

    visit.created_at = new Date()
    visit.updated_at = new Date()
    visit.created_by = req.user
    visit.updated_by = req.user
    console.log(visit)
    await visit.save()
    return res.status(201).json(visit)
}

export const EndMyDay = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { end_day_credentials } = body as IVisitBody

    if (!end_day_credentials) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    let id = req.params.id
    let visit = await Visit.findById(id)
    if (!visit)
        return res.status(400).json({ message: "day not started yet" })

    if (visit) {
        let address = await (await fetch(`https://geocode.maps.co/reverse?lat=${end_day_credentials.latitude}&lon=${end_day_credentials.longitude}&&api_key=${process.env.GECODE_API_KEY}`)).json()
        visit.end_day_credentials = {
            latitude: end_day_credentials.latitude,
            longitude: end_day_credentials.longitude,
            timestamp: end_day_credentials.timestamp,
            address: String(address.display_name)
        }
    }


    if (!req.file) {
        return res.status(400).json({ message: "please upload your selfie" })
    }

    if (req.file) {
        console.log(req.file.mimetype)
        const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
        const storageLocation = `visits/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 10 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc)
            visit.end_day_photo = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    visit.updated_at = new Date()
    visit.updated_by = req.user
    await visit.save()
    return res.status(200).json({ message: "end day successful" })
}
export const ToogleAttendence = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id
    let visit = await Visit.findById(id)
    if (!visit)
        return res.status(400).json({ message: "visit not found" })
    visit.is_present = !visit.is_present
    visit.updated_by = req.user
    await visit.save()
    return res.status(200).json({ message: "successfull" })
}

export const MakeVisitIn = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { visit_in_credientials,
        party_name,
        city, is_old_party, mobile } = body as IVisitReportBody

    if (!visit_in_credientials || !party_name || !city || !mobile) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    let id = req.params.id
    let visit = await Visit.findById(id)
    if (!visit)
        return res.status(400).json({ message: "day not started yet" })

    if (!req.file) {
        return res.status(400).json({ message: "please upload your selfie" })
    }
    let report = new VisitReport({
        person: req.user,
        party_name,
        city,
        is_old_party: is_old_party,
        mobile: mobile,
        visit: visit,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    })
    let address = await (await fetch(`https://geocode.maps.co/reverse?lat=${visit_in_credientials.latitude}&lon=${visit_in_credientials.longitude}&&api_key=${process.env.GECODE_API_KEY}`)).json()
    report.visit_in_credientials = {
        latitude: visit_in_credientials.latitude,
        longitude: visit_in_credientials.longitude,
        timestamp: visit_in_credientials.timestamp,
        address: String(address.display_name)
    }
    report.real_city = address.address.suburb || address.address.county || address.address.city || address.address.city_district || address.address.state_district || address.address.postcode
    if (req.file) {
        console.log(req.file.mimetype)
        const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
        const storageLocation = `visits/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 10 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc)
            report.visit_in_photo = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    visit.updated_at = new Date()
    visit.updated_by = req.user
    let newreports: IVisitReport[] = visit.visit_reports
    newreports.push(report)
    visit.visit_reports = newreports
    await visit.save()
    await report.save()
    return res.status(200).json({ message: "visit in successful" })
}

export const AddVisitSummary = async (req: Request, res: Response, next: NextFunction) => {
    let { summary,
        mobile,
        is_old_party,
        dealer_of,
        refs_given,
        reviews_taken, turnover } = req.body as IVisitReportBody
    if (!summary || !mobile) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    let id = req.params.id
    let report = await VisitReport.findById(id)
    if (!report)
        return res.status(400).json({ message: "visit not exists" })

    report.is_old_party = is_old_party
    report.dealer_of = dealer_of
    report.mobile = mobile
    report.turnover = turnover
    report.refs_given = refs_given
    report.reviews_taken = reviews_taken
    report.summary = summary
    report.updated_at = new Date()
    report.updated_by = req.user
    await report.save()
    return res.status(200).json({ message: "Added Summary Successfully" })
}
export const EditVisitSummary = async (req: Request, res: Response, next: NextFunction) => {
    let { summary,
        is_old_party,
        dealer_of,
        refs_given,
        mobile,
        reviews_taken, turnover } = req.body as IVisitReportBody
    if (!summary || !mobile) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    let id = req.params.id
    let report = await VisitReport.findById(id)
    if (!report)
        return res.status(400).json({ message: "visit not exists" })

    report.is_old_party = is_old_party
    report.dealer_of = dealer_of
    report.mobile = mobile
    report.turnover = turnover
    report.refs_given = refs_given
    report.reviews_taken = reviews_taken
    report.summary = summary
    report.updated_at = new Date()
    report.updated_by = req.user
    await report.save()
    return res.status(200).json({ message: "updated Summary Successfully" })
}

export const ValidateVisit = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id
    let report = await VisitReport.findById(id)
    if (!report)
        return res.status(400).json({ message: "visit not exists" })

    report.visit_validated = true
    report.updated_at = new Date()
    report.updated_by = req.user
    await report.save()
    return res.status(200).json({ message: "visit validated" })
}
export const UploadVisitSamplesPhoto = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id
    let report = await VisitReport.findById(id)
    if (!report)
        return res.status(400).json({ message: "visit not exists" })
    if (!req.file) {
        return res.status(400).json({ message: "please upload your samples photo" })
    }

    if (req.file) {
        console.log(req.file.mimetype)
        const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
        const storageLocation = `visits/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 10 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc)
            report.visit_samples_photo = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    report.updated_at = new Date()
    report.updated_by = req.user
    await report.save()
    return res.status(200).json({ message: "samples uploaded successfull" })
}

export const AddAnkitInput = async (req: Request, res: Response, next: NextFunction) => {
    let { input } = req.body as IVisitReportBody & { input: string }
    if (!input) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    let id = req.params.id
    let report = await VisitReport.findById(id)
    if (!report)
        return res.status(400).json({ message: "visit not exists" })

    report.ankit_input = {
        input: input,
        created_by: req.user,
        timestamp: new Date()
    }
    report.updated_at = new Date()
    report.updated_by = req.user
    await report.save()
    return res.status(200).json({ message: "added ankit input" })

}

export const AddBrijeshInput = async (req: Request, res: Response, next: NextFunction) => {
    let { input } = req.body as IVisitReportBody & { input: string }
    if (!input) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    let id = req.params.id
    let report = await VisitReport.findById(id)
    if (!report)
        return res.status(400).json({ message: "visit not exists" })

    report.brijesh_input = {
        input: input,
        created_by: req.user,
        timestamp: new Date()
    }
    report.updated_at = new Date()
    report.updated_by = req.user
    await report.save()
    return res.status(200).json({ message: "added brijesh input" })
}

export const MakeVisitOut = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { visit_out_credentials } = body as IVisitReportBody
    if (!visit_out_credentials) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    let id = req.params.id
    let report = await VisitReport.findById(id)
    if (!report)
        return res.status(400).json({ message: "visit not exists" })
    let address = await (await fetch(`https://geocode.maps.co/reverse?lat=${visit_out_credentials.latitude}&lon=${visit_out_credentials.longitude}&&api_key=${process.env.GECODE_API_KEY}`)).json()
    report.visit_out_credentials = {
        latitude: visit_out_credentials.latitude,
        longitude: visit_out_credentials.longitude,
        timestamp: new Date(),
        address: String(address.display_name)
    }

    report.updated_at = new Date()
    report.updated_by = req.user
    await report.save()
    return res.status(200).json({ message: "visit out successful" })
}

