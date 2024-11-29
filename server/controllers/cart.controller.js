import Cart from "../models/cart.model.js";

export const getCart = async (req,res)=>{
    try {
        const {user_id} = req.params;
        const foodList = await Cart.find({user_id: user_id});
        if(!(foodList.length)){
            return res.status(404).json({ message: "Cart does not has food" });
        }
        res.status(200).json(foodList);
    } catch (error) {
        console.error("Error getting cart list:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
export const addFood = async (req,res) => {
    try {
        const { id, user_id } = req.body;
        let foodAdded = await Cart.findOne({id : id, user_id: user_id});
        const quantity = foodAdded.quantity + 1;
        const total = foodAdded.total + foodAdded.price;
        await foodAdded.updateOne({quantity: quantity,total: total},{new: true});
        foodAdded = await Cart.findOne({id : id, user_id: user_id});
        res.status(200).json(foodAdded);
    } catch (error) {
        console.error("Error adding food:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
export const minusFood = async (req,res) => {
    try {
        const { id, user_id } = req.body;
        let foodMinus = await Cart.findOne({id : id, user_id: user_id});
        const quantity = foodMinus.quantity - 1;
        const total = foodMinus.total - foodMinus.price;
        if(quantity == 0){
            await Cart.deleteOne({id : id, user_id: user_id })
            return res.status(201).json({ message: "Deleted food" });
        }
        await foodMinus.updateOne({quantity: quantity,total: total},{new: true});
        foodMinus = await Cart.findOne({id : id, user_id: user_id});
        res.status(200).json(foodMinus);
    } catch (error) {
        console.error("Error minus food:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
export const removeFood = async (req,res) => {
    try {
        const { id, user_id } = req.body;
        await Cart.deleteOne({id : id, user_id: user_id });
        return res.status(201).json({ message: "Deleted food" });
    } catch (error) {
        console.error("Error deleting food:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
export const buyNowChange = async (req,res) => {
    try {
        const { id, user_id } = req.body;
        let food = await Cart.findOne({id : id, user_id: user_id });
        const buyNow = !food.buyNow;
        await food.updateOne({buyNow: buyNow},{new: true})
        food = await Cart.findOne({id : id, user_id: user_id });
        return res.status(201).json({food });
    } catch (error) {
        console.error("Error change by now food:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}