import bodyParser, { json, urlencoded } from "body-parser";
import cookieSession from "cookie-session";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

import { Application } from "express";

export class AppModule {
  constructor(public app: Application) {
    app.set("trust proxy", true);
    app.use(cors());
    app.use(bodyParser.json());
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(
      cookieSession({
        signed: false,
        secure: false,
      })
    );
  }
}
