
import mongoose from "mongoose";

const Schema = mongoose.Schema;
const foodSchema = new Schema({
    dish_name: { 
        type: String, 
        required: true, 
        unique: true },
    in_stock: { 
        type: Boolean, 
        default: true },
    quantity: { 
        type: Number, 
        required: true, 
        min: 0 },
    price: { 
        type: Number, 
        required: true, 
        min: 0 },
    description: { 
        type: String },
    preparation_time: { 
        type: Number, 
        required: true}, // Thời gian chuẩn bị (phút)
    image_url: { 
        type: String },
  });
const Food = mongoose.model('foods', foodSchema);

export default Food;
