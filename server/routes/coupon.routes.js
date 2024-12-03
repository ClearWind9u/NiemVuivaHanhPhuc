import express from 'express';
import { createCoupon, getCoupons, getCouponById, updateCoupon, deleteCoupon, validateCoupon } from '../controllers/coupon.controller.js';
const router = express.Router();

router.post('/', createCoupon);
router.get('/validate/:code', validateCoupon);
router.get('/', getCoupons);
router.get('/:id', getCouponById);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

export default router;
