import express from "express";
import { CategoryController } from "../controllers/category.controller";
import { verifyAccessToken } from "../middlewares/tokenverification.middleware";

const categoryRouter = express.Router();
const categoryController = new CategoryController();

categoryRouter.use(verifyAccessToken);

categoryRouter
  .route("/")
  .post(categoryController.createCategory)
  .get(categoryController.getCategories);

categoryRouter.get("/hierarchy", categoryController.getCategoryHierarchy);

categoryRouter
  .route("/:id")
  .get(categoryController.getCategoryById)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

export default categoryRouter;
