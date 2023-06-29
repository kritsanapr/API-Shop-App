import { ProductService, productService } from "src/seller/product/product.service";
import { CartService, cartService } from "./cart/cart.service";
import { AddProductToCartDto, RemoveProductFromCartDto, UpdateCartProducQuantitytDto } from "./cart/dtos/cart.dto";
import { BadRequestError, NotAuthorizedError } from "@shoppingapp/common";

import Stripe from "stripe"


export class BuyerService {
    constructor(
        public cartService: CartService,
        public productService: ProductService,
        public stripeService: Stripe) { }

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


    async checkout(userId: string, cardToken: string, userEmail: string) {
        const cart = await this.cartService.findOneByUserId(userId)
        if (!cart) return new BadRequestError('your cart is empty')
        if (cart.products.length === 0) return new BadRequestError('Your cart is empty')

        let customer_id: string;

        if (cart.customer_id) {
            customer_id = cart.customer_id
        } else {
            const { id } = await this.stripeService.customers.create({
                email: userEmail,
                source: cardToken,
            })
            customer_id = id;
            await cart.set({ customer_id }).save()
        }


        if (!customer_id) return new BadRequestError('could not process your payment')

        const charge = await this.stripeService.charges.create({
            amount: cart.totalPrice * 100,
            currency: 'usd',
            customer: customer_id
        })

        if (!charge) return new BadRequestError('Invalide data! Could not process your payment')

        // Creaet new order 

        // clear the cart
        await this.cartService.cleaerCart(userId, cart._id)

        return charge

    }




}

export const buyerService = new BuyerService(cartService, productService, new Stripe(process.env.STRIPE_KEY!, {
    apiVersion: '2022-11-15',
}))