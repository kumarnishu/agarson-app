import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { AssignErpStatesToUsers, BulkCreateAndUpdateErpStatesFromExcel, BulkCreateBillsAgingReportFromExcel, BulkCreateClientSaleReportFromExcel, BulkCreateClientSaleReportFromExcelForLastYear, BulkCreatePartyTargetReportFromExcel,  BulkPendingOrderReportFromExcel, CreateState, DeleteErpState, GetAllStates, GetBillsAgingReports, GetClientSaleReports, GetClientSaleReportsForLastYear, GetPartyTargetReports, GetPendingOrderReports, GetSaleAnalysisReport, UpdateState } from "../controllers/erp.controller";
import { upload } from "./user.routes";

const router = express.Router()
router.route("/states").get(isAuthenticatedUser, GetAllStates)
router.route("/states").post(isAuthenticatedUser, CreateState)
router.route("/states/:id").put(isAuthenticatedUser, UpdateState)
    .delete(isAuthenticatedUser, DeleteErpState)
router.route("/states").put(isAuthenticatedUser, upload.single('file'), BulkCreateAndUpdateErpStatesFromExcel)
router.route("/reports/pending/orders").get(isAuthenticatedUser, GetPendingOrderReports)
router.route("/reports/pending/orders").put(isAuthenticatedUser, upload.single('file'), BulkPendingOrderReportFromExcel)
router.route("/reports/partytarget").get(isAuthenticatedUser, GetPartyTargetReports)
router.route("/reports/saleanalysis/:month").get(isAuthenticatedUser, GetSaleAnalysisReport)
router.route("/reports/partytarget").put(isAuthenticatedUser, upload.single('file'), BulkCreatePartyTargetReportFromExcel)
router.route("/reports/bills/aging").get(isAuthenticatedUser, GetBillsAgingReports)
router.route("/reports/bills/aging").put(isAuthenticatedUser, upload.single('file'), BulkCreateBillsAgingReportFromExcel)
router.route("/reports/client/sale").get(isAuthenticatedUser, GetClientSaleReports)
router.route("/reports/client/sale/lastyear").get(isAuthenticatedUser, GetClientSaleReportsForLastYear)
router.route("/reports/client/sale").put(isAuthenticatedUser, upload.single('file'), BulkCreateClientSaleReportFromExcel),
router.route("/reports/client/sale/lastyear").put(isAuthenticatedUser, upload.single('file'), BulkCreateClientSaleReportFromExcelForLastYear)
router.route("/bulk/assign/states").patch(isAuthenticatedUser, AssignErpStatesToUsers)

export default router