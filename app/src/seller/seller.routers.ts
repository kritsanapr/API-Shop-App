import { Router, Request, Response, NextFunction } from "express";
import { BadRequestError, CustomError, Uploader, UploaderMiddlewareOptions, requireAuth } from "@shoppingapp/common";
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

router.post("/product/:id/update", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, price } = req.body;
    const result = sellerService.updateProduct({ title, price, productId: id, userId: req.currentUser!.userId })
    if (result instanceof CustomError) return next(result);
    res.status(200).send(result);
})

router.delete("/product/:id/delete", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = sellerService.deleteProduct({ productId: id, userId: req.currentUser!.userId })
    if (result instanceof CustomError) return next(result);

    res.status(200).send(true);
})

router.post("/product/:id/add-images", requireAuth, uploadMultipleFiles, async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!req.files) return next(new BadRequestError("images are required | you must provide at least one image"))

    if (req.uploaderError) return next(new BadRequestError(req.uploaderError.message))

    const result = await sellerService.addProductImages({ productId: id, userId: req.currentUser!.userId, files: req.files })
    if (result instanceof CustomError) return next(result);

    res.status(200).send(result);
})

router.post("/product/:id/delete-images", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { imagesIds } = req.body;
    const result = await sellerService.deleteProductImages({ productId: id, userId: req.currentUser!.userId, imagesId: imagesIds })
    if (result instanceof CustomError) return next(result);

    res.status(200).send(result);
})

export { router as sellerRouter }