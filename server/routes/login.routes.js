import express from "express";
import {
  Login,
  register,
  forgotPassword,
  resetPassword,
} from "../controllers/login.controller.js";

const router = express.Router();

// Route cho login
router.post("/login", Login);

// Route cho register
router.post("/register", register);

// Route cho forgot-password
router.post("/forgot-password", forgotPassword);

// Route cho reset-password
router.post("/reset-password", resetPassword);

export default router;
