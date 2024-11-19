import Order from "../models/orders.model.js";
import mongoose from "mongoose";

export const getAllStudentOrders = async (req, res) => {
    try {
        const { studentId } = req.params;
        const studentObjectId = new mongoose.Types.ObjectId(studentId);
        // Truy vấn danh sách hóa đơn của sinh viên theo student_id
        const orders = await Order.find({ student_id: studentObjectId })
          .select('order_time details final_price payment_method status') // Chỉ lấy các trường cần thiết
          .lean();
    
        // Format lại dữ liệu trước khi gửi
        const formattedOrders = orders.map((order) => ({
          order_time: order.order_time,
          dishes: order.details.map((dish) => dish.name).join(', '), // Lấy danh sách tên món ăn
          final_price: order.final_price,
          payment_method: order.payment_method,
          status: order.status,
          view: `/orders/${order._id}`, // Nút view để xem chi tiết hóa đơn
        }));
    
        res.status(200).json({success: true, formattedOrders});
      } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders.' });
      }
};

export const getAllStaffOrders = async (req, res) => {
    try {
        const { staffId } = req.params;
        const staffObjectId = new mongoose.Types.ObjectId(staffId);
        
        const orders = await Order.find({ staff_id: staffObjectId })
          .select('order_time details final_price payment_method status') 
          .lean();
    
        
        const formattedOrders = orders.map((order) => ({
          order_time: order.order_time,
          dishes: order.details.map((dish) => dish.name).join(', '), 
          final_price: order.final_price,
          payment_method: order.payment_method,
          status: order.status,
          view: `/orders/${order._id}`, 
        }));
    
        res.status(200).json({success: true, formattedOrders});
      } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders.' });
      }
};
