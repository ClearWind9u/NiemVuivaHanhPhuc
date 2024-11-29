import Food from "../models/foods.model.js";

// Sửa bình luận
export const updateComment = async (req, res) => {
    try {
        const { foodId, reviewId, commentId } = req.params;
        const { newComment } = req.body;  // Dữ liệu cần cập nhật, ví dụ như nội dung bình luận mới

        // Tìm thực phẩm theo foodId
        const food = await Food.findOne({ _id: foodId });
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }

        // Tìm review theo reviewId
        const review = food.reviews.find((r) => r._id.toString() === reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Tìm commentIndex theo commentId
        const commentIndex = review.comments.findIndex((c) => c._id.toString() === commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Cập nhật nội dung của bình luận
        review.comments[commentIndex].comment = newComment;  // Cập nhật nội dung bình luận

        // Lưu lại thực phẩm sau khi cập nhật
        await food.save();

        res.status(200).json({ message: "Comment updated successfully", comment: review.comments[commentIndex] });
    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//Xóa bình luận
export const deleteComment = async (req, res) => {
    try {
        const { foodId, reviewId, commentId } = req.params;
        // Tìm thực phẩm theo foodId
        const food = await Food.findOne({ _id: foodId });
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }

        // Tìm review theo reviewId
        const review = food.reviews.find((r) => r._id.toString() === reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Tìm commentIndex theo commentId
        const commentIndex = review.comments.findIndex((c) => c._id.toString() === commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found" });
        }
        // Xóa comment đó khỏi danh sách comments
        review.comments.splice(commentIndex, 1);
        await food.save();

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//Xóa nhận xét
export const deleteReview = async (req, res) => {
    try {
        const { foodId, reviewId } = req.params;
        // Tìm thực phẩm theo foodId
        const food = await Food.findOne({ _id: foodId });
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }

        // Tìm reviewIndex theo reviewId
        const reviewIndex = food.reviews.findIndex((r) => r._id.toString() === reviewId);
        if (!reviewIndex === -1) {
            return res.status(404).json({ message: "Review not found" });
        }
        // Xóa review đó khỏi danh sách reviews
        food.reviews.splice(reviewIndex, 1);
        await food.save();

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
