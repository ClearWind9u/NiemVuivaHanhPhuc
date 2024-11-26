import express from "express";

import { getAllStudentOrders, getAllStaffOrders, getOrderDetail } from "../controllers/orders.controller.js";

const router = express.Router();

router.get("/student/orders/:studentId", getAllStudentOrders);
router.get("/staff/orders/:staffId", getAllStaffOrders);
router.get('/orders/:orderId', getOrderDetail);

export default router;