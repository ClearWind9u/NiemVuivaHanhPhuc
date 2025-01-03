import Cart from "../models/cart.model.js";
import Food from "../models/foods.model.js";
import User from "../models/users.model.js";
// Thêm món ăn
export const addDish = async (req, res) => {
  try {
    const { name, quantity, price, description, preparation_time, image, category } = req.body;
    if (!name || !quantity || !price || !preparation_time || !category || !description || !image) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const lastDish = await Food.findOne().sort({ _id: -1 });
    const newId = lastDish ? lastDish.id + 1 : 1;

    const newDish = new Food({
      id: newId,
      name,
      quantity,
      price,
      description,
      preparation_time,
      image,
      category,
      reviews: [],
    });

    await newDish.save();
    res.status(201).json({ message: "Food added successfully", dish: newDish });
  } catch (error) {
    console.error("Error adding food:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Sửa món ăn
export const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedDish = await Food.findOneAndUpdate({ id }, updates, { new: true });

    if (!updatedDish) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.status(200).json({ message: "Food updated successfully", dish: updatedDish });
  } catch (error) {
    console.error("Error updating food:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Xóa món ăn
export const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDish = await Food.findOneAndDelete({ id });
    if (!deletedDish) {
      return res.status(404).json({ message: "Food not found" });
    }
    await Cart.deleteMany({ id: id });

    res.status(200).json({ message: "Food deleted successfully" });
  } catch (error) {
    console.error("Error deleting dish:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Tìm kiếm món ăn
export const searchDishes = async (req, res) => {
  try {
    const { name } = req.params;
    const dishes = await Food.find({ name: { $regex: name, $options: "i" } });
    res.status(200).json(dishes);
  } catch (error) {
    console.error("Error searching foods:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

//Xem tất cả món ăn
export const getAllDishes = async (req, res) => {
  try {
    const { page = 1, limit = 6, search, category, sort } = req.query;

    const query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };

    const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

    const totalDishes = await Food.countDocuments(query);
    const dishes = await Food.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      totalDishes,
      totalPages: Math.ceil(totalDishes / limit),
      currentPage: parseInt(page),
      dishes
    });
  } catch (error) {
    console.error("Error fetching foods:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const addCart = async (req, res) => {
  try {
    const { id, user_id } = req.body;

    // Kiểm tra món ăn có tồn tại hay không
    const dish = await Food.findOne({ id });
    if (!dish) {
      return res.status(404).json({ message: "Food not found" });
    }

    // Kiểm tra món ăn còn số lượng hay không
    if (dish.quantity === 0) {
      return res.status(400).json({ message: "Đã hết món" });
    }

    // Tìm món ăn trong giỏ hàng của người dùng
    const existingCartItem = await Cart.findOne({ id, user_id });

    if (existingCartItem) {
      // Cộng dồn số lượng và tổng tiền nếu món đã có trong giỏ hàng
      const updatedQuantity = existingCartItem.quantity + 1;
      const updatedTotal = existingCartItem.total + dish.price;

      await existingCartItem.updateOne({ 
        quantity: updatedQuantity, 
        total: updatedTotal 
      });

      return res.status(201).json({ 
        message: "Food added to cart successfully", 
        cart: { ...existingCartItem._doc, quantity: updatedQuantity, total: updatedTotal } 
      });
    } else {
      // Kiểm tra người dùng có tồn tại hay không
      const customer = await User.findOne({ _id: user_id });
      if (!customer) {
        return res.status(404).json({ message: "User not found" });
      }

      // Tạo một mục mới trong giỏ hàng
      const newCartItem = new Cart({
        id,
        user_id,
        name: dish.name,
        quantity: 1,
        price: dish.price,
        total: dish.price,
        image: dish.image,
        buyNow: false,
      });

      await newCartItem.save();

      return res.status(201).json({ 
        message: "Food added to cart successfully", 
        cart: newCartItem 
      });
    }
  } catch (error) {
    console.error("Error adding dish to cart:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
