
import mongoose from "mongoose";

const Schema = mongoose.Schema;
const cartSchema = new Schema({
    id: { 
        type: Number, 
        required: true },
    user_id: { 
        type: String,
        require: true },   
    name: { 
        type: String, 
        required: true },
    quantity: { 
        type: Number, 
        required: true, 
        min: 0 },
    price: { 
        type: Number, 
        required: true, 
        min: 0 },
    total: { 
        type: Number, 
        required: true, 
        min: 0},
    image: { 
        type: String },
    buyNow:{
        type: Boolean,
        required: true,
    }
  });
const Cart = mongoose.model('carts', cartSchema);

export default Cart;
