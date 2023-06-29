import { OrderModel } from "@shoppingapp/common";
import { Order } from './order.model'
import { CreateOrderDto } from "./dtos/order.dto";

export class OrderService {
    constructor(private orderModel: OrderModel) { }

    async createOrder(orderDto: CreateOrderDto) {
        const order = new this.orderModel({
            user: orderDto.userId,
            totalAmount: orderDto.totalAmount,
            chargeId: orderDto.chargeId
        });
        return await order.save();
    }
}


export const orderService = new OrderService(Order);