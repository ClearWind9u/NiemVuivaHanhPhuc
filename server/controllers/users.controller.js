import User from "../models/users.model.js";
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

// 
export const Editprofile = async (req, res) => {
    try{
    const { id } = req.params;
    const  updatedData = req.body;


    const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found', id }); // Trường hợp không tìm thấy user
        }

        // Kiểm tra nếu mật khẩu mới được thay đổi
        if (updatedData.password && updatedData.password !== user.password) {
         
            updatedData.password = await bcrypt.hash(updatedData.password, 10); // Mã hóa mật khẩu mới
        } else {
            // Nếu không thay đổi mật khẩu, có thể xóa mật khẩu khỏi updatedData để tránh ghi đè
            delete updatedData.password;
        }
         
      const updatedUser = await User.findByIdAndUpdate( id , updatedData, { new: true });
  //    console.log("AFTER THE UPDATE: ", id);
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found keke', id }); // Trường hợp không tìm thấy user
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error); // Log chi tiết lỗi
      res.status(500).json({ error: 'Error updating user profile', details: error.message });
    }
};

export const addBalance = async (req, res) => {
    try {
        const { id, money } = req.body;
        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (money > 500000) {
            return res.status(500).json({ message: "You can only add up to a maximum of 500000 VNĐ" });
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

export const deleteUser = async (req, res) => {
    try {
      const { id } = req.params; 
  
      
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
  
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getAllUser = async (req, res) => {
    try {
        const Users = await User.find();
        res.status(200).json(Users);
    } catch (error) {
        console.error("Error fetching all dishes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createUser = async (req, res) => {
    try {
        const { username, name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
          return res.status(400).json({ message: "Please provide all required fields" });
        }
    
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = new User({
          name,
          username,
          email,
          password: hashedPassword,  
          role,
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
          },
        });
    }
    catch(err){
        console.error("Error creating user:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getUser = async (req, res) => {
  try {
    const Users = await User.find();
    res.status(200).json(Users);
  } catch (error) {
    console.error("Error fetching all user balance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Addfunds = async (req, res) => {
  try{
  const { id } = req.params;
  const  updatedData = req.body;

    const updatedUser = await User.findByIdAndUpdate( id , updatedData, { new: true });
//    console.log("AFTER THE UPDATE: ", id);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found keke', id }); // Trường hợp không tìm thấy user
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error); // Log chi tiết lỗi
    res.status(500).json({ error: 'Error updating user profile', details: error.message });
  }
};