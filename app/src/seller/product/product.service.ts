import { ProductModel } from "@shoppingapp/common";
import { Product } from "./product.model";

export class ProductService {
    constructor(public productModel: ProductModel) { }

    async create(user: string, title: string, price: number, images: string[]) {

    }
}


export const productService = new ProductService(Product);