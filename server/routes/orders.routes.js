import express from "express";

import { getAllStudentOrders, getAllStaffOrders, getOrderDetail ,
    getOldOrders, deleteOldOrder
} from "../controllers/orders.controller.js";

const router = express.Router();

router.get("/student/orders/:studentId", getAllStudentOrders);
router.get("/staff/orders/:staffId", getAllStaffOrders);
router.get('/orders/:orderId', getOrderDetail);
router.get('/orders_old', getOldOrders);
router.delete('/orders_old/:id', deleteOldOrder);

export default router;