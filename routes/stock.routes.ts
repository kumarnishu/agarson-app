import express from "express"
import { isAuthenticatedUser } from "../middlewares/auth.middleware"
import { upload } from "./user.routes"
import { BulkUploadStockFromExcel } from "../controllers/stock.controller"


const router = express.Router()


// router.route("/articles").get(isAuthenticatedUser, GetArticles)
// router.route("/articles/:id").put(isAuthenticatedUser, upload.single('visiting_card'), UpdateArticle)
// router.route("/articles/:id").patch(isAuthenticatedUser, CloseArticle)

// router.route("/stocks").get(isAuthenticatedUser, GetStocks)
// router.route("/stocks/:id").get(isAuthenticatedUser, GetArticleStocks)
// router.route("/stocks/:id").put(isAuthenticatedUser, UpdateStock)
// router.route("/stocks/:id").patch(isAuthenticatedUser, CloseStock)
router.route("/stock/upload/bulk").post(isAuthenticatedUser, upload.single('file'), BulkUploadStockFromExcel)

export default router
