export interface AddProductToCartDto {
    userId: string;
    quantity: number;
    productId: string;
}


export interface CreateCartProductDto {
    cartId: string;
    quantity: number;
    productId: string;
}

export interface RemoveProductFromCartDto {
    cartId: string;
    productId: string;
}


export interface UpdateCartProducQuantitytDto {
    cartId: string;
    productId: string;
    options: { inc: boolean, amount: number }
}