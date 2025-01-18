import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.services";
import { userValidationSchema } from "../utils/validators";
import { hashPassword } from "../utils/password.utils";
import errorHandler, { catchAsyncError } from "../utils/errorhandler.utils";

export class userController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public createUser = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const { error } = userValidationSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const errorMessage = error.details.map((err) => err.message).join(", ");
        return next(
          new errorHandler({
            message: errorMessage,
            statusCode: 400,
          })
        );
      }

      const { email, password } = req.body;

      const userExists = await this.userService.GetUserByEmail(email);

      if (userExists) {
        return next(
          new errorHandler({
            message: "User with this account already exists",
            statusCode: 401,
          })
        );
      }

      let hashedPwd = "";
      hashedPwd = await hashPassword(password);
      req.body.password = hashedPwd;

      const user = await this.userService.CreateUser(req.body);

      if (!user || !user._id) {
        return next(
          new errorHandler({
            message: "Failed to create user",
            statusCode: 500,
          })
        );
      }

      res.status(201).json({ user });
    }
  );

  public getUsers = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const users = await this.userService.GetAllUsers();
      res.status(200).json({ users });
    }
  );

  public getUserById = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id;
      const user = await this.userService.GetUserById(userId);

      if (!user) {
        return next(
          new errorHandler({
            message: "User not found",
            statusCode: 404,
          })
        );
      }

      res.status(200).json({ user });
    }
  );

  public updateUser = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id;
      const updateData = req.body;

      const { error } = userValidationSchema.validate(updateData, {
        abortEarly: false,
      });

      if (error) {
        const errorMessage = error.details.map((err) => err.message).join(", ");
        return next(
          new errorHandler({
            message: errorMessage,
            statusCode: 400,
          })
        );
      }

      if (updateData.password) {
        updateData.password = await hashPassword(updateData.password);
      }

      const updatedUser = await this.userService.UpdateUser(userId, updateData);

      if (!updatedUser) {
        return next(
          new errorHandler({
            message: "User not found",
            statusCode: 404,
          })
        );
      }

      res.status(200).json({ user: updatedUser });
    }
  );

  public deleteUser = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id;
      const deletedUser = await this.userService.DeleteUser(userId);

      if (!deletedUser) {
        return next(
          new errorHandler({
            message: "User not found",
            statusCode: 404,
          })
        );
      }

      res.status(200).send("deleted successfully");
    }
  );
}
