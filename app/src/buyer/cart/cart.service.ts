import { CartModel, CartProductModel, ProductDoc } from '@shoppingapp/common';
import { CartProduct } from './cart-product.model';
import { Cart } from './cart.model';
import { AddProductToCartDto, CreateCartProductDto, RemoveProductFromCartDto, UpdateCartProducQuantitytDto } from './dtos/cart.dto';
export class CartService {
    constructor(
        public cartModel: CartModel,
        public cartProductModel: CartProductModel
    ) { }


    async findOneByUserId(userId: string) {
        return await this.cartModel.findOne({ user: userId });
    }


    async getCartProductById(cartProductId: string, cartId: string) {
        return await this.cartProductModel.findOne({ productId: cartProductId, cart: cartId })
    }

    async createCart(userId: string) {
        const cart = new this.cartModel({ user: userId });
        return await cart.save();
    }

    async createCartProduct(createCartProductDto: CreateCartProductDto) {
        const cartProduct = new this.cartProductModel({
            cart: createCartProductDto.cartId,
            product: createCartProductDto.productId,
            quantity: createCartProductDto.quantity
        });
        return await cartProduct.save();
    }

    async isProductInCart(cartId: string, product: string) {
        return !!(await this.cartProductModel.findOneAndDelete({ cart: cartId, product: product }))
    }

    async getCart(cartId: string) {
        return await this.cartModel.findOne({ _id: cartId })
    }

    async removeProductFromCart(removeProductFromCartDto: RemoveProductFromCartDto) {
        const { cartId, productId } = removeProductFromCartDto;
        const cartProduct = await this.cartProductModel.findOneAndDelete({ product: productId });
        if (!cartProduct) return null;

        const deleteDoc = await this.cartModel.findOneAndRemove({ _id: cartProduct._id });
        if (!deleteDoc) return null;

        return await this.cartModel.findOneAndUpdate({ _id: cartId },
            { $pull: { products: cartProduct._id }, $inc: { totalPrice: -cartProduct.quantity * cartProduct.product.price } }, { new: true });
    }

    async updateProductQuantity(updateCartProducQuantitytDto: UpdateCartProducQuantitytDto) {
        const { inc, amount } = updateCartProducQuantitytDto.options;
        const { productId, cartId } = updateCartProducQuantitytDto;
        const cartProduct = await this.cartProductModel.findOne({ product: productId });
        if (!cartProduct) return null;
        console.log(cartProduct.quantity, amount, inc)

        if (cartProduct.quantity < amount && !inc) {
            return await this.removeProductFromCart({ cartId, productId });
        }

        const updateCartProduct = await this.cartProductModel.findOneAndUpdate({ product: productId },
            { $inc: { quantity: inc ? amount : -amount } }, { new: true }).populate('product');

        const newPrice = inc ? updateCartProduct!.product.price * amount : -updateCartProduct!.product.price * amount;
        return await this.cartModel.findOneAndUpdate({ _id: cartId },
            { $inc: { totalPrice: newPrice } }, { new: true });


    }

    async addProduct(addProductToCartDto: AddProductToCartDto, product: ProductDoc) {
        const { userId, productId, quantity } = addProductToCartDto;
        let cart = await this.findOneByUserId(userId);

        //  if the product in cart => update quantity += 1
        const isProductInCart = cart && await this.isProductInCart(cart._id, productId);

        if (isProductInCart && cart) return this.updateProductQuantity({ cartId: cart._id, productId, options: { inc: true, amount: quantity } })


        if (!cart) cart = await this.createCart(userId);

        const cartProduct = await this.createCartProduct({ cartId: cart._id, productId, quantity });

        return await this.cartModel.findOneAndUpdate({ _id: cart._id },
            { $push: { products: cartProduct._id }, $inc: { totalPrice: product.price * quantity } }, { new: true });
    }


}


export const cartService = new CartService(Cart, CartProduct);
