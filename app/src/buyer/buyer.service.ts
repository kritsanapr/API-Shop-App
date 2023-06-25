import { ProductService, productService } from "src/seller/product/product.service";
import { CartService, cartService } from "./cart/cart.service";
import { AddProductToCartDto, UpdateCartProducQuantitytDto } from "./cart/dtos/cart.dto";
import { BadRequestError } from "@shoppingapp/common";

export class BuyerService {
    constructor(public cartService: CartService, public productService: ProductService) { }

    async addProductToCart(addProductToCart: AddProductToCartDto) {
        const product = await this.productService.getOneById(addProductToCart.productId)

        if (!product) return new BadRequestError('Product not found!');

        return await this.cartService.addProduct(addProductToCart, product);
    }


    async updateCartProductQuantity(updateCartProducQuatitytDto: UpdateCartProducQuantitytDto) {
        const { productId, cartId } = updateCartProducQuatitytDto
        const cartProduct = await this.cartService.getCartProductById(productId, cartId)
        if (!cartProduct) return new BadRequestError('product not found in cart')

        return await this.cartService.updateProductQuantity(updateCartProducQuatitytDto)
    }
}

export const buyerService = new BuyerService(cartService, productService)