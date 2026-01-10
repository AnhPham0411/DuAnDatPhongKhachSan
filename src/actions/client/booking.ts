"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth"; // ⚠️ Kiểm tra đúng đường dẫn file auth của bạn (vd: @/lib/auth hoặc @/auth)
import { revalidatePath } from "next/cache";
import { z } from "zod";

// 1. Schema: Bỏ userId ra vì ta sẽ lấy từ Session
const BookingSchema = z.object({
  roomId: z.string(),
  // userId: z.string(), <--- KHÔNG NHẬN TỪ CLIENT
  checkIn: z.date(),
  checkOut: z.date(),
  guestName: z.string().min(1, "Tên khách là bắt buộc"),
  guestPhone: z.string().min(1, "SĐT là bắt buộc"),
  guestEmail: z.string().email("Email không hợp lệ"),
  note: z.string().optional(),
  totalPrice: z.number().min(0),
});

export const createBooking = async (values: z.infer<typeof BookingSchema>) => {
  try {
    // 2. LẤY SESSION ĐỂ XÁC THỰC USER
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Bạn cần đăng nhập để đặt phòng!" };
    }
    const userId = session.user.id; // ✅ ID chính chủ từ server

    // Validate dữ liệu còn lại
    const validated = BookingSchema.safeParse(values);
    if (!validated.success) return { error: "Dữ liệu không hợp lệ" };

    const { roomId, checkIn, checkOut, totalPrice, ...guestInfo } = validated.data;

    // 3. TRANSACTION: Xử lý đặt phòng an toàn
    return await db.$transaction(async (tx) => {
      // B1: Kiểm tra "Race Condition" - Chống trùng lịch
      const conflictingBooking = await tx.booking.findFirst({
        where: {
          roomId,
          status: { not: "CANCELLED" }, // Bỏ qua đơn đã hủy
          OR: [
            {
              // Logic kiểm tra giao nhau thời gian
              checkIn: { lt: checkOut },
              checkOut: { gt: checkIn },
            },
          ],
        },
      });

      if (conflictingBooking) {
        // Rollback ngay lập tức
        throw new Error("Phòng này vừa có người đặt nhanh hơn bạn! Vui lòng chọn ngày khác.");
      }

      // B2: Tạo Booking
      const booking = await tx.booking.create({
        data: {
          userId, // ✅ Sử dụng userId từ session
          roomId,
          checkIn,
          checkOut,
          totalPrice,
          status: "PENDING",
          paymentStatus: "UNPAID",
          ...guestInfo,
        },
      });

      // B3: Tạo Payment
      await tx.payment.create({
        data: {
          bookingId: booking.id,
          amount: totalPrice,
          provider: "CASH_AT_COUNTER",
          status: "UNPAID",
          transactionCode: `PAY-${Date.now()}`,
        },
      });

      return { success: "Đặt phòng thành công!", bookingId: booking.id };
    });

  } catch (error: any) {
    console.error("CREATE_BOOKING_ERROR", error);
    return { error: error.message || "Lỗi hệ thống!" };
  } finally {
    // Revalidate data
    if (values.roomId) revalidatePath(`/rooms/${values.roomId}`);
    revalidatePath("/my-bookings");
    revalidatePath("/admin/bookings");
  }
};

export const cancelBooking = async (bookingId: string) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Bạn chưa đăng nhập!" };
    }

    const booking = await db.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) return { error: "Không tìm thấy đơn!" };

    // Kiểm tra quyền: Phải là chủ đơn hoặc là ADMIN mới được hủy
    // (Ép kiểu role về string để tránh lỗi TS nếu role là enum)
    const userRole = session.user.role as string;
    
    if (booking.userId !== session.user.id && userRole !== "ADMIN") {
      return { error: "Bạn không có quyền hủy đơn này!" };
    }

    if (["CHECKED_IN", "CHECKED_OUT", "CANCELLED"].includes(booking.status)) {
      return { error: "Không thể hủy đơn ở trạng thái hiện tại!" };
    }

    await db.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" }
    });

    revalidatePath("/my-bookings");
    revalidatePath(`/rooms/${booking.roomId}`);
    
    return { success: "Đã hủy đơn đặt phòng!" };
  } catch (error) {
    console.log("CANCEL_ERROR", error);
    return { error: "Lỗi hệ thống!" };
  }
};