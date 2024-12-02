import express from "express";
import { getUserInfo, addBalance, refundBalance, getUserStudent } from "../controllers/users.controller.js";

const router = express.Router();

router.get("/students", getUserStudent);
router.get("/:id", getUserInfo);
router.post("/",addBalance);
router.put('/:userId/refund', refundBalance);
export default router;