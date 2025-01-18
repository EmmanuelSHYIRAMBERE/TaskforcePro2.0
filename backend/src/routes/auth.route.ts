import express from "express";
import AuthController from "../controllers/auth.controller";
import AuthService from "../services/auth.service";

const authRouter = express.Router();

const authService = new AuthService();
const authController = new AuthController(authService);

// In your routes file
authRouter.post("/login", authController.logIn);
authRouter.post("/change-password", authController.changePassword);

export default authRouter;
