import express from "express";
import { BulkLeadUpdateFromExcel, CreateLead, DeleteLead, FuzzySearchLeads, GetLeads, NewRemark, UpdateLead, BackUpAllLeads, CreateReferParty, UpdateReferParty, DeleteReferParty, ReferLead, RemoveLeadReferral, FuzzySearchRefers, GetRefers, GetPaginatedRefers, GetReminderRemarks, UpdateRemark, DeleteRemark, GetRemarks, GetAllCRMStates, CreateCRMState, UpdateCRMState, DeleteCRMState, BulkCreateAndUpdateCRMStatesFromExcel, BulkReferUpdateFromExcel, GetAllCRMCities, UpdateCRMCity, DeleteCRMCity, BulkCreateAndUpdateCRMCityFromExcel, CreateCRMLeadTypes, GetAllCRMLeadTypes, DeleteCRMLeadType, UpdateCRMLeadTypes, GetAllCRMLeadStages, CreateCRMLeadStages, UpdateCRMLeadStages, DeleteCRMLeadStage, GetAllCRMLeadSources, CreateCRMLeadSource, UpdateCRMLeadSource, DeleteCRMLeadSource, AssignCRMStatesToUsers, ConvertLeadToRefer, BulkDeleteUselessLeads, FindUnknownCrmSates, FindUnknownCrmStages, CreateCRMCity, AssignCRMCitiesToUsers, FindUnknownCrmCities, AssignedReferrals, FuzzySearchOkOnlyLeads, GetNewRefers, GetAssignedRefers } from "../controllers/lead.controller";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { upload } from "./user.routes";

const router = express.Router()

//states
router.route("/crm/states").get(isAuthenticatedUser, GetAllCRMStates).post(isAuthenticatedUser, CreateCRMState),
    router.route("/crm/states/:id").put(isAuthenticatedUser, UpdateCRMState).delete(isAuthenticatedUser, DeleteCRMState),
    router.route("/crm/states/excel/createorupdate").put(isAuthenticatedUser, upload.single('file'), BulkCreateAndUpdateCRMStatesFromExcel)
router.patch("/crm/states/assign", isAuthenticatedUser, AssignCRMStatesToUsers)

//lead types

router.route("/crm/leadtypes").get(isAuthenticatedUser, GetAllCRMLeadTypes).post(isAuthenticatedUser, CreateCRMLeadTypes),
    router.route("/crm/leadtypes/:id").put(isAuthenticatedUser, UpdateCRMLeadTypes).delete(isAuthenticatedUser, DeleteCRMLeadType)

//lead stages

router.route("/crm/stages").get(isAuthenticatedUser, GetAllCRMLeadStages).post(isAuthenticatedUser, CreateCRMLeadStages),
    router.route("/crm/stages/:id").put(isAuthenticatedUser, UpdateCRMLeadStages).delete(isAuthenticatedUser, DeleteCRMLeadStage)

//lead sources

router.route("/crm/sources").get(isAuthenticatedUser, GetAllCRMLeadSources).post(isAuthenticatedUser, CreateCRMLeadSource),
    router.route("/crm/sources/:id").put(isAuthenticatedUser, UpdateCRMLeadSource).delete(isAuthenticatedUser, DeleteCRMLeadSource),

    //cities

    router.route("/crm/cities").get(isAuthenticatedUser, GetAllCRMCities).post(isAuthenticatedUser, CreateCRMCity)
router.route("/crm/cities/:id").put(isAuthenticatedUser, UpdateCRMCity).delete(isAuthenticatedUser, DeleteCRMCity),
    router.route("/crm/cities/excel/createorupdate/:state").put(isAuthenticatedUser, upload.single('file'), BulkCreateAndUpdateCRMCityFromExcel)
router.patch("/crm/cities/assign", isAuthenticatedUser, AssignCRMCitiesToUsers)
//leads
router.route("/leads").get(isAuthenticatedUser, GetLeads).post(isAuthenticatedUser, upload.single('visiting_card'), CreateLead)
router.route("/remarks").get(isAuthenticatedUser, GetRemarks)
router.route("/leads/:id").put(isAuthenticatedUser, upload.single('visiting_card'), UpdateLead).delete(isAuthenticatedUser, DeleteLead)
router.route("/update/leads/bulk").put(isAuthenticatedUser, upload.single('file'), BulkLeadUpdateFromExcel)
router.route("/remarks/leads/:id").patch(isAuthenticatedUser, NewRemark)
router.route("/remarks/:id").put(isAuthenticatedUser, UpdateRemark)
router.route("/remarks/:id").delete(isAuthenticatedUser, DeleteRemark)
router.route("/search/leads").get(isAuthenticatedUser, FuzzySearchLeads)
router.route("/search/leads/ok").get(isAuthenticatedUser, FuzzySearchOkOnlyLeads)

router.route("/backup/leads").get(isAuthenticatedUser, BackUpAllLeads)
router.patch("/leads/torefer/:id", isAuthenticatedUser, ConvertLeadToRefer)
router.post("/bulk/leads/delete/useless", isAuthenticatedUser, BulkDeleteUselessLeads)
router.route("/find/crm/states/unknown").post(isAuthenticatedUser, FindUnknownCrmSates);
router.route("/find/crm/stages/unknown").post(isAuthenticatedUser, FindUnknownCrmStages);
router.route("/find/crm/cities/unknown").post(isAuthenticatedUser, FindUnknownCrmCities);
router.get("/assigned/referrals/:id", isAuthenticatedUser, AssignedReferrals)


//refers
router.route("/refers/leads/:id").post(isAuthenticatedUser, ReferLead)
router.route("/refers/leads/:id").patch(isAuthenticatedUser, RemoveLeadReferral)
router.route("/refers").get(isAuthenticatedUser, GetRefers)
router.route("/refers/paginated").get(isAuthenticatedUser, GetPaginatedRefers)
router.route("/search/refers").get(isAuthenticatedUser, FuzzySearchRefers)
router.route("/refers").post(isAuthenticatedUser, upload.none(), CreateReferParty)
router.route("/refers/:id").put(isAuthenticatedUser, upload.none(), UpdateReferParty)
router.route("/refers/:id").delete(isAuthenticatedUser, DeleteReferParty)
router.route("/update/refers/bulk").put(isAuthenticatedUser, upload.single('file'), BulkReferUpdateFromExcel)

router.route("/reminder/remarks").get(isAuthenticatedUser, GetReminderRemarks)
router.route("/assigned/refers/report").get(isAuthenticatedUser, GetAssignedRefers)
router.route("/new/refers/report").get(isAuthenticatedUser, GetNewRefers)

export default router