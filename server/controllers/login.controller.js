import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.model.js"; // Mô hình dữ liệu MongoDB
import nodemailer from "nodemailer";

// Cấu hình transporter cho gửi email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "johapsystem@gmail.com",
    pass: "nkvc abxt enta ttwc", // App password
  },
});

// Hàm đăng nhập
export const Login = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Kiểm tra nếu thiếu thông tin
    if (!username || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Tìm user theo username và role
    const user = await User.findOne({ username, role });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Tạo token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretkey", // Đổi thành biến môi trường trong production
      { expiresIn: "1h" }
    );

    // Trả về thông tin người dùng, bao gồm userId
    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      userId: user._id,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
// Hàm đăng ký
export const register = async (req, res) => {
  const { username, password, email, name, role } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      name,
      role,
      balance: 0
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Hàm gửi OTP đặt lại mật khẩu
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 chữ số
    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 3600000; // Hết hạn sau 1 giờ
    await user.save();

    const mailOptions = {
      from: "justoldfat@gmail.com",
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP for password reset is: ${otp}. This OTP will expire in 1 hour.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Hàm đặt lại mật khẩu
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetOTP || user.resetOTP !== otp || user.resetOTPExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;

    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
