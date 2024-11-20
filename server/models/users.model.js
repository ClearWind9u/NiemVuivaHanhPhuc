
import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true },
    password: { 
        type: String, 
        required: true },
    full_name: { 
        type: String, 
        required: true },
    birth_date: { 
        type: Date },
    gender: { 
        type: String, 
        enum: ['Male', 'Female', 'Other'], 
        default: 'Other' },
    phone_number: { 
        type: String },
    email: { 
        type: String, 
        unique: true },
    role: {
      type: String,
      enum: ['student', 'staff', 'admin'],
      required: true,
    },
  });
const User = mongoose.model('users', userSchema);

export default User;
