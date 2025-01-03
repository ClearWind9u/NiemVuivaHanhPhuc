import express from "express";
import { updateComment, deleteComment, deleteReview, updateReview } from "../controllers/foods.controller.js";

const router = express.Router();

router.delete("/:foodId/reviews/:reviewId/comments/:commentId", deleteComment);
router.put("/:foodId/reviews/:reviewId/comments/:commentId", updateComment);
router.delete("/:foodId/reviews/:reviewId", deleteReview);
router.put("/:foodId/reviews/:reviewId", updateReview);
export default router;
