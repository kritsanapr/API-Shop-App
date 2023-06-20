import { AuthenticationService, BadRequestError } from "@shoppingapp/common";
import { AuthDto } from "./dtos/auth.dto";
import { UserService, userService } from "./user/user.service";
import { NextFunction } from "express";

export class AuthService {
  constructor(
    public userService: UserService,
    public authenticationService: AuthenticationService
  ) {}

  async signup(authDto: AuthDto) {
    const existingUser = await this.userService.findOneByEmail(authDto.email);

    if (existingUser)
      return { message: "A User with that email already exists" };

    const user = await this.userService.create(authDto);
    const jwt = this.authenticationService.generateJwt(
      {
        email: authDto.email,
        userId: user.id,
      },
      process.env.JWT_KEY!
    );

    return { jwt };
  }

  async signin(authDto: AuthDto) {
    const user = await this.userService.findOneByEmail(authDto.email);

    if (!user) return { message: "Invalid credentials" };

    const samePwd = this.authenticationService.pwdCompare(
      user.password,
      authDto.password
    );
    if (!samePwd) return { message: "Password is incorrect" };

    const jwt = this.authenticationService.generateJwt(
      {
        email: authDto.email,
        userId: user.id,
      },
      process.env.JWT_KEY!
    );

    return { jwt };
  }
}

export const authService = new AuthService(
  userService,
  new AuthenticationService()
);
