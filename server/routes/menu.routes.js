import express from "express";
import { addDish, updateDish, deleteDish, searchDishes, getAllDishes } from "../controllers/menu.controller.js";

const router = express.Router();

router.post("/add", addDish);
router.put("/update/:id", updateDish);
router.delete("/delete/:id", deleteDish);
router.get("/search/:name", searchDishes);
router.get("/all", getAllDishes);

export default router;
