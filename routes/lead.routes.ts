import express from "express";
import { BulkLeadUpdateFromExcel, ConvertCustomer, CreateLead, DeleteLead, FuzzySearchCustomers, FuzzySearchLeads, GetCustomers, GetLeads, NewRemark, UpdateLead, GetUpdatableLeadFields, UpdateLeadFields, BackUpAllLeads,  CreateReferParty, UpdateReferParty, DeleteReferParty, ReferLead, RemoveLeadReferrals, FuzzySearchUseLessLeads, GetUselessLeads, BulkDeleteUselessLeads, ToogleUseless, FuzzySearchRefers, GetRefers, GetPaginatedRefers } from "../controllers/lead.controller";
import { isAdmin, isAuthenticatedUser } from "../middlewares/auth.middleware";
import { upload } from "./user.routes";

const router = express.Router()
router.route("/useless/leads")
    .get(isAuthenticatedUser, GetUselessLeads)
router.route("/leads")
    .get(isAuthenticatedUser, GetLeads)
    .post(isAuthenticatedUser, upload.single('visiting_card'), CreateLead)
router.route("/customers").get(isAuthenticatedUser, GetCustomers)
    .post(isAuthenticatedUser, upload.single('visiting_card'), CreateLead)
router.route("/leads/:id")
    .put(isAuthenticatedUser, upload.single('visiting_card'), UpdateLead)
    .patch(isAuthenticatedUser, ConvertCustomer)
    .delete(isAuthenticatedUser, isAdmin, DeleteLead)

router.route("/toogle/useless/:id").patch(isAuthenticatedUser, isAdmin, ToogleUseless)
router.route("/update/leads/bulk").put(isAuthenticatedUser, upload.single('file'), BulkLeadUpdateFromExcel)
router.route("/remarks/leads/:id").patch(isAuthenticatedUser, NewRemark)
router.route("/search/leads").get(isAuthenticatedUser, FuzzySearchLeads)
router.route("/search/leads/useless").get(isAuthenticatedUser, FuzzySearchUseLessLeads)
router.route("/search/customers").get(isAuthenticatedUser, FuzzySearchCustomers)
router.route("/fields/lead/update").put(isAuthenticatedUser, isAdmin, UpdateLeadFields)
router.route("/lead-updatable-fields").get(isAuthenticatedUser, isAdmin, GetUpdatableLeadFields)
router.route("/backup/leads").get(isAuthenticatedUser, isAdmin, BackUpAllLeads)
router.route("/refers/leads/:id").post(isAuthenticatedUser, ReferLead)
router.route("/refers/leads/:id").patch(isAuthenticatedUser, RemoveLeadReferrals)
router.route("/refers").get(isAuthenticatedUser, GetRefers)
router.route("/refers/paginated").get(isAuthenticatedUser, GetPaginatedRefers)
router.route("/search/refers").get(isAuthenticatedUser, FuzzySearchRefers)
router.route("/refers").post(isAuthenticatedUser, CreateReferParty)
router.route("/refers/:id").put(isAuthenticatedUser, UpdateReferParty)
router.route("/refers/:id").delete(isAuthenticatedUser, DeleteReferParty)
router.route("/bulk/leads/delete").post(isAuthenticatedUser, BulkDeleteUselessLeads)

export default router