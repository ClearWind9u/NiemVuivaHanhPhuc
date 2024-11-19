import express from "express";

import { getAllStudentOrders, getAllStaffOrders } from "../controllers/orders.controller.js";

const router = express.Router();

router.get("/student/orders/:studentId", getAllStudentOrders);
router.get("/staff/orders/:staffId", getAllStaffOrders);

export default router;