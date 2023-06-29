import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

import { Application } from "express";
import mongoose from "mongoose";
import { errorHandler } from "@shoppingapp/common";
import { currentUser } from "@shoppingapp/common";
import { authRouter } from "./auth/auth.routers";
import { sellerRouter } from "./seller/seller.routers";

export class AppModule {
  constructor(public app: Application) {
    app.set("trust proxy", true);
    app.use(cors());
    app.use(express.json());
    app.use(json());
    app.use(express.urlencoded({ extended: false }));
    app.use(
      cookieSession({
        signed: false,
        secure: false,
      })
    );



    Object.setPrototypeOf(this, AppModule.prototype);
  }

  async start() {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI must be defined");
    }

    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY must be defined");
    }

    if (!process.env.STRIPE_KEY) {
      throw new Error("STRIPE_KEY must be defined");
    }

    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Connected to MongoDB");
    } catch (err) {
      console.log(err);
      throw new Error("Database connection failed");
    }


    this.app.use(currentUser(process.env.JWT_KEY!))
    this.app.use(authRouter);
    this.app.use(sellerRouter);
    this.app.use(errorHandler);

    this.app.listen(process.env.PORT || 8080, () =>
      console.log(`Listening on port http://localhost:${process.env.PORT || 8080}!`)
    );
  }
}
