import express from "express";
import { userController } from "../controllers/user.controller";
import { adminauthorization } from "../middlewares/adminverification.middleware";
import {
  refreshAccessToken,
  verifyAccessToken,
} from "../middlewares/tokenverification.middleware";

const userRouter = express.Router();

const userControllerInstance = new userController();

userRouter.post("/", userControllerInstance.createUser);

userRouter.get(
  "/",
  verifyAccessToken,
  adminauthorization,
  userControllerInstance.getUsers
);
userRouter.get("/:id", verifyAccessToken, userControllerInstance.getUserById);
userRouter.put("/:id", verifyAccessToken, userControllerInstance.updateUser);
userRouter.delete("/:id", verifyAccessToken, userControllerInstance.deleteUser);

export default userRouter;
