import express from "express";
import { getUserInfo, addBalance, 
    refundBalance, getUserStudent, getAllUser,
    getAllStaff } from "../controllers/users.controller.js";

const router = express.Router();

router.get("/students", getUserStudent);
router.get("/:id", getUserInfo);
router.post('/add/:userId',addBalance);
router.put('/refund/:userId', refundBalance);

router.get("/admin/all", getAllUser);
router.get("/admin/staff", getAllStaff);

export default router;