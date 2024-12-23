import express from 'express';
import { createCoupon, getCoupons, getCouponById, updateCoupon, deleteCoupon, validateCoupon, getValidCoupon } from '../controllers/coupon.controller.js';
const router = express.Router();

router.post('/', createCoupon);
router.post('/validate', validateCoupon);
router.get('/valid', getValidCoupon);
router.get('/', getCoupons);
router.get('/:id', getCouponById);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

export default router;
