
import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: 'Other'
    },
    resetOTP: String,
    phone: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    balance: {
        type: Number,
    },
    role: {
        type: String,
        enum: ['student', 'staff', 'admin'],
        required: true,
    },
    avatar: {
        type: String,
        require: true,
    },
});
const User = mongoose.model('users', userSchema);

export default User;
