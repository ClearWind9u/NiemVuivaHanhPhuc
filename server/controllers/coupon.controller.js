import Coupon from "../models/coupon.model.js";

// Create a new coupon
export const createCoupon = async (req, res) => {
    try {
        const { code, description, startDate, endDate, percentDiscount, moneyDiscount } = req.body;

        // Check for existing coupon with the same code
        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }

        const coupon = new Coupon({
            code,
            description,
            startDate,
            endDate,
            percentDiscount,
            moneyDiscount
        });

        await coupon.save();
        res.status(201).json(coupon);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create coupon', error: error.message });
    }
};

// Get all coupons
export const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch coupons', error: error.message });
    }
};
// Validate a coupon by its code
export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.params;
        const coupon = await Coupon.findOne({ code });
        
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        const currentDate = new Date();
        const startDate = new Date(coupon.startDate);
        const endDate = new Date(coupon.endDate);

        // Check if the coupon is within its valid date range
        if (currentDate >= startDate && currentDate <= endDate) {
            return res.status(200).json(coupon); // Send the coupon data if valid
        } else {
            return res.status(400).json({ message: 'Coupon is not valid for today' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to validate coupon', error: error.message });
    }
};

// Get a single coupon by ID
export const getCouponById = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findById(id);
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.status(200).json(coupon);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch coupon', error: error.message });
    }
};

// Update a coupon
export const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedCoupon = await Coupon.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedCoupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        res.status(200).json(updatedCoupon);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update coupon', error: error.message });
    }
};

// Delete a coupon
export const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        if (!deletedCoupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        res.status(200).json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete coupon', error: error.message });
    }
};
