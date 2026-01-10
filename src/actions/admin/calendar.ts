"use server";

import { db } from "@/lib/db";

export const getCalendarBookings = async (start: Date, end: Date) => {
  try {
    const bookings = await db.booking.findMany({
      where: {
        // Lấy các booking nằm trong khoảng thời gian view của lịch
        OR: [
          {
            checkIn: { lte: end },
            checkOut: { gte: start },
          },
        ],
        status: {
            not: "CANCELLED"
        }
      },
      select: {
        id: true,
        checkIn: true,
        checkOut: true,
        status: true,
        guestName: true,
        room: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Map dữ liệu về format thư viện lịch (ví dụ FullCalendar) cần
    const events = bookings.map((booking) => ({
      id: booking.id,
      title: `${booking.room.name} - ${booking.guestName || "Khách"}`,
      start: booking.checkIn,
      end: booking.checkOut,
      resourceId: booking.room.id, // Dùng cho Gantt chart chia theo phòng
      status: booking.status,
    }));

    return { events };
  } catch (error) {
    return { error: "Lỗi lấy dữ liệu lịch!" };
  }
};