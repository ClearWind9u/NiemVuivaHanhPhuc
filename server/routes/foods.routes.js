import express from "express";
import { updateComment, deleteComment, deleteReview } from "../controllers/foods.controller.js";

const router = express.Router();

router.delete("/:foodId/reviews/:reviewId/comments/:commentId", deleteComment);
router.put("/:foodId/reviews/:reviewId/comments/:commentId", updateComment);
router.delete("/:foodId/reviews/:reviewId", deleteReview);
export default router;
