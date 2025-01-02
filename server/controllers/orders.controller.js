import Order from "../models/orders.model.js";
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

    res.status(200).json({ success: true, formattedOrders });
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

    res.status(200).json({ success: true, formattedOrders });
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

export const getOldOrders = async (req, res) => {
  try {
    // Lấy ngày hiện tại và ngày 6 tháng trước
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Truy vấn các hóa đơn có `order_time` nằm trong khoảng 6 tháng
    const oldOrders = await Order.find({
      order_time: { $gte: sixMonthsAgo }, // Tìm hóa đơn có `order_time` lớn hơn 6 tháng trước
      staff_id: { $exists: true, $ne: null } 
    })
      .sort({ order_time: -1 }) // Sắp xếp theo ngày mới nhất
      .populate('staff_id', 'name') // Lấy thông tin tên nhân viên
      .populate('student_id', 'name')
      .select(' _id staff_id student_id order_time details final_price payment_method'); // Chỉ lấy các trường cần thiết
    // Kiểm tra nếu không có hóa đơn nào được tìm thấy
    if (!oldOrders || oldOrders.length === 0) {
      return res.status(404).json({ message: 'No old orders found' });
    }

    // Định dạng dữ liệu trả về
    const formattedOldOrders = oldOrders.map(order => ({
      _id: order._id,
      staffName: order.staff_id.name,
      studentName: order.student_id.name,
      date: order.order_time,
      items: order.details.map(item => item.name).join(', '), // Danh sách tên món
      totalAmount: order.final_price,
      paymentMethod: order.payment_method,
    }));

    // Trả về dữ liệu
    return res.status(200).json(formattedOldOrders);
  } catch (error) {
    console.error('Error fetching old orders:', error);
    res.status(500).json({ message: 'Failed to fetch old orders.' });
  }
};

export const deleteOldOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id); // Xóa theo ID

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found!" });
    }

    res.status(200).json({ message: "Order deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting order", error });
  }
};

export const getOrdersWithoutStaff = async (req, res) => {
  try {
    // Truy vấn các hóa đơn không có staff_id hoặc staff_id là null (để đưa vào pendingInvoices)
    const orders = await Order.find({ staff_id: { $in: [null, undefined] } })
      .select('staff_id student_id order_time details final_price payment_method status') // Chỉ lấy các trường cần thiết
      .lean();

    // Format lại dữ liệu trước khi gửi
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      order_time: order.order_time,
      dishes: order.details.map((dish) => dish.name).join(', '), // Danh sách tên món ăn
      final_price: order.final_price,
      payment_method: order.payment_method,
      status: order.status,
      student_id: order.student_id,
      staff_id: order.staff_id,
      view: `/orders/${order._id}`, // Link xem chi tiết hóa đơn
    }));

    res.status(200).json({ success: true, orders: formattedOrders });
  } catch (error) {
    console.error('Error fetching orders without staff:', error);
    res.status(500).json({ message: 'Failed to fetch orders without staff.' });
  }
};

export const assignStaffToOrder = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID của hóa đơn
    const { staff_id } = req.body; // Lấy staff_id từ body request

    // Chuyển đổi staff_id từ string sang ObjectId
    const staffObjectId = new mongoose.Types.ObjectId(staff_id);

    // Cập nhật hóa đơn với staff_id
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { staff_id: staffObjectId,
        status: "completed"},
      { new: true } // Trả về document sau khi cập nhật
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order assigned to staff successfully" });
  } catch (error) {
    console.error("Error assigning staff to order:", error);
    res.status(500).json({ message: "Failed to assign staff to order" });
  }
};

export const declineOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Failed to delete order' });
  }
};
