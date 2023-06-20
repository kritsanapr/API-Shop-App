import { Router, Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { BadRequestError, currentUser } from "@shoppingapp/common";

const router = Router();

router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const result = await authService.signup({ email, password });

    if (typeof result === "object" && result.message)
      return next(new BadRequestError(result.message));

    req.session = { jwt: result.jwt };

    res.status(201).send({ message: "User created" });
  }
);

router.post(
  "/signin",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const result = await authService.signin({ email, password });
    if (typeof result === "object" && result.message)
      return next(new BadRequestError(result.message));

    req.session = { jwt: result.jwt };
    res.status(200).send({ message: "User signed in", jwt: result.jwt });
  }
);

router.get(
  "/current-user",
  currentUser(process.env.JWT_KEY!),
  (req: Request, res: Response) => {
    res.status(200).send({ currentUser: req.currentUser || null });
  }
);

export { router as authRouter };
