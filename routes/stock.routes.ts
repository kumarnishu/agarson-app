import express from "express"
import { isAuthenticatedUser } from "../middlewares/auth.middleware"
import { upload } from "./user.routes"
import { ActivateArticle, ActivateStock, BulkUploadStockFromExcel, CreateArticle, CreateArticleStock, DeactivateArticle, DeactivateStock, FuzzySearchArticles, GetArticleStocks, GetArticles, GetStocks, UpdateArticle, UpdateArticleStock } from "../controllers/stock.controller"


const router = express.Router()


router.route("/articles").get(isAuthenticatedUser, GetArticles)
router.route("/articles").put(isAuthenticatedUser, upload.single('file'), CreateArticle)
router.route("/articles/search").get(isAuthenticatedUser, FuzzySearchArticles)

router.route("/articles/:id").put(isAuthenticatedUser, upload.single('file'), UpdateArticle)
router.route("/articles/activate:id").patch(isAuthenticatedUser, ActivateArticle)
router.route("/articles/deactivate:id").patch(isAuthenticatedUser, DeactivateArticle)

router.route("/stocks").get(isAuthenticatedUser, GetStocks)
router.route("/stocks/:id").get(isAuthenticatedUser, GetArticleStocks)
router.route("/stocks").put(isAuthenticatedUser, CreateArticleStock)
router.route("/stocks/:id").put(isAuthenticatedUser, UpdateArticleStock)
router.route("/stocks/activate/:id").patch(isAuthenticatedUser, ActivateStock)
router.route("/stocks/deactivate/:id").patch(isAuthenticatedUser, DeactivateStock)
router.route("/stock/upload/bulk").post(upload.single('file'), BulkUploadStockFromExcel)

export default router
