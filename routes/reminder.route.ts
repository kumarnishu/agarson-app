import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import {  GetReminders, CreateReminderByTemplate, StartReminderWithTemplate, ResetReminder, UpdateReminderByTemplate, CreateReminderByMessage, UpdateReminderByMessage, StartReminderWithMessage, StopReminder, GetContactReports, StopSingleContactReport, GetPaginatedContactReports, SearchContactReport, DownloadContactReports, } from "../controllers/reminder.controller";
import { upload } from "./user.routes";

const router = express.Router()

router.route("/reminders").post(isAuthenticatedUser, upload.none(), CreateReminderByTemplate)
router.route("/new/message/reminders").post(isAuthenticatedUser, upload.single("media"), CreateReminderByMessage)
router.route("/reminders").get(isAuthenticatedUser, GetReminders)
router.route("/update/message/reminders/:id").put(isAuthenticatedUser, upload.single("media"), UpdateReminderByMessage)
router.route("/reminders/:id").put(isAuthenticatedUser, upload.none(), UpdateReminderByTemplate)
// router.route("/reminders/:id").delete(isAuthenticatedUser, DeleteReminder)
router.route("/reports/reminders/:id").get(isAuthenticatedUser, GetContactReports)
router.route("/reset/reminders/:id").post(isAuthenticatedUser, ResetReminder)
router.route("/start/reminders/:id").post(isAuthenticatedUser, upload.none(), StartReminderWithTemplate)
router.route("/start/message/reminders/:id").post(isAuthenticatedUser, upload.none(), StartReminderWithMessage)
router.route("/stop/reminders/:id").post(isAuthenticatedUser, StopReminder)
router.route("/stop/single/reminders/:id").post(isAuthenticatedUser, StopSingleContactReport)
router.route("/pagination/reminders").get(isAuthenticatedUser, GetPaginatedContactReports)
router.route("/filter/reminders").get(isAuthenticatedUser, SearchContactReport)
router.route("/download/reports/reminders").get(isAuthenticatedUser, DownloadContactReports)
export default router
