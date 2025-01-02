import User from "../models/users.model.js";
import Order from "../models/orders.model.js";
import Cart from "../models/cart.model.js";
import bcrypt from "bcryptjs";

// Lấy thông tin người dùng bằng ID
export const getUserInfo = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ URL
    // Tìm user dựa trên ID
    const user = await User.findById(id);

    // Kiểm tra nếu không tìm thấy user
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Loại bỏ password trước khi trả về
    const { password, ...safeUser } = user.toObject();

    // Trả về thông tin người dùng đã loại bỏ password
    res.status(200).json(safeUser);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found keke', id }); // Trường hợp không tìm thấy user
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updatedUser.email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error); // Log chi tiết lỗi
    res.status(500).json({ error: 'Error updating user profile', details: error.message });
  }
};

export const addBalance = async (req, res) => {
  try {
    console.log(req.body);
    const { id, money } = req.body;
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (money > 500000) {
      return res.status(400).json({ message: "You can only add up to a maximum of 500000 VNĐ" });
    }
    const balance = user.balance + money;
    await user.updateOne({ balance: balance }, { new: true });
    user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error add fund:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

export const refundBalance = async (req, res) => {
  try {
      const { userId } = req.params;
      const { amount } = req.body;
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Assuming `balance` is a field in the User model
      user.balance += amount; // Refund the user
      await user.save();

      res.status(200).json({ message: 'Refund successful' });
  } catch (error) {
      console.error('Error processing refund:', error);
      res.status(500).json({ message: 'Failed to process refund' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm user cần xóa
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Xóa các bản ghi trong orders liên quan đến user
    await Order.deleteMany({
      $or: [{ staff_id: id }, { student_id: id }],
    });

    // Xóa các bản ghi trong cart liên quan đến user
    await Cart.deleteMany({ user_id: id });

    // Xóa user
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User and related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting user and related data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const Users = await User.find();
    res.status(200).json(Users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllStaff = async (req, res) => {
  try {
      // Lấy danh sách nhân viên có role là 'staff'
      const staffUsers = await User.find({ role: "staff" }, { _id: 1, name: 1});
      
      // Kiểm tra nếu không có nhân viên nào
      if (!staffUsers.length) {
        return res.status(404).json({ success: false, message: "No staff found" });
      }
  
      // Trả về danh sách
      res.status(200).json({ success: true, staff: staffUsers });
    } catch (error) {
      console.error("Error fetching staff users:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const createUser = async (req, res) => {
  try {
    const { username, name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo đối tượng người dùng mới
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role,
      ...(role === "student" && { balance: 0 }), // Chỉ thêm trường balance nếu role là "student"
    });

    console.log(role);
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        ...(newUser.role === "student" && { balance: newUser.balance }), // Trả thêm balance nếu là student
      },
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};