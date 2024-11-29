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
export const addBalance = async (req, res) => {
    try {
        const { id, money } = req.body;
        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (money > 5000000) return res.status(500).json({ message: "Ban chi duoc nap toi da 500000 dong" })
        const balance = user.balance + money;
        await user.updateOne({balance: balance}, { new: true });
        user = await User.findById(id);
        res.status(200).json(user);


    } catch (error) {
        console.error("Error add fund:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

