"use server";

import { db } from "@/lib/db";
import { startOfMonth, endOfMonth } from "date-fns";

// --- 1. DASHBOARD STATS ---
export async function getDashboardStats() {
  const userCount = await db.user.count({ where: { role: "USER" } });
  const bookingCount = await db.booking.count();
  const roomCount = await db.room.count();
  
  // Tính doanh thu (Tổng các booking đã PAID)
  const revenue = await db.payment.aggregate({
    _sum: { amount: true },
  });

  return {
    users: userCount,
    bookings: bookingCount,
    rooms: roomCount,
    revenue: Number(revenue._sum.amount || 0),
  };
}

// --- 2. DATA CHO CÁC TRANG QUẢN LÝ ---
export async function getAmenities() {
  return await db.amenity.findMany({ orderBy: { name: "asc" } });
}

export async function getRoomTypes() {
  return await db.roomType.findMany({
    include: { _count: { select: { rooms: true } } },
    orderBy: { name: "asc" },
  });
}

// --- 3. DATA CHO CALENDAR (KILLER FEATURE) ---
export async function getCalendarData() {
  return await db.room.findMany({
    include: {
      roomType: true,
      bookings: {
        where: {
          // Lấy booking từ hôm nay trở đi để hiển thị lên lịch
          checkIn: { gte: new Date() },
          status: { not: "CANCELLED" }
        },
        include: { user: { select: { name: true, email: true } } }
      }
    },
    orderBy: { name: "asc" }
  });
}

export async function getBookings() {
  return await db.booking.findMany({
    include: {
      user: { select: { name: true, email: true } }, // Lấy tên khách
      room: { select: { name: true } },             // Lấy tên phòng
    },
    orderBy: { createdAt: "desc" }, // Mới nhất lên đầu
  });
}