import express from "express";
import { addCartToOrder } from "../controllers/payment.controller.js";
const router = express.Router();

router.post("/", addCartToOrder);
export default router;
