import { ProductService, productService } from './product/product.service';
import { CreateProductDto } from './dtos/product.dto';
export class SellerService {
    constructor(public productService: ProductService) { }

    async addProduct(createProductDto: CreateProductDto) {
        return await this.productService.create(createProductDto);
    }
}

export const sellerService = new SellerService(productService);
