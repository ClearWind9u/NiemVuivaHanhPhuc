
import mongoose from "mongoose";
import Review from "./review.model.js"

const Schema = mongoose.Schema;
const foodSchema = new Schema({
    id: { 
        type: Number, 
        required: true },
    name: { 
        type: String, 
        required: true, 
        unique: true },
    inStock: { 
        type: Boolean, 
        default: true },
    quantity: { 
        type: Number, 
        required: true, 
        min: 0 },
    buyed: { 
        type: Boolean, 
        default: false },
    sold: {
        type: Number,
        default: 0,
        min: 0,},
    price: { 
        type: Number, 
        required: true, 
        min: 0 },
    description: { 
        type: String },
    preparation_time: { 
        type: Number, 
        required: true},
    image: { 
        type: String },
    category: {
        type: String,
        required: true,
        enum: ["food", "drink", "snack"], // Các loại món ăn
        },
    reviews: {
        type: [Review],
        default: [] },
  });
const Food = mongoose.model('foods', foodSchema);

export default Food;
