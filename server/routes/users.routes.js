import express from "express";
import { getUserInfo, addBalance, refundBalance, editProfile, getAllUser, deleteUser, createUser, getAllStaff } from "../controllers/users.controller.js";

const router = express.Router();

router.get("/:id", getUserInfo);
router.post("/",addBalance);
router.put('/refund/:userId', refundBalance);
router.put("/update/:id", editProfile);

router.get("/admin/all", getAllUser);
router.get("/admin/staff", getAllStaff);

router.delete("/admin/:id", deleteUser);
router.post("/admin/create", createUser);

export default router;