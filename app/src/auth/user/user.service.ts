import { User } from "./user.model";
import { UserModel } from "@shoppingapp/common";
import { AuthDto } from "../dtos/auth.dto";

export class UserService {
  constructor(public userModel: UserModel) {}

  async create(authDto: AuthDto) {
    const user = new this.userModel({
      email: authDto.email,
      password: authDto.password,
    });

    return await user.save();
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
}

export const userService = new UserService(User);
