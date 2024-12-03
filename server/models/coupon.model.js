import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const couponSchema = new Schema({
    code: { 
        type: String, 
        required: true, 
        unique: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    percentDiscount: { 
        type: Number, 
        default: 0 // Represents percentage discount, e.g., 20 for 20%
    },
    moneyDiscount: { 
        type: Number, 
        default: 0 // Represents flat money discount, e.g., 500 for $500
    }
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
