import express from "express";
import { getCart,addFood,minusFood,removeFood, buyNowChange } from "../controllers/cart.controller.js";

const router = express.Router();
router.get("/:user_id",getCart);
router.post("/add/",addFood);
router.post("/minus/",minusFood);
router.post("/remove/",removeFood);
router.post("/buynow/",buyNowChange);


export default router;

