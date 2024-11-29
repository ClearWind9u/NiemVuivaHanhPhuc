import express from "express";
import { getUserInfo, addBalance } from "../controllers/users.controller.js";

const router = express.Router();

router.get("/:id", getUserInfo);
router.post("/",addBalance)
export default router;