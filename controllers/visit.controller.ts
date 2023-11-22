import { NextFunction, Request, Response } from "express"
import { uploadFileToCloud } from "../utils/uploadFile.util"
import { IVisitBody, IVisitReport, IVisitReportBody } from "../types/visit.types"
import { Visit } from "../models/visit/visit.model"
import { VisitReport } from "../models/visit/visit.report.model"

export const StartMyDay = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { start_day_credientials } = body as IVisitBody
    if (!start_day_credientials) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    let visit = new Visit({
        start_day_credientials: start_day_credientials,
    })

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
    await visit.save()
    return res.status(201).json(visit)
}

export const EndMyDay = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { end_day_credentials } = body as IVisitBody

    if (!end_day_credentials) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    let previous_date = new Date()
    let day = previous_date.getDate() - 7
    previous_date.setDate(day)

    let visits = await Visit.find({ created_at: { $gte: previous_date } })
    let visit = visits.find((vist) => {
        if (vist.created_at.getDate() === new Date().getDate() && vist.created_at.getMonth() === new Date().getMonth() && vist.created_at.getFullYear() === new Date().getFullYear())
            return vist
    })
    if (visit)
        visit.end_day_credentials = end_day_credentials
    if (!visit) {
        return res.status(404).json({ message: "your day not started yet" })
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

export const MakeVisitIn = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { visit_in_credientials,
        party_name,
        city,
        summary,
        is_old_party,
        dealer_of,
        refs_given,
        reviews_taken } = body as IVisitReportBody

    if (!visit_in_credientials) {
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
        visit_in_credientials,
        person: req.user,
        party_name,
        city,
        summary,
        is_old_party,
        dealer_of,
        refs_given,
        reviews_taken
    })

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

export const MakeVisitOut = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { visit_out_credentials } = body as IVisitReportBody

    if (!visit_out_credentials) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    let previous_date = new Date()
    let day = previous_date.getDate() - 7
    previous_date.setDate(day)

    let visit_reports = await VisitReport.find({ created_at: { $gte: previous_date } })
    let visit_report = visit_reports.find((report) => {
        if (report.created_at.getDate() === new Date().getDate() && report.created_at.getMonth() === new Date().getMonth() && report.created_at.getFullYear() === new Date().getFullYear())
            return report
    })
    if (visit_report)
        visit_report.visit_out_credentials = visit_out_credentials
    if (!visit_report) {
        return res.status(404).json({ message: "your visit not started yet" })
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







