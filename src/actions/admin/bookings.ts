"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { BookingStatus, PaymentStatus } from "@prisma/client";

// --- 1. Cập nhật trạng thái Đặt phòng ---
export const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
  try {
    await db.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    revalidatePath("/admin/bookings");
    return { success: "Cập nhật trạng thái thành công!" };
  } catch (error) {
    return { error: "Lỗi hệ thống!" };
  }
};

// --- 2. Cập nhật trạng thái Thanh toán (Quan trọng) ---
export const updatePaymentStatus = async (bookingId: string, paymentStatus: PaymentStatus) => {
  try {
    // Dùng Transaction để đảm bảo tính toàn vẹn dữ liệu
    await db.$transaction(async (tx) => {
      // B1: Cập nhật status trong bảng Booking
      const booking = await tx.booking.update({
        where: { id: bookingId },
        data: { paymentStatus },
      });

      // B2: Đồng bộ sang bảng Payment
      // Kiểm tra xem đã có bản ghi Payment chưa
      const existingPayment = await tx.payment.findUnique({
        where: { bookingId },
      });

      if (existingPayment) {
        // Nếu có rồi -> Update trạng thái
        await tx.payment.update({
          where: { bookingId },
          data: { status: paymentStatus },
        });
      } else if (paymentStatus === "PAID") {
        // Nếu chưa có mà admin đánh dấu là PAID -> Tạo mới bản ghi Payment (Tiền mặt)
        await tx.payment.create({
          data: {
            bookingId,
            amount: booking.totalPrice,
            provider: "CASH_AT_COUNTER", // Mặc định thu tiền mặt tại quầy
            status: "PAID",
            transactionCode: `MANUAL-${Date.now()}`,
          },
        });
      }
    });

    revalidatePath("/admin/bookings");
    return { success: "Cập nhật thanh toán thành công!" };
  } catch (error) {
    console.log("UPDATE_PAYMENT_ERROR", error);
    return { error: "Lỗi hệ thống!" };
  }
};

// --- 3. Xóa đơn ---
export const deleteBooking = async (bookingId: string) => {
  try {
    await db.booking.delete({ where: { id: bookingId } });
    revalidatePath("/admin/bookings");
    return { success: "Đã xóa đơn đặt phòng!" };
  } catch (error) {
    return { error: "Không thể xóa đơn này!" };
  }
};