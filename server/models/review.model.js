import mongoose from "mongoose";
import commentSchema from "./comment.model.js";

const Schema = mongoose.Schema;
const reviewSchema = new Schema({
  username: { 
    type: String, 
    required: true },
  avatar: { 
    type: String, 
    required: true },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 },
  review: { 
    type: String, 
    required: true },
  timestamp: { 
    type: String, 
    required: true },
  likes: { 
    type: Number, 
    default: 0 },
  mylike: { 
    type: Boolean, 
    default: false },
  comments: [commentSchema],
});

export default reviewSchema;