import { ProductService, productService } from './product/product.service';
import { CreateProductDto, UpdateProductDto, DeleteProductDto } from './dtos/product.dto';
import { BadRequestError, NotAuthorizedError } from '@shoppingapp/common';
export class SellerService {
    constructor(public productService: ProductService) { }


    async addProduct(createProductDto: CreateProductDto) {
        return await this.productService.create(createProductDto);
    }

    async updateProduct(updateProductDto: UpdateProductDto) {
        const product = await this.productService.getOneById(updateProductDto.productId);
        if (!product) throw new BadRequestError('Product not found');
        if (product.user.toString() !== updateProductDto.userId) {
            throw new NotAuthorizedError();
        }
        return await this.productService.updateProduct(updateProductDto);

    }

    async deleteProduct(deleteProductDto: DeleteProductDto) {
        if (!deleteProductDto.productId) throw new BadRequestError('Product id is required');
        const product = await this.productService.getOneById(deleteProductDto.productId);
        if (!product) throw new BadRequestError('Product not found');
        if (product.user.toString() !== deleteProductDto.userId) {
            throw new NotAuthorizedError();
        }
        return await this.productService.deleteProduct(deleteProductDto);
    }
}

export const sellerService = new SellerService(productService);
