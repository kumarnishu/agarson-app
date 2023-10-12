import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { DeleteBroadcast, GetBroadcasts, CreateBroadcastByTemplate, StartBroadcastWithTemplate, ResetBroadcast, UpdateBroadcastByTemplate, CreateBroadcastByMessage, UpdateBroadcastByMessage, GetBroadcastReports, StartBroadcastWithMessage, StopBroadcast, GetPaginatedBroadcastReports, SearchBroadcastReportByMobile, DownloadBroadcastReports, StopSingleBroadcastReport, SetDailyCount } from "../controllers/broadcast.controller";
import { upload } from "./user.routes";

const router = express.Router()

router.route("/broadcasts").post(isAuthenticatedUser, upload.none(), CreateBroadcastByTemplate)
router.route("/new/message/broadcasts").post(isAuthenticatedUser, upload.single("media"), CreateBroadcastByMessage)
router.route("/broadcasts").get(isAuthenticatedUser, GetBroadcasts)
router.route("/update/message/broadcasts/:id").put(isAuthenticatedUser, upload.single("media"), UpdateBroadcastByMessage)
router.route("/broadcasts/:id").put(isAuthenticatedUser, upload.none(), UpdateBroadcastByTemplate)
router.route("/broadcasts/:id").delete(isAuthenticatedUser, DeleteBroadcast)
router.route("/reports/broadcasts/:id").get(isAuthenticatedUser, GetBroadcastReports)
router.route("/reset/broadcasts/:id").post(isAuthenticatedUser, ResetBroadcast)
router.route("/start/broadcasts/:id").post(isAuthenticatedUser, upload.none(), StartBroadcastWithTemplate)
router.route("/start/message/broadcasts/:id").post(isAuthenticatedUser, upload.none(), StartBroadcastWithMessage)
router.route("/stop/broadcasts/:id").post(isAuthenticatedUser, StopBroadcast)
router.route("/stop/single/broadcasts/:id").post(isAuthenticatedUser, StopSingleBroadcastReport)
router.route("/pagination/broadcasts").get(isAuthenticatedUser, GetPaginatedBroadcastReports)
router.route("/filter/broadcasts").get(isAuthenticatedUser, SearchBroadcastReportByMobile)
router.route("/download/reports/broadcasts").get(isAuthenticatedUser, DownloadBroadcastReports)
router.route("/set/count/broadcasts/:id").post(isAuthenticatedUser, upload.none(), SetDailyCount)

export default router
