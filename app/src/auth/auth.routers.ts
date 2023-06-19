import { Router, Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { currentUser } from "@shoppingapp/common";

const router = Router();

router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const jwt = await authService.signup({ email, password }, next);

    req.session = { jwt };

    res.status(201).send({ message: "User created" });
  }
);

router.post(
  "/signin",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const jwt = await authService.signin({ email, password }, next);

    req.session = { jwt };
    res.status(200).send({ message: "User signed in", jwt });
  }
);

router.get(
  "/current-uer",
  currentUser(process.env.JWT_KEY!),
  (req: Request, res: Response) => {
    res.status(200).send({ currentUser: req.currentUser || null });
  }
);

export { router as authRouter };
