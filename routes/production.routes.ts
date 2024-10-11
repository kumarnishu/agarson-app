import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { upload } from "./user.routes";
import { BulkUploadArticle, BulkUploadDye, BulkUploadMachine, CreateArticle, CreateDye, CreateDyeLocation,  CreateMachine, CreateProduction, CreateShoeWeight, CreateSoleThickness, CreateSpareDye, DeleteDyeLocation,  DeleteProduction, DeleteShoeWeight, DeleteSoleThickness, DeleteSpareDye, GetAllDyeLocations, GetArticles, GetCategoryWiseProductionReports, GetDyeById, GetDyes,  GetMachineCategories, GetMachines, GetMachineWiseProductionReports,  GetMyTodayProductions, GetMyTodayShoeWeights, GetMyTodaySoleThickness, GetMyTodaySpareDye, GetProductions, GetShoeWeightDifferenceReports, GetShoeWeights, GetSoleThickness, GetSpareDyes, GetThekedarWiseProductionReports, ToogleArticle, ToogleDye, ToogleMachine, UpdateArticle, UpdateDye, UpdateDyeLocation, UpdateMachine,  UpdateProduction, UpdateShoeWeight1, UpdateShoeWeight2, UpdateShoeWeight3, UpdateSoleThickness, ValidateShoeWeight } from "../controllers/production.controller";

const router = express.Router()

router.route("/articles").get(isAuthenticatedUser, GetArticles)
    .post(isAuthenticatedUser, CreateArticle)
router.put("/articles/:id", isAuthenticatedUser, UpdateArticle)
router.patch("/articles/toogle/:id", isAuthenticatedUser, ToogleArticle)
router.put("/articles/upload/bulk", isAuthenticatedUser, upload.single('file'), BulkUploadArticle)
router.route("/machines").get(isAuthenticatedUser, GetMachines)
    .post(isAuthenticatedUser, CreateMachine)
router.put("/machines/:id", isAuthenticatedUser, UpdateMachine)
router.patch("/machines/toogle/:id", isAuthenticatedUser, ToogleMachine)
router.put("/machines/upload/bulk", isAuthenticatedUser, upload.single('file'), BulkUploadMachine)
router.route("/dyes").get(isAuthenticatedUser, GetDyes)
    .post(isAuthenticatedUser, CreateDye)
router.put("/dyes/:id", isAuthenticatedUser, UpdateDye)
router.get("/dyes/:id", isAuthenticatedUser, GetDyeById)
router.patch("/dyes/toogle/:id", isAuthenticatedUser, ToogleDye)
router.put("/dyes/upload/bulk", isAuthenticatedUser, upload.single('file'), BulkUploadDye)
router.route("/productions/me").get(isAuthenticatedUser, GetMyTodayProductions)
router.route("/productions").get(isAuthenticatedUser, GetProductions)
    .post(isAuthenticatedUser, CreateProduction)
router.route("/productions/:id").put(isAuthenticatedUser, UpdateProduction)
    .delete(isAuthenticatedUser, DeleteProduction)
router.route("/machine/categories").get(isAuthenticatedUser, GetMachineCategories)
router.route("/weights/me").get(isAuthenticatedUser, GetMyTodayShoeWeights),
    router.route("/weights").get(isAuthenticatedUser, GetShoeWeights)
        .post(isAuthenticatedUser, upload.single('media'), CreateShoeWeight)
router.route("/weights/:id").put(isAuthenticatedUser, upload.single('media'), UpdateShoeWeight1).delete(isAuthenticatedUser, DeleteShoeWeight),
    router.put("/weights2/:id", isAuthenticatedUser, upload.single('media'), UpdateShoeWeight2),
    router.put("/weights3/:id", isAuthenticatedUser, upload.single('media'), UpdateShoeWeight3),
    router.patch("/weights/validate/:id", isAuthenticatedUser, ValidateShoeWeight)
router.route("/dye/spares/me").get(isAuthenticatedUser, GetMyTodaySpareDye),
    router.route("/dye/spares").get(isAuthenticatedUser, GetSpareDyes).post(isAuthenticatedUser, CreateSpareDye)
router.route("/dye/spares/:id").delete(isAuthenticatedUser, DeleteSpareDye),
    router.route("/dye/locations").get(isAuthenticatedUser, GetAllDyeLocations).post(isAuthenticatedUser, CreateDyeLocation),
    router.route("/dye/locations/:id").put(isAuthenticatedUser, UpdateDyeLocation).delete(isAuthenticatedUser, DeleteDyeLocation)

router.route("/production/categorywise").get(isAuthenticatedUser, GetCategoryWiseProductionReports)
router.route("/production/machinewise").get(isAuthenticatedUser, GetMachineWiseProductionReports)
router.route("/production/thekedarwise").get(isAuthenticatedUser, GetThekedarWiseProductionReports)
router.route("/shoeweight/diffreports").get(isAuthenticatedUser, GetShoeWeightDifferenceReports)
router.route("/solethickness").get(isAuthenticatedUser, GetSoleThickness).post(isAuthenticatedUser, CreateSoleThickness)
router.route("/solethickness/:id").get(isAuthenticatedUser, DeleteSoleThickness).put(isAuthenticatedUser, UpdateSoleThickness).delete(isAuthenticatedUser,DeleteSoleThickness)
router.route("/solethickness/me").get(isAuthenticatedUser, GetMyTodaySoleThickness)
export default router