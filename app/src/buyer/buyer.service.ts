import { ProductService, productService } from "src/seller/product/product.service";
import { CartService, cartService } from "./cart/cart.service";
import { AddProductToCartDto, RemoveProductFromCartDto, UpdateCartProducQuantitytDto } from "./cart/dtos/cart.dto";
import { BadRequestError, NotAuthorizedError } from "@shoppingapp/common";

export class BuyerService {
    constructor(public cartService: CartService, public productService: ProductService) { }

    async addProductToCart(addProductToCart: AddProductToCartDto) {
        const product = await this.productService.getOneById(addProductToCart.productId)
        if (!product) return new BadRequestError('Product not found!');

        const cart = await this.cartService.addProduct(addProductToCart, product);
        if (!cart) return new Error('could not update the cart')
        return cart;
    }


    async updateCartProductQuantity(updateCartProducQuatitytDto: UpdateCartProducQuantitytDto) {
        const { productId, cartId } = updateCartProducQuatitytDto
        const cartProduct = await this.cartService.getCartProductById(productId, cartId)
        if (!cartProduct) return new BadRequestError('product not found in cart')

        const cart = await this.cartService.updateProductQuantity(updateCartProducQuatitytDto)
        if (!cart) return new Error('could not update the cart')
        return cart;
    }

    async removeProductFromCart(removeProductFromCartDto: RemoveProductFromCartDto) {
        const { productId, cartId } = removeProductFromCartDto
        const cartProduct = await this.cartService.getCartProductById(productId, cartId)
        if (!cartProduct) return new BadRequestError('product not found in cart')

        const cart = await this.cartService.removeProductFromCart(removeProductFromCartDto)
        if (!cart) return new Error('could not delete the item');
        else
            return true
    }

    async getCart(cartId: string, userId: string) {
        const cart = await this.cartService.getCart(cartId)
        if (!cart) return new BadRequestError('cart not found')
        if (cart.user.toString() === userId) return new NotAuthorizedError()

        return cart
    }
}

export const buyerService = new BuyerService(cartService, productService)