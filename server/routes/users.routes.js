import express from "express";
import { getUserInfo } from "../controllers/users.controller.js";

const router = express.Router();

router.get("/:id", getUserInfo);

export default router;