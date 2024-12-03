import Order from "../models/orders.model.js";
import Cart from "../models/cart.model.js";
import User from "../models/users.model.js";
import mongoose from "mongoose";
import { Types } from "mongoose";
export const addCartToOrder = async (req, res) => {
    try {
        let totalQuantity= 0;
        let totalPrice = 0;
        const { user_id, paymentMethod } = req.body;
        console.log(user_id);
        const orderFoodlist = await Cart.find({ user_id: user_id, buyNow: true });
        const OrderDetail = orderFoodlist.map((orderFood) => {
            totalQuantity += orderFood.quantity;
            totalPrice+= orderFood.total;
            const food = {};
            food.dish_id = orderFood._id;
            food.name = orderFood.name;
            food.quantity = orderFood.quantity;
            food.price = orderFood.price;
            food.total_price = orderFood.total;
            return food;
        });
        let id = new Types.ObjectId(user_id);
        const newOrder = new Order({
          student_id: id,
          staff_id: null,
          details: OrderDetail,
          total_quantity: totalQuantity,
          total_price: totalPrice,
          final_price: totalPrice,
          payment_method: paymentMethod,

        })
        const updateUser = await User.findOne({_id: user_id});
        const newBalance = updateUser.balance - newOrder.final_price;
        if(newBalance<0) return  res.status(201).json({ message: "Khong du tien" });
        await newOrder.save();
        await Cart.deleteMany({user_id: user_id, buyNow: true});
        await updateUser.updateOne({balance: newBalance});
        
        res.status(200).json({order: newOrder});
    } catch (error) {
        console.error("Error order:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}