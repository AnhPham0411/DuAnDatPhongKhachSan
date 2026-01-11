"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sendBookingConfirmationEmail } from "@/lib/mail";

// 1. Schema định nghĩa dữ liệu đầu vào
const BookingSchema = z.object({
  roomId: z.string(),
  checkIn: z.date(),
  checkOut: z.date(),
  guestName: z.string().min(1, "Tên khách là bắt buộc"),
  guestPhone: z.string().min(1, "SĐT là bắt buộc"),
  guestEmail: z.string().email("Email không hợp lệ"),
  note: z.string().optional(),
  totalPrice: z.number().min(0),
});

/**
 * ACTION: TẠO ĐƠN ĐẶT PHÒNG MỚI
 */
export const createBooking = async (values: z.infer<typeof BookingSchema>) => {
  try {
    // 2. Kiểm tra đăng nhập
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
      return { error: "Bạn cần đăng nhập để thực hiện đặt phòng!" };
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // Validate dữ liệu
    const validated = BookingSchema.safeParse(values);
    if (!validated.success) return { error: "Dữ liệu không hợp lệ" };

    const { roomId, checkIn, checkOut, totalPrice, ...guestInfo } = validated.data;

    // 3. Thực hiện Transaction
    const result = await db.$transaction(async (tx) => {
      // B1: Kiểm tra phòng trống (Chống trùng lịch)
      const conflictingBooking = await tx.booking.findFirst({
        where: {
          roomId,
          status: { not: "CANCELLED" },
          OR: [
            {
              checkIn: { lt: checkOut },
              checkOut: { gt: checkIn },
            },
          ],
        },
      });

      if (conflictingBooking) {
        throw new Error("Phòng đã có người đặt trong khoảng thời gian này!");
      }

      // B2: Tạo đơn đặt phòng
      const booking = await tx.booking.create({
        data: {
          userId,
          roomId,
          checkIn,
          checkOut,
          totalPrice,
          status: "PENDING",
          paymentStatus: "UNPAID",
          ...guestInfo,
        },
        include: {
          room: true // Lấy thêm thông tin phòng để gửi mail
        }
      });

      // B3: Tạo bản ghi thanh toán (Mặc định chưa thanh toán)
      await tx.payment.create({
        data: {
          bookingId: booking.id,
          amount: totalPrice,
          provider: "CASH_AT_COUNTER",
          status: "UNPAID",
          transactionCode: `PAY-${Date.now()}-${booking.id.slice(-4).toUpperCase()}`,
        },
      });

      return { 
        success: true, 
        bookingId: booking.id, 
        roomName: booking.room.name 
      };
    });

    // 4. GỬI MAIL XÁC NHẬN (Sau khi DB đã lưu xong)
    if (result.success) {
      const formattedPrice = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(totalPrice);

      // Gọi hàm gửi mail (không await để trả kết quả về UI nhanh hơn)
      sendBookingConfirmationEmail(userEmail, {
        roomName: result.roomName,
        checkIn: checkIn.toLocaleDateString("vi-VN"),
        checkOut: checkOut.toLocaleDateString("vi-VN"),
        totalPrice: formattedPrice,
      }).catch(err => console.error("MAIL_SENDING_ERROR:", err));
    }

    // 5. Làm mới dữ liệu các trang liên quan
    revalidatePath(`/rooms/${roomId}`);
    revalidatePath("/my-bookings");
    revalidatePath("/admin/bookings");

    return { success: "Đặt phòng thành công!", bookingId: result.bookingId };

  } catch (error: any) {
    console.error("CREATE_BOOKING_ERROR:", error);
    return { error: error.message || "Đã xảy ra lỗi khi đặt phòng!" };
  }
};

/**
 * ACTION: HỦY ĐƠN ĐẶT PHÒNG
 */
export const cancelBooking = async (bookingId: string) => {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Bạn chưa đăng nhập!" };

    const booking = await db.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) return { error: "Không tìm thấy đơn đặt phòng!" };

    // Kiểm tra quyền: Chủ đơn hoặc ADMIN
    const isOwner = booking.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return { error: "Bạn không có quyền thực hiện hành động này!" };
    }

    // Kiểm tra trạng thái có được phép hủy không
    if (["CHECKED_IN", "CHECKED_OUT", "CANCELLED"].includes(booking.status)) {
      return { error: "Không thể hủy đơn đã sử dụng hoặc đã hủy!" };
    }

    await db.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" }
    });

    revalidatePath("/my-bookings");
    revalidatePath(`/rooms/${booking.roomId}`);
    revalidatePath("/admin/bookings");
    
    return { success: "Đã hủy đơn đặt phòng thành công!" };
  } catch (error) {
    console.error("CANCEL_ERROR:", error);
    return { error: "Lỗi hệ thống khi hủy đơn!" };
  }
};