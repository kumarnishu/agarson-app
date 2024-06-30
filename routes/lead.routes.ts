import express from "express";
import { BulkLeadUpdateFromExcel, CreateLead, DeleteLead,  FuzzySearchLeads, GetLeads, NewRemark, UpdateLead, BackUpAllLeads, CreateReferParty, UpdateReferParty, DeleteReferParty, ReferLead, RemoveLeadReferrals,  FuzzySearchRefers, GetRefers, GetPaginatedRefers,  GetReminderRemarks, UpdateRemark, DeleteRemark, GetRemarks} from "../controllers/lead.controller";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { upload } from "./user.routes";

const router = express.Router()

router.route("/leads")
    .get(isAuthenticatedUser, GetLeads)
    .post(isAuthenticatedUser, upload.single('visiting_card'), CreateLead)

router.route("/remarks")
    .get(isAuthenticatedUser, GetRemarks)

router.route("/leads/:id")
    .put(isAuthenticatedUser, upload.single('visiting_card'), UpdateLead)
    .delete(isAuthenticatedUser, DeleteLead)



router.route("/update/leads/bulk").put(isAuthenticatedUser, upload.single('file'), BulkLeadUpdateFromExcel)
router.route("/remarks/leads/:id").patch(isAuthenticatedUser, NewRemark)
router.route("/remarks/:id").put(isAuthenticatedUser, UpdateRemark)
router.route("/remarks/:id").delete(isAuthenticatedUser, DeleteRemark)
router.route("/search/leads").get(isAuthenticatedUser, FuzzySearchLeads)
router.route("/backup/leads").get(isAuthenticatedUser, BackUpAllLeads)
router.route("/refers/leads/:id").post(isAuthenticatedUser, ReferLead)
router.route("/refers/leads/:id").patch(isAuthenticatedUser, RemoveLeadReferrals)
router.route("/refers").get(isAuthenticatedUser, GetRefers)
router.route("/refers/paginated").get(isAuthenticatedUser, GetPaginatedRefers)
router.route("/search/refers").get(isAuthenticatedUser, FuzzySearchRefers)
router.route("/refers").post(isAuthenticatedUser, CreateReferParty)
router.route("/refers/:id").put(isAuthenticatedUser, UpdateReferParty)
router.route("/refers/:id").delete(isAuthenticatedUser, DeleteReferParty)
router.route("/reminder/remarks").get(isAuthenticatedUser, GetReminderRemarks)

export default router