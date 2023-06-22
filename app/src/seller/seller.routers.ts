import { Router, Request, Response, NextFunction } from "express";
import { BadRequestError, Uploader, UploaderMiddlewareOptions, requireAuth } from "@shoppingapp/common";
import { sellerService } from "./seller.service";

const uploader = new Uploader();
const middlewareOptions: UploaderMiddlewareOptions = {
    types: ["image/png", "image/jpg", "image/jpeg"],
    fieldName: "images"
}

const uploadMultipleFiles = uploader.uploadMultipleFiles(middlewareOptions);

const router = Router();

router.post("/product/new", requireAuth, uploadMultipleFiles, async (req: Request, res: Response, next: NextFunction) => {
    const { title, price } = req.body;

    if (!req.files) return next(new BadRequestError("images are required | you must provide at least one image"))

    if (req.uploaderError) return next(new BadRequestError(req.uploaderError.message))

    const product = sellerService.addProduct({ title, price, files: req.files, userId: req.currentUser!.userId })

    res.status(201).send(product);

})