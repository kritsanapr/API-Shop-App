import { ProductModel } from "@shoppingapp/common";
import { Product } from "./product.model";
import { CreateProductDto } from '../dtos/product.dto';
import fs from 'fs';
import path from 'path';

export class ProductService {
    constructor(public productModel: ProductModel) { }

    async create(createProductDto: CreateProductDto) {
        const product = new this.productModel({
            title: createProductDto.title,
            price: createProductDto.price,
            user: createProductDto.userId,
            images: [{
                src: ''
            }]
        });
        return product.save();
    }

    generateBase64Url(contentType: String, buffer: Buffer) {
        return `data:${contentType};base64,${buffer.toString('base64')}`
    }

    generateProductImages(files: CreateProductDto['files']): Array<{ src: string }> {
        let images: Array<Express.Multer.File>;

        if (typeof files === 'object') {
            images = Object.values(files).flat();
        } else {
            images = files ? [...files] : [];
        }

        return images.map((file) => {
            let srcObj = { src: this.generateBase64Url(file.mimetype, file.buffer) };
            fs.unlink(path.join('upload/' + file.filename), () => { })
            return srcObj;
        })
    }
}


export const productService = new ProductService(Product);