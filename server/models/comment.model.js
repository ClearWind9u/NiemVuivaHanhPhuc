import mongoose from "mongoose";

const Schema = mongoose.Schema;
const commentSchema = new Schema({
  username: { 
    type: String, 
    required: true },
  comment: { 
    type: String, 
    required: true },
  timestamp: { 
    type: String, 
    required: true },
});

export default commentSchema;