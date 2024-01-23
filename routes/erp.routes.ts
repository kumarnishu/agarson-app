import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { BulkCreateBillsAgingReportFromExcel, BulkCreateStateFromExcel, BulkPendingOrderReportFromExcel, CreateState, GetAllStates, GetBillsAgingReports, GetPendingOrderReports, UpdateState } from "../controllers/erp.controller";
import { upload } from "./user.routes";


const router = express.Router()
router.route("/states").get(isAuthenticatedUser, GetAllStates)
router.route("/states").post(isAuthenticatedUser, CreateState)
router.route("/states/:id").put(isAuthenticatedUser, UpdateState)
router.route("/states").put(isAuthenticatedUser, upload.single('file'), BulkCreateStateFromExcel)
router.route("/reports/pending/orders").get(isAuthenticatedUser, GetPendingOrderReports)
router.route("/reports/pending/orders").put(isAuthenticatedUser, upload.single('file'), BulkPendingOrderReportFromExcel)
router.route("/reports/bills/aging").get(isAuthenticatedUser, GetBillsAgingReports)
router.route("/reports/bills/aging").put(isAuthenticatedUser, upload.single('file'), BulkCreateBillsAgingReportFromExcel)
export default router