"use server";

import { db } from "@/lib/db";

export const getDashboardStats = async () => {
  try {
    // 1. Tổng doanh thu (Chỉ tính đơn đã thanh toán hoặc đã check-out)
    const paidBookings = await db.booking.findMany({
      where: {
        status: { in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"] }
      }
    });
    
    const revenue = paidBookings.reduce((total, booking) => {
      return total + Number(booking.totalPrice);
    }, 0);

    // 2. Số lượng đơn đặt phòng
    const bookingsCount = await db.booking.count();

    // 3. Số lượng phòng đang hoạt động
    const activeRoomsCount = await db.room.count({
      where: { isAvailable: true }
    });

    // 4. Giao dịch gần đây (Lấy 5 đơn mới nhất)
    const recentBookings = await db.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        room: true,
      },
    });

    // 5. Tính toán doanh thu theo tháng (cho biểu đồ)
    const graphRevenue = await getGraphRevenue();

    return {
      revenue,
      bookingsCount,
      activeRoomsCount,
      recentBookings,
      graphRevenue // Trả thêm dữ liệu biểu đồ
    };
  } catch (error) {
    console.log("[DASHBOARD_GET]", error);
    return null;
  }
};

// Hàm phụ: Nhóm doanh thu theo 12 tháng
const getGraphRevenue = async () => {
  const paidBookings = await db.booking.findMany({
    where: {
      status: { in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"] }
    }
  });

  const monthlyRevenue: { [key: number]: number } = {};

  // Khởi tạo 12 tháng = 0
  for (let i = 0; i < 12; i++) {
    monthlyRevenue[i] = 0;
  }

  // Cộng dồn tiền vào từng tháng
  for (const order of paidBookings) {
    const month = order.createdAt.getMonth(); // 0 -> 11
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(order.totalPrice);
  }

  // Format lại cấu trúc cho Recharts
  const graphData = [
    { name: "Thg 1", total: 0 },
    { name: "Thg 2", total: 0 },
    { name: "Thg 3", total: 0 },
    { name: "Thg 4", total: 0 },
    { name: "Thg 5", total: 0 },
    { name: "Thg 6", total: 0 },
    { name: "Thg 7", total: 0 },
    { name: "Thg 8", total: 0 },
    { name: "Thg 9", total: 0 },
    { name: "Thg 10", total: 0 },
    { name: "Thg 11", total: 0 },
    { name: "Thg 12", total: 0 },
  ];

  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }

  return graphData;
};