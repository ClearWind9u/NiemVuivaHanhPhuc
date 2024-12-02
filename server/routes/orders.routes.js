import express from "express";

import { getAllStudentOrders, getAllStaffOrders, getOrderDetail , getOldOrders, deleteOldOrder, getOrdersWithoutStaff, assignStaffToOrder, declineOrder } from "../controllers/orders.controller.js";

const router = express.Router();

router.get("/student/orders/:studentId", getAllStudentOrders);
router.get("/staff/orders/:staffId", getAllStaffOrders);
router.get('/orders/:orderId', getOrderDetail);
router.get('/orders_old', getOldOrders);
router.delete('/orders_old/:id', deleteOldOrder);
router.get('/staff/pending_invoices', getOrdersWithoutStaff);
router.put('/orders/:id/assign-staff', assignStaffToOrder);
router.delete('/orders/:id/decline', declineOrder);

export default router;