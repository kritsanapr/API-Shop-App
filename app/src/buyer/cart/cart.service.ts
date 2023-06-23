import { CartModel, CartProductModel } from '@shoppingapp/common';
import { CartProduct } from './cart-product.model';
import { Cart } from './cart.model';

export class CartService {
    constructor(
        public cartModel: CartModel,
        public cartProductModel: CartProductModel
    ) { }


    async findOneByUserId(userId: string) {
        return await this.cartModel.findOne({ user: userId });
    }

    async addProductToCart(userId: string, productId: string, quantity: number) {

    }
}


export const cartService = new CartService(Cart, CartProduct);
