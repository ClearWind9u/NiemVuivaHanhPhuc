import mongoose from "mongoose";

const Schema = mongoose.Schema;
const CommentSchema = new Schema({
    username: { type: String, required: true },
    comment: { type: String, required: true },
    timestamp: { type: String, default: new Date().toISOString() },
    role: { type: String, required: true },
    comment_id: { type: String, required: true },
  });
  
  const ReviewSchema = new Schema({
    username: { type: String, required: true },
    avatar: { type: String },
    rating: { type: Number, required: true, min: 0, max: 5 },
    review: { type: String, required: true },
    timestamp: { type: String, default: new Date().toISOString() },
    likes: { type: Number, default: 0 },
    review_id: { type: String, required: true },
    mylike: { type: [String], default: [] },
    comments: { type: [CommentSchema], default: [] },
  });
  
  const FoodSchema = new Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    price: { type: Number, required: true, min: 0 },
    buyed: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, required: true, min: 0 },
    sold: { type: Number, default: 0, min: 0 },
    preparation_time: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: ["food", "drink", "snack"],
    },
    reviews: { type: [ReviewSchema], default: [] },
  });
const Food = mongoose.model('foods', FoodSchema);

export default Food;
