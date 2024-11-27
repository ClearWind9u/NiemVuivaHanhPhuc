import User from "../models/users.model.js";
import jwt from "jsonwebtoken";

// Đăng nhập
export const login = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Kiểm tra nếu thiếu thông tin
    if (!username || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Tìm user theo username và role
    const user = await User.findOne({ username, role });
    if (!user || password !== user.password || role !== user.role) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Tạo token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretkey", // Đổi thành biến môi trường trong production
      { expiresIn: "1h" }
    );

    // Trả về thông tin người dùng
    res.status(200).json({ 
      message: "Login successful", 
      token, 
      role: user.role, 
      userId: user._id 
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
};
