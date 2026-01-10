"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Hành động: Trả lời đánh giá
 */
export const replyToReview = async (reviewId: string, replyText: string) => {
  try {
    // 1. Validate dữ liệu đầu vào
    if (!reviewId) {
      return { error: "Không tìm thấy ID đánh giá." };
    }

    if (!replyText || replyText.trim().length === 0) {
      return { error: "Nội dung phản hồi không được để trống." };
    }

    // 2. Kiểm tra review có tồn tại không
    const review = await db.review.findUnique({
        where: { id: reviewId }
    });

    if (!review) {
        return { error: "Đánh giá này không còn tồn tại." };
    }

    // 3. Cập nhật nội dung trả lời
    await db.review.update({
      where: { id: reviewId },
      data: {
        adminReply: replyText,
        repliedAt: new Date(),
      },
    });

    // 4. Làm mới cache trang reviews
    revalidatePath("/admin/reviews");
    
    return { success: "Đã gửi phản hồi thành công!" };
  } catch (error) {
    console.log("[REPLY_REVIEW_ERROR]", error);
    return { error: "Lỗi hệ thống, vui lòng thử lại sau." };
  }
};

/**
 * Hành động: Xóa đánh giá
 */
export const deleteReview = async (reviewId: string) => {
  try {
    if (!reviewId) {
        return { error: "ID không hợp lệ." };
    }

    await db.review.delete({
      where: { id: reviewId },
    });

    revalidatePath("/admin/reviews");
    return { success: "Đã xóa đánh giá thành công." };
  } catch (error) {
    console.log("[DELETE_REVIEW_ERROR]", error);
    return { error: "Không thể xóa đánh giá này." };
  }
};