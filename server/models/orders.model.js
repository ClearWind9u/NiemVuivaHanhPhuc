
import mongoose from "mongoose";

const Schema = mongoose.Schema;
// Định nghĩa schema cho chi tiết món ăn trong đơn hàng
const OrderDetailSchema = new Schema({
    dish_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'foods', 
        required: true },
    name: { 
        type: String, 
        required: true },
    quantity: { 
        type: Number, 
        required: true },
    price: { type: Number, 
        required: true } ,
    total_price: {
        type: Number,
        require: true}
        
});

// Định nghĩa schema cho đơn hàng
const OrderSchema = new Schema({
    student_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required: true },
    staff_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required: false },
    details: { 
        type: [OrderDetailSchema], 
        required: true },
    total_quantity: { 
        type: Number, 
        required: true },
    total_price: { 
        type: Number, 
        required: true },
    discount: { 
        type: Number, 
        default: 0 },
    final_price: { 
        type: Number, 
        required: true },
    payment_method: { 
        type: String, 
        enum: ['cash', 'online'], 
        required: true 
    },
    order_time: { 
        type: Date, 
        default: Date.now },
    status: { 
        type: String, 
        enum: ['pending', 'processing', 'completed', 'cancelled'], 
        default: 'pending' 
    }
});

// Tạo Model từ schema
const Order = mongoose.model('orders', OrderSchema);

export default Order;
