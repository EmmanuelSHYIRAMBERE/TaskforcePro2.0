import { IUser, User } from "../models/user.model.ts";

export class UserService {
  public async CreateUser(userData: IUser) {
    const { email } = userData;

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const newUser = await User.create(userData);
    return newUser;
  }

  public async GetUserByEmail(email: string) {
    const user = await User.findOne({ email: email });
    return user;
  }

  public async GetAllUsers() {
    const allUsers = await User.find({});
    return allUsers;
  }

  public async GetUserById(userId: string) {
    const user = await User.findById(userId);
    return user;
  }

  public async UpdateUser(userId: string, updateData: Partial<IUser>) {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    return updatedUser;
  }

  public async DeleteUser(userId: string) {
    const deletedUser = await User.findByIdAndDelete(userId);
    return deletedUser;
  }
}
