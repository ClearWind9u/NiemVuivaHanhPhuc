import Food from "../models/foods.model.js";
import Cart from "../models/cart.model.js";
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
      buyed,
      inStock,
      reviews: [],
    });

    await newDish.save();
    res.status(201).json({ message: "Dish added successfully", dish: newDish });
  } catch (error) {
    console.error("Error adding dish:", error.message);
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
      return res.status(404).json({ message: "Dish not found" });
    }

    res.status(200).json({ message: "Dish updated successfully", dish: updatedDish });
  } catch (error) {
    console.error("Error updating dish:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// Xóa món ăn
export const deleteDish = async (req, res) => {
  try {
    console.log("Delete");
    const { id } = req.params;

    const deletedDish = await Food.findOneAndDelete({ id });

    if (!deletedDish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    res.status(200).json({ message: "Dish deleted successfully" });
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
      console.error("Error searching dishes:", error.message);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  
  export const getAllDishes = async (req, res) => {
    try {
      const dishes = await Food.find();
      res.status(200).json(dishes);
    } catch (error) {
      console.error("Error fetching all dishes:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  export const addCart = async (req, res) => {
    try {
      const { id , user_id} = req.body;
      const addFood = await Cart.findOne({ id });
      const user= await Cart.findOne({user_id});
      if(addFood && user){
        const quantity = addFood.quantity + 1;
        const total = addFood.total + addFood.price;
        await addFood.updateOne({quantity: quantity,total: total})
        res.status(201).json({ message: "Dish added to cart successfully sss", cart: addFood });
      }
      else{
        const dish = await Food.findOne({id});
        if(!dish){
        return res.status(404).json({ message: "Dish not found" });
        }
        const customer = await User.findOne({_id: user_id});
        if(!customer){
          return res.status(404).json({ message: "User not found" });
          }
        const quantity = 1;
        const price= dish.price;
        const image= dish.image;
        const total = dish.price;
        const name = dish.name;
        const newCart = new Cart({
          id: id,
          user_id: user_id,
          name: name,
          quantity: quantity,
          price: price,
          total: total,
          image: image,
          buyNow: false,
        });
        await newCart.save();
        res.status(201).json({ message: "Dish added to cart successfully", cart: newCart });
      }
    } catch (error) {
      console.error("Error adding dish to cart:", error.message);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }

  };