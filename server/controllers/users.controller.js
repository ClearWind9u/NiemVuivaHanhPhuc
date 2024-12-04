import User from "../models/users.model.js";

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

// Lấy danh sách người dùng có role là student
export const getUserStudent = async (req, res) => {
    try {
        // Tìm tất cả người dùng có role là "student"
        const students = await User.find({ role: "student" });

        // Kiểm tra nếu không có student nào
        if (students.length === 0) {
            return res.status(404).json({ message: "No students found" });
        }

        // Loại bỏ trường password khỏi kết quả
        const safeStudents = students.map((student) => {
            const { password, ...safeStudent } = student.toObject();
            return safeStudent;
        });

        // Trả về danh sách student
        res.status(200).json(safeStudents);
    } catch (error) {
        console.error("Error fetching students:", error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
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

export const getAllUser = async (req, res) => {
    try {
        const Users = await User.find();
        res.status(200).json(Users);
    } catch (error) {
        console.error("Error fetching all dishes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllStaff = async (req, res) => {
    try {
        // Lấy danh sách nhân viên có role là 'staff'
        const staffUsers = await User.find({ role: "staff" }, { _id: 1, name: 1 });

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