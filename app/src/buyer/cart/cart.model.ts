import mongoose, { Schema } from 'mongoose';
import { CartDoc, CartModel } from '@shoppingapp/common';

const schema: Schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CartProduct',
        required: true
    }],
    totalPrice: {
        type: Number,
        default: 0,
        required: true
    },
    customer_id: { type: String }
})

export const Cart = mongoose.model<CartDoc, CartModel>('Cart', schema);