import Order from "../models/orders.model.js";
import Cart from "../models/cart.model.js";
import User from "../models/users.model.js";
import mongoose from "mongoose";
import { Types } from "mongoose";

export const addCartToOrder = async (req, res) => {
    try {
        let totalQuantity = 0;
        let totalPrice = 0;
        const { user_id, paymentMethod, totalAmount } = req.body;

        // Lấy danh sách món ăn từ giỏ hàng của người dùng
        const orderFoodlist = await Cart.find({ user_id: user_id, buyNow: true });
        const OrderDetail = orderFoodlist.map((orderFood) => {
            totalQuantity += orderFood.quantity;
            totalPrice += orderFood.total;
            return {
                dish_id: orderFood._id,
                name: orderFood.name,
                quantity: orderFood.quantity,
                price: orderFood.price,
                total_price: orderFood.total,
            };
        });

        // Tạo đối tượng mới cho đơn hàng
        const newOrder = new Order({
            student_id: new Types.ObjectId(user_id),
            staff_id: null,
            details: OrderDetail,
            total_quantity: totalQuantity,
            total_price: totalPrice,
            discount: totalPrice - totalAmount,
            final_price: totalAmount,
            payment_method: paymentMethod,
        });

        // Nếu thanh toán online, kiểm tra và trừ số dư
        if (paymentMethod === "online") {
            const user = await User.findById(user_id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const newBalance = user.balance - totalAmount;
            if (newBalance < 0) {
                return res.status(201).json({ message: "Không đủ tiền trong tài khoản" });
            }

            await user.updateOne({ balance: newBalance });
        }

        // Lưu đơn hàng và xóa các món đã mua khỏi giỏ hàng
        await newOrder.save();
        await Cart.deleteMany({ user_id: user_id, buyNow: true });

        res.status(200).json({ order: newOrder });
    } catch (error) {
        console.error("Error processing order:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};