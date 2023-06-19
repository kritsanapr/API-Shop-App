import { AuthenticationService, BadRequestError } from "@shoppingapp/common";
import { CreateUserDto } from "./dtos/auth.dto";
import { UserService, userService } from "./user/user.service";
import { NextFunction } from "express";

export class AuthService {
  constructor(
    public userService: UserService,
    public authenticationService: AuthenticationService
  ) {}

  async signup(createUserDto: CreateUserDto, errCallback: NextFunction) {
    const existingUser = await this.userService.findOneByEmail(
      createUserDto.email
    );

    if (existingUser)
      return errCallback(
        new BadRequestError("A User with that email already exists")
      );

    const user = await this.userService.create(createUserDto);
    const jwt = this.authenticationService.generateJwt(
      {
        email: createUserDto.email,
        userId: user.id,
      },
      process.env.JWT_KEY!
    );

    return jwt;
  }

  async signin(email: string, password: string) {
    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      return;
    }
  }
}

export const authService = new AuthService(userService);
