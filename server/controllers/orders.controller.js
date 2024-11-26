import Order from "../models/orders.model.js";
import User from "../models/users.model.js";

import mongoose from "mongoose";

export const getAllStudentOrders = async (req, res) => {
    try {
        const { studentId } = req.params;
        // Truy vấn danh sách hóa đơn của sinh viên theo student_id
        const orders = await Order.find({ student_id: studentId })
          .select('order_time details final_price payment_method status') // Chỉ lấy các trường cần thiết
          .lean();
    
        // Format lại dữ liệu trước khi gửi
        const formattedOrders = orders.map((order) => ({
          _id: order._id,
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
        
        const orders = await Order.find({ staff_id: staffId })
          .select('order_time details final_price payment_method status') 
          .lean();
    
        
        const formattedOrders = orders.map((order) => ({
          _id: order._id,
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

export const getOrderDetail = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
    .populate('student_id', 'name') // Chỉ lấy tên sinh viên
    .populate('staff_id', 'name')   // Chỉ lấy tên nhân viên
    // Kiểm tra xem hóa đơn có tồn tại hay không
    console.log(order);
    if (!order) {
      console.log('No orders found with the provided ID');

      return res.status(404).json({ message: 'No orders found with the provided ID' });
    }
    // Lấy thông tin chi tiết người dùng dựa vào role
    return res.status(200).json({
      _id: order._id,
      student: order.student_id.name,
      staff: order.staff_id.name,
      details: order.details.map(item => ({
        name: item.name,  // Lấy tên món ăn từ `dish_id`
        quantity: item.quantity,
        price: item.price,
        total_price: item.total_price
      })),
      total_quantity: order.total_quantity,
      total_price: order.total_price,
      discount: order.discount,
      final_price: order.final_price,
      payment_method: order.payment_method,
      order_time: order.order_time,
      status: order.status
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Failed to fetch order details.' });
  }
};


